import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/product.js";
import { getProductReviews } from "../api/review.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { wishlist, fetchWishlist } = useWishlist();
    const [wishlistMsg, setWishlistMsg] = useState("");

    useEffect(() => {
        setLoading(true);
        Promise.all([getProductById(id), getProductReviews(id)])
            .then(([p, r]) => {
                setProduct(p.product || p);
                setReviews(r.reviews || r);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product) addToCart(product, 1);
    };

    const handleAddToWishlist = async () => {
        setWishlistMsg("");
        try {
            await fetchWishlist();
            setWishlistMsg("Added to wishlist (if logged in)");
        } catch {
            setWishlistMsg("Login to use wishlist");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!product)
        return <div className="p-8 text-center">Product not found</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <div className="text-lg text-gray-700 mb-4">₹{product.price}</div>
            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleAddToCart}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add to Cart
                </button>
                <button
                    onClick={handleAddToWishlist}
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                >
                    Add to Wishlist
                </button>
            </div>
            {wishlistMsg && (
                <div className="mb-4 text-sm text-gray-600">{wishlistMsg}</div>
            )}
            <h3 className="text-lg font-semibold mt-6 mb-2">Reviews</h3>
            <ul className="divide-y">
                {reviews.length === 0 && (
                    <li className="py-2 text-gray-500">No reviews yet.</li>
                )}
                {reviews.map((rev) => (
                    <li key={rev._id} className="py-2">
                        {rev.comment}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductDetail;
