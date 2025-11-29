import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/product.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import Loader from "../components/common/Loader.jsx";
import ReviewsPreview from "../components/review/ReviewsPreview";
import HighlightsSection from "../components/productDetail/HighlightsSection.jsx";
import YouMightAlsoLike from "../components/home/YouMightAlsoLike.jsx";
import { FaHeart } from "react-icons/fa6";

const ProductDetail = () => {
    // Desktop-only zoom effect on mouse hover
    const [zoomStyle, setZoomStyle] = useState({});
    const handleMouseMove = (e) => {
        const { left, top, width, height } =
            e.currentTarget.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(2)",
        });
    };
    const handleMouseLeave = () => {
        setZoomStyle({
            transform: "scale(1)",
            transformOrigin: "center center",
        });
    };
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { cart, addToCart } = useCart();
    const {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        loading: wishlistLoading,
    } = useWishlist();
    const { user } = useAuth();
    const [wishlistMsg, setWishlistMsg] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    // State for mobile image modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New state to track "Add to Cart" button processing
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        // Scroll to top whenever the product changes
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        setLoading(true);
        getProductById(id)
            .then((p) => {
                const prod = p.product || p;
                setProduct(prod);
                if (prod.images && prod.images.length > 0) {
                    setSelectedImage(prod.images[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = async () => {
        if (!product || addingToCart) return; // prevent if already processing

        setAddingToCart(true);
        try {
            // Await if addToCart returns a Promise, otherwise remove await
            await addToCart(product, 1);
        } catch (error) {
            // Optionally handle error here
            console.error("Failed to add to cart", error);
        }
        // You can remove this timeout if addToCart is synchronous or fast
        setTimeout(() => {
            setAddingToCart(false);
        }, 1000);
    };

    const handleAddToWishlist = async () => {
        if (!product) return;

        setWishlistMsg("");
        try {
            // Check if item is already in wishlist
            const isInWishlist = wishlist?.items?.some(
                (item) => item._id === product._id
            );

            if (isInWishlist) {
                await removeFromWishlist(product._id);
                setWishlistMsg("Removed from wishlist");
            } else {
                await addToWishlist(product._id);
                setWishlistMsg("Added to wishlist");
            }
        } catch (error) {
            setWishlistMsg("Please login to use wishlist");
        }

        // Clear message after 3 seconds
        setTimeout(() => setWishlistMsg(""), 3000);
    };

    if (loading) return <Loader fullScreen={true} />;
    if (!product)
        return <div className="p-8 text-center">Product not found</div>;

    // Stock status logic
    const stock =
        typeof product.stock === "number"
            ? product.stock
            : product.stock === 0
            ? 0
            : undefined;
    let stockStatus = null;
    if (!stock) {
        stockStatus = (
            <div className="text-red-600 font-medium">Out of Stock</div>
        );
    } else if (stock > 10) {
        stockStatus = (
            <div className="text-green-600 dark:text-green-400 font-medium">
                In Stock
            </div>
        );
    } else if (stock < 5) {
        stockStatus = (
            <div className="text-red-600 font-medium">
                Only {stock} left in stock.
            </div>
        );
    } else {
        stockStatus = (
            <div className="text-orange-500 font-medium">
                In Stock ({stock} left)
            </div>
        );
    }

    // Check if product is already in cart
    const isInCart = cart?.items?.some(
        (item) => item.product._id === product._id
    );

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 md:px-4 py-8 flex flex-col md:flex-row md:items-start gap-8 md:gap-12 text-[#404040] dark:text-gray-200">
                {/* LEFT SECTION: IMAGE DISPLAY */}
                <div className="flex-shrink-0 w-full md:w-[440px]">
                    <div
                        className="w-full aspect-square rounded-lg overflow-hidden border bg-white dark:bg-gray-900 relative"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setIsModalOpen(true)} // open modal on mobile
                    >
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-300 ease-out"
                            style={zoomStyle}
                        />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        {product.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumbnail-${idx}`}
                                onClick={() => setSelectedImage(img)}
                                className={`w-16 h-16 rounded-lg border cursor-pointer object-cover transition-all duration-200 ${
                                    selectedImage === img
                                        ? "ring-2 ring-[#404040]"
                                        : "opacity-80 hover:opacity-100"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT SECTION: DETAILS */}

                <div className="flex flex-col gap-3 flex-1 min-w-0 text-[#404040]">
                    <h1 className="text-4xl font-semibold break-words">
                        {product.name}
                    </h1>
                    {/* Only show ratings if there are actual reviews */}
                    {product.reviewsCount > 0 && (
                        <div className="text-lg">
                            ★ {product.ratings?.toFixed(1) || "0.0"} (
                            {product.reviewsCount} review
                            {product.reviewsCount !== 1 ? "s" : ""})
                        </div>
                    )}
                    <div className="text-2xl font-semibold">
                        {product.discount && product.discount > 0 ? (
                            <>
                                <span className="line-through text-gray-400 text-base">
                                    ₹{product.price}
                                </span>{" "}
                                <span className="font-bold text-2xl">
                                    ₹
                                    {Math.round(
                                        product.price *
                                            (1 - product.discount / 100)
                                    )}
                                </span>
                            </>
                        ) : (
                            <>₹{product.price}</>
                        )}
                    </div>
                    {stockStatus}

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4 flex-wrap">
                        {isInCart || addingToCart ? (
                            <Link
                                to="/cart"
                                className={`button ${
                                    addingToCart
                                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                                        : ""
                                }`}
                                tabIndex={addingToCart ? -1 : 0}
                                aria-disabled={addingToCart}
                                onClick={(e) =>
                                    addingToCart && e.preventDefault()
                                }
                            >
                                <span className="button-content montserrat-global">
                                    Go to Cart
                                </span>
                            </Link>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                disabled={!stock || addingToCart}
                                className={`button ${
                                    !stock || addingToCart
                                        ? "!bg-gray-300 cursor-not-allowed opacity-50"
                                        : ""
                                }`}
                            >
                                <span className="button-content montserrat-global">
                                    Add to Cart
                                </span>
                            </button>
                        )}
                     <button
              onClick={handleAddToWishlist}
              disabled={wishlistLoading}
              className={`px-4 py-2 rounded-md bg-white  focus:outline-none border border-[#A7A7A7] ${
                wishlistLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
                           <FaHeart
                className={`text-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                  wishlist?.items?.some((item) => item._id === product._id)
                    ? "text-red-500 fill-current"
                    : "text-[#AFAFAF] hover:text-[#ff5555]"
                }`}
              />
                        </button>
                    </div>
                    {wishlistMsg && (
                        <p className="text-sm mt-1 text-gray-500">
                            {wishlistMsg}
                        </p>
                    )}

                    {/* Description */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Description
                        </h2>
                        <div className="text-sm leading-relaxed">
                            {product.description
                                ? product.description
                                      .split(/\r?\n/)
                                      .map((para, idx) =>
                                          para.trim() ? (
                                              <p
                                                  key={idx}
                                                  className="mb-2 last:mb-0"
                                              >
                                                  {para}
                                              </p>
                                          ) : null
                                      )
                                : null}
                        </div>
                    </div>

                    {/* Product Details (after Description) */}
                    {product.productDescription &&
                        product.productDescription.trim() && (
                            <div className="mt-6">
                                <h2 className="text-lg font-semibold mb-2">
                                    Product Details
                                </h2>
                                <div className="text-sm leading-relaxed">
                                    {product.productDescription
                                        .split(/\r?\n/)
                                        .map((para, idx) =>
                                            para.trim() ? (
                                                <p
                                                    key={idx}
                                                    className="mb-2 last:mb-0"
                                                >
                                                    {para}
                                                </p>
                                            ) : null
                                        )}
                                </div>
                            </div>
                        )}
                </div>
            </div>

            <HighlightsSection product={product} />

            {/* Reviews Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-4 py-8">
                <ReviewsPreview
                    productId={id}
                    currentUserId={user?._id || user?.id}
                />
            </div>

            <YouMightAlsoLike />
            {/* MODAL FOR MOBILE IMAGE PREVIEW - Swipeable Gallery */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
                    <div className="relative w-full max-w-lg mx-auto">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 bg-white text-black rounded-full px-3 py-1 shadow text-lg"
                            style={{ zIndex: 10 }}
                        >
                            ✕
                        </button>
                        <div className="flex items-center justify-center gap-4">
                            {/* Previous button */}
                            <button
                                className="bg-white/70 text-black rounded-full px-2 py-1 shadow text-xl"
                                style={{ zIndex: 10 }}
                                onClick={() => {
                                    const idx =
                                        product.images.indexOf(selectedImage);
                                    if (idx > 0)
                                        setSelectedImage(
                                            product.images[idx - 1]
                                        );
                                }}
                                disabled={
                                    product.images.indexOf(selectedImage) === 0
                                }
                            >
                                &#8592;
                            </button>
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="max-w-full max-h-[80vh] object-contain rounded"
                            />
                            {/* Next button */}
                            <button
                                className="bg-white/70 text-black rounded-full px-2 py-1 shadow text-xl"
                                style={{ zIndex: 10 }}
                                onClick={() => {
                                    const idx =
                                        product.images.indexOf(selectedImage);
                                    if (idx < product.images.length - 1)
                                        setSelectedImage(
                                            product.images[idx + 1]
                                        );
                                }}
                                disabled={
                                    product.images.indexOf(selectedImage) ===
                                    product.images.length - 1
                                }
                            >
                                &#8594;
                            </button>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-2 mt-4 justify-center">
                            {product.images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`thumb-${idx}`}
                                    className={`w-12 h-12 rounded border cursor-pointer object-cover ${
                                        selectedImage === img
                                            ? "ring-2 ring-[#404040]"
                                            : "opacity-80 hover:opacity-100"
                                    }`}
                                    onClick={() => setSelectedImage(img)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductDetail;
