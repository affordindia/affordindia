import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import { Link } from "react-router-dom";

const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹5000", min: 1000, max: 5000 },
    { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [selectedPrice, setSelectedPrice] = useState(null);

    const fetchProducts = async (params = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProducts(params);
            setProducts(data.products || data);
        } catch (err) {
            setError(err.message || "Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts({
            search,
            sort,
            ...(selectedPrice !== null
                ? {
                      minPrice: priceRanges[selectedPrice].min,
                      maxPrice: priceRanges[selectedPrice].max,
                  }
                : {}),
        });
    };

    const handleSort = (e) => {
        setSort(e.target.value);
        fetchProducts({
            search,
            sort: e.target.value,
            ...(selectedPrice !== null
                ? {
                      minPrice: priceRanges[selectedPrice].min,
                      maxPrice: priceRanges[selectedPrice].max,
                  }
                : {}),
        });
    };

    const handlePrice = (idx) => {
        setSelectedPrice(idx === selectedPrice ? null : idx);
        const params = { search, sort };
        if (idx !== selectedPrice) {
            params.minPrice = priceRanges[idx].min;
            params.maxPrice = priceRanges[idx].max;
        }
        fetchProducts(params);
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (error)
        return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input
                    className="border px-3 py-2 rounded w-full"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    type="submit"
                >
                    Search
                </button>
            </form>
            <div className="flex gap-4 mb-4 items-center">
                <select
                    className="border px-2 py-1 rounded"
                    value={sort}
                    onChange={handleSort}
                >
                    <option value="">Sort by</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="-price">Price (High to Low)</option>
                </select>
                <div className="flex gap-2 items-center">
                    <span className="text-sm">Price:</span>
                    {priceRanges.map((range, idx) => (
                        <label
                            key={range.label}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedPrice === idx}
                                onChange={() => handlePrice(idx)}
                                className="accent-blue-500"
                            />
                            <span className="text-xs">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => (
                    <li
                        key={p._id}
                        className="border rounded p-4 flex flex-col gap-2 bg-white"
                    >
                        <Link
                            to={`/products/${p._id}`}
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            {p.name}
                        </Link>
                        <div className="text-gray-700">₹{p.price}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
