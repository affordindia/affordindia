import React from "react";
import { useWishlist } from "../context/WishlistContext.jsx";

const Wishlist = () => {
    const { wishlist } = useWishlist();
    if (!wishlist || !wishlist.items) {
        return (
            <div className="p-6 text-center text-gray-500">
                Login to use wishlist.
            </div>
        );
    }
    if (!wishlist.items.length) {
        return <div className="p-6 text-center">Your wishlist is empty.</div>;
    }
    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
            <ul className="divide-y">
                {wishlist.items.map((item) => (
                    <li key={item._id || item} className="py-3">
                        {item.name || item}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Wishlist;
