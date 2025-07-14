import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import { getCategories } from "../../api/category";
import ProductCard from "../common/ProductCard";

const YouMightAlsoLike = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Get all categories
                const catRes = await getCategories();
                const categories = catRes.categories || catRes;
                // For each category, get 1 random product
                let prods = [];
                for (const cat of categories) {
                    const prodRes = await getProducts({
                        category: cat._id,
                        limit: 10,
                    });
                    const arr = prodRes.products || prodRes;
                    if (arr.length) {
                        // Pick a random product from this category
                        prods.push(arr[Math.floor(Math.random() * arr.length)]);
                    }
                }
                // If less than 5, fill with random products
                if (prods.length < 5) {
                    const allRes = await getProducts({ limit: 20 });
                    const all = allRes.products || allRes;
                    // Add randoms not already in prods
                    const used = new Set(prods.map((p) => p._id));
                    const extras = all.filter((p) => !used.has(p._id));
                    while (prods.length < 5 && extras.length) {
                        const idx = Math.floor(Math.random() * extras.length);
                        prods.push(extras.splice(idx, 1)[0]);
                    }
                }
                // Only 5
                setProducts(prods.slice(0, 5));
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="py-8 px-2 md:px-8 bg-secondary">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-6">
                You Might Also Like These Products
            </h2>
            {loading ? (
                <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 overflow-x-auto md:overflow-visible">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex justify-center items-center"
                        >
                            <ProductCard product={product} small />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default YouMightAlsoLike;
