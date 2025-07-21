import React from "react";
import { useWishlist } from "../context/WishlistContext.jsx";
import WishlistCard from "../components/wishlist/WishlistCard.jsx";

const Wishlist = () => {
    const { wishlist, loading } = useWishlist();

    if (loading) {
        return <div className="p-8 text-center">Loading wishlist...</div>;
    }

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
        <div className="max-w-6xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">
                Your Wishlist ({wishlist.items.length} items)
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {wishlist.items.map((item) => (
                    <WishlistCard key={item._id} product={item} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
