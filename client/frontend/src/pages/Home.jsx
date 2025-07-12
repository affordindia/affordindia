import React, { useEffect, useState } from "react";
import {
    getFeaturedProducts,
    getNewProducts,
    getPopularProducts,
} from "../api/product.js";

const Home = () => {
    const [featured, setFeatured] = useState([]);
    const [popular, setPopular] = useState([]);
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Promise.all([
            getFeaturedProducts(),
            getPopularProducts(),
            getNewProducts(),
        ])
            .then(([f, p, n]) => {
                setFeatured(f.products || f);
                setPopular(p.products || p);
                setNewProducts(n.products || n);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Featured Products</h2>
            <ul>
                {featured.map((p) => (
                    <li key={p._id}>{p.name}</li>
                ))}
            </ul>
            <h2>Popular Products</h2>
            <ul>
                {popular.map((p) => (
                    <li key={p._id}>{p.name}</li>
                ))}
            </ul>
            <h2>New Arrivals</h2>
            <ul>
                {newProducts.map((p) => (
                    <li key={p._id}>{p.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
