import {
    getOrderByIdService,
    getAllOrdersService,
    updateOrderService,
    deleteOrderService,
} from "../services/order.service.js";
import {
    DEFAULT_ORDER_SKIP,
    DEFAULT_ORDER_LIMIT,
} from "../config/pagination.config.js";
import mongoose from "mongoose";
import Order from "../models/order.model.js";

export async function getOrderById(req, res, next) {
    try {
        const order = await getOrderByIdService(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
}

export async function getAllOrders(req, res, next) {
    try {
        // Build comprehensive filter object
        const filter = {};
        const aggregatePipeline = [];
        let useAggregation = false;

        // Multi-value support for status
        if (req.query.status) {
            if (Array.isArray(req.query.status)) {
                filter.status = { $in: req.query.status };
            } else {
                filter.status = req.query.status;
            }
        }

        // Multi-value support for paymentStatus
        if (req.query.paymentStatus) {
            if (Array.isArray(req.query.paymentStatus)) {
                filter.paymentStatus = { $in: req.query.paymentStatus };
            } else {
                filter.paymentStatus = req.query.paymentStatus;
            }
        }

        // User and coupon filters
        if (req.query.user && mongoose.Types.ObjectId.isValid(req.query.user))
            filter.user = req.query.user;

        if (
            req.query.coupon &&
            mongoose.Types.ObjectId.isValid(req.query.coupon)
        )
            filter.coupon = req.query.coupon;

        // Date range filters
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate)
                filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate)
                filter.createdAt.$lte = new Date(req.query.endDate);
        }

        // Amount range filters
        if (req.query.minAmount || req.query.maxAmount) {
            filter.total = {};
            if (req.query.minAmount && !isNaN(parseFloat(req.query.minAmount)))
                filter.total.$gte = parseFloat(req.query.minAmount);
            if (req.query.maxAmount && !isNaN(parseFloat(req.query.maxAmount)))
                filter.total.$lte = parseFloat(req.query.maxAmount);
        }

        // Payment method filter
        if (req.query.paymentMethod) {
            filter.paymentMethod = new RegExp(req.query.paymentMethod, "i");
        }

        // Has coupon filter
        if (req.query.hasCoupon !== undefined && req.query.hasCoupon !== "") {
            if (req.query.hasCoupon === "true") {
                filter["coupon.couponId"] = { $exists: true, $ne: null };
            } else if (req.query.hasCoupon === "false") {
                filter["coupon.couponId"] = { $exists: false };
            }
        }

        // Items count range filters
        if (req.query.minItems || req.query.maxItems) {
            useAggregation = true;
            const itemsFilter = {};
            if (req.query.minItems && !isNaN(parseInt(req.query.minItems))) {
                itemsFilter.$gte = parseInt(req.query.minItems);
            }
            if (req.query.maxItems && !isNaN(parseInt(req.query.maxItems))) {
                itemsFilter.$lte = parseInt(req.query.maxItems);
            }

            aggregatePipeline.push({
                $addFields: {
                    itemsCount: { $size: "$items" },
                },
            });
            aggregatePipeline.push({
                $match: {
                    ...filter,
                    itemsCount: itemsFilter,
                },
            });
        }

        // Search functionality (order ID, customer name, email, phone)
        if (req.query.search) {
            useAggregation = true;
            const searchRegex = new RegExp(req.query.search, "i");

            // Add lookup for user details
            aggregatePipeline.unshift(
                {
                    $lookup: {
                        from: "users",
                        localField: "user",
                        foreignField: "_id",
                        as: "userDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$userDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                }
            );

            const searchMatch = {
                $or: [
                    {
                        _id: mongoose.Types.ObjectId.isValid(req.query.search)
                            ? new mongoose.Types.ObjectId(req.query.search)
                            : null,
                    },
                    { orderId: searchRegex }, // Search by orderId
                    { "userDetails.name": searchRegex },
                    { "userDetails.email": searchRegex },
                    { "userDetails.phone": searchRegex }, // Added phone search for user
                    { receiverName: searchRegex },
                    { receiverPhone: searchRegex },
                    { trackingNumber: searchRegex },
                ].filter((condition) => {
                    // Remove null ObjectId condition if search is not a valid ObjectId
                    return !(condition._id === null);
                }),
            };

            if (!req.query.minItems && !req.query.maxItems) {
                aggregatePipeline.push({
                    $match: {
                        ...filter,
                        ...searchMatch,
                    },
                });
            } else {
                // Combine with items count filter
                const lastMatch =
                    aggregatePipeline[aggregatePipeline.length - 1];
                if (lastMatch && lastMatch.$match) {
                    Object.assign(lastMatch.$match, searchMatch);
                }
            }
        }

        // Customer name and email specific filters
        if (req.query.customerName || req.query.customerEmail) {
            useAggregation = true;

            if (!aggregatePipeline.some((stage) => stage.$lookup)) {
                aggregatePipeline.unshift(
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$userDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    }
                );
            }

            const customerFilter = {};
            if (req.query.customerName) {
                customerFilter["userDetails.name"] = new RegExp(
                    req.query.customerName,
                    "i"
                );
            }
            if (req.query.customerEmail) {
                customerFilter["userDetails.email"] = new RegExp(
                    req.query.customerEmail,
                    "i"
                );
            }

            if (!aggregatePipeline.some((stage) => stage.$match)) {
                aggregatePipeline.push({
                    $match: {
                        ...filter,
                        ...customerFilter,
                    },
                });
            } else {
                const lastMatch =
                    aggregatePipeline[aggregatePipeline.length - 1];
                if (lastMatch && lastMatch.$match) {
                    Object.assign(lastMatch.$match, customerFilter);
                }
            }
        }

        const options = {
            skip: req.query.skip
                ? parseInt(req.query.skip)
                : DEFAULT_ORDER_SKIP,
            limit: req.query.limit
                ? parseInt(req.query.limit)
                : DEFAULT_ORDER_LIMIT,
            sort: req.query.sort
                ? JSON.parse(req.query.sort)
                : { createdAt: -1 },
        };

        let result;
        if (useAggregation) {
            // Always add user lookup at the beginning if not already added
            if (
                !aggregatePipeline.some(
                    (stage) => stage.$lookup && stage.$lookup.from === "users"
                )
            ) {
                aggregatePipeline.unshift(
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "userDetails",
                        },
                    },
                    {
                        $unwind: {
                            path: "$userDetails",
                            preserveNullAndEmptyArrays: true,
                        },
                    }
                );
            }

            // Add populations to aggregation
            aggregatePipeline.push(
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "productDetails",
                    },
                },
                {
                    $lookup: {
                        from: "coupons",
                        localField: "coupon.couponId",
                        foreignField: "_id",
                        as: "couponDetails",
                    },
                }
            );

            // Add sorting, skip, and limit
            aggregatePipeline.push(
                { $sort: options.sort },
                { $skip: options.skip },
                { $limit: options.limit }
            );

            const orders = await Order.aggregate(aggregatePipeline);

            // Count total for pagination (run same pipeline but with count)
            const countPipeline = [...aggregatePipeline];
            const sortIndex = countPipeline.findIndex((stage) => stage.$sort);
            if (sortIndex !== -1) {
                countPipeline.splice(sortIndex); // Remove sort, skip, limit for count
            }
            countPipeline.push({ $count: "total" });

            const totalResult = await Order.aggregate(countPipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;

            result = { orders, total };
        } else {
            result = await getAllOrdersService(filter, options);
        }

        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req, res, next) {
    try {
        const order = await updateOrderService(req.params.id, req.body);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
}

export async function deleteOrder(req, res, next) {
    try {
        const order = await deleteOrderService(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        next(error);
    }
}

// Add more as needed
