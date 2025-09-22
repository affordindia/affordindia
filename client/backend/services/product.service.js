import Product from "../models/product.model.js";
import Category from "../models/category.model.js"; //necessary for populate
import config from "../config/server.config.js";

export const getProducts = async (filter, options) => {
    // Enhanced filter processing with material name resolution
    const processedFilter = { ...filter };

    // Handle category IDs directly
    if (filter.categoryIds && Array.isArray(filter.categoryIds)) {
        const categoryIds = filter.categoryIds.map((id) => id.toString());
        if (processedFilter.category) {
            // If category filter already exists, combine with $and
            processedFilter.$and = [
                { category: processedFilter.category },
                { category: { $in: categoryIds } },
            ];
            delete processedFilter.category;
        } else {
            processedFilter.category = { $in: categoryIds };
        }
        delete processedFilter.categoryIds;
    }

    // Handle category names -> category IDs conversion
    if (filter.categoryNames && Array.isArray(filter.categoryNames)) {
        try {
            const categories = await Category.find({
                name: {
                    $in: filter.categoryNames.map(
                        (name) => new RegExp(`^${name}$`, "i")
                    ),
                },
                status: "active",
            })
                .select("_id")
                .lean();

            if (categories.length > 0) {
                const categoryIds = categories.map((cat) => cat._id);
                if (processedFilter.category) {
                    // If category filter already exists, combine with $and
                    processedFilter.$and = [
                        { category: processedFilter.category },
                        { category: { $in: categoryIds } },
                    ];
                    delete processedFilter.category;
                } else {
                    processedFilter.category = { $in: categoryIds };
                }
            }
        } catch (error) {
            console.error("Error resolving category names:", error);
        }

        // Remove categoryNames from filter as it's not a Product field
        delete processedFilter.categoryNames;
    }

    // Execute query with enhanced filter
    const [products, totalCount] = await Promise.all([
        Product.find(processedFilter)
            .sort(options.sort)
            .skip(options.skip)
            .limit(options.limit)
            .populate("category")
            .populate("subcategories")
            .lean(),
        Product.countDocuments(processedFilter),
    ]);

    return { products, totalCount };
};

export const getProductById = async (id) => {
    return Product.findById(id)
        .populate("category")
        .populate("subcategories")
        .populate({
            path: "reviews",
            populate: { path: "user", select: "name" },
        })
        .lean();
};

export const getFeaturedProducts = async (limit = 10) => {
    return Product.find({ isFeatured: true })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .populate("subcategories")
        .lean();
};

export const getNewProducts = async (limit = 10) => {
    const date = new Date();
    date.setDate(date.getDate() - config.products.newProductDays);
    return Product.find({ createdAt: { $gte: date } })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .populate("subcategories")
        .lean();
};

export const getPopularProducts = async (limit = 10) => {
    return Product.find({
        $or: [
            { views: { $gte: config.products.popularMinViews } },
            { salesCount: { $gte: config.products.popularMinSales } },
        ],
    })
        .sort("-views -salesCount")
        .limit(limit)
        .populate("category")
        .populate("subcategories")
        .lean();
};

export const getRelatedProducts = async (
    productId,
    limit = config.products.relatedLimit
) => {
    const product = await Product.findById(productId).lean();
    if (!product || !product.category) return [];
    return Product.find({
        category: product.category,
        _id: { $ne: productId },
    })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .populate("subcategories")
        .lean();
};

export const getProductsByIds = async (productIds) => {
    const products = await Product.find({
        _id: { $in: productIds },
    })
        .populate("category")
        .populate("subcategories")
        .populate({
            path: "reviews",
            populate: { path: "user", select: "name" },
        })
        .lean();

    const foundIds = products.map((product) => product._id.toString());
    const failedIds = productIds.filter((id) => !foundIds.includes(id));

    return {
        count: products.length,
        products,
        failedIds: failedIds.length > 0 ? failedIds : undefined,
    };
};

// Add more product-related service functions as needed
