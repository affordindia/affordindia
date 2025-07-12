import axios from "./axios";

// List reviews for a product
export const getProductReviews = async (productId) => {
    console.log("API CALL: getProductReviews", productId);
    const res = await axios.get(`/products/${productId}/reviews`);
    return res.data;
};

// Get a single review for a product
export const getProductReview = async (productId, reviewId) => {
    console.log("API CALL: getProductReview", productId, reviewId);
    const res = await axios.get(`/products/${productId}/reviews/${reviewId}`);
    return res.data;
};

// Create a review for a product
export const createProductReview = async (productId, reviewData) => {
    console.log("API CALL: createProductReview", productId, reviewData);
    const res = await axios.post(`/products/${productId}/reviews`, reviewData);
    return res.data;
};

// Update a review for a product
export const updateProductReview = async (productId, reviewId, reviewData) => {
    console.log(
        "API CALL: updateProductReview",
        productId,
        reviewId,
        reviewData
    );
    const res = await axios.put(
        `/products/${productId}/reviews/${reviewId}`,
        reviewData
    );
    return res.data;
};

// Delete a review for a product
export const deleteProductReview = async (productId, reviewId) => {
    console.log("API CALL: deleteProductReview", productId, reviewId);
    const res = await axios.delete(
        `/products/${productId}/reviews/${reviewId}`
    );
    return res.data;
};
