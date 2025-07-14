import React, { useEffect, useState } from "react";
import {
    getFeaturedProducts,
    getNewProducts,
    getPopularProducts,
} from "../api/product.js";
import ExploreMaterials from "../components/home/ExploreMaterials.jsx";

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
        <>
            <div className="h-10"></div>
            <ExploreMaterials />
        </>
    );
};

export default Home;
