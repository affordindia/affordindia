import axios from "./axios";

// List reviews for a product
export const getProductReviews = async (productId) => {
    // console.log("API CALL: getProductReviews", productId);
    const res = await axios.get(`/products/${productId}/reviews`);
    return res.data;
};

// Get a single review for a product
export const getProductReview = async (productId, reviewId) => {
    // console.log("API CALL: getProductReview", productId, reviewId);
    const res = await axios.get(`/products/${productId}/reviews/${reviewId}`);
    return res.data;
};

// Get current user's review for a product
export const getUserProductReview = async (productId) => {
    // console.log("API CALL: getUserProductReview", productId);
    const res = await axios.get(
        `/products/${productId}/reviews/user/my-review`
    );
    return res.data;
};

// Create a review for a product with optional images
export const createProductReview = async (
    productId,
    reviewData,
    images = []
) => {
    // console.log("API CALL: createProductReview", productId, reviewData, images);

    const formData = new FormData();

    // Add review data
    formData.append("rating", reviewData.rating);
    formData.append("comment", reviewData.comment || "");

    // Add images if provided
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            formData.append("images", image);
        });
    }

    const res = await axios.post(`/products/${productId}/reviews`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// Update a review for a product with optional images
export const updateProductReview = async (
    productId,
    reviewId,
    reviewData,
    images = [],
    imageAction = "add"
) => {
    // console.log(
    //     "API CALL: updateProductReview",
    //     productId,
    //     reviewId,
    //     reviewData,
    //     images,
    //     imageAction
    // );

    const formData = new FormData();

    // Add review data
    if (reviewData.rating !== undefined) {
        formData.append("rating", reviewData.rating);
    }
    if (reviewData.comment !== undefined) {
        formData.append("comment", reviewData.comment);
    }

    // Add image action
    formData.append("imageAction", imageAction);

    // Add images if provided
    if (images && images.length > 0) {
        images.forEach((image, index) => {
            formData.append("images", image);
        });
    }

    const res = await axios.put(
        `/products/${productId}/reviews/${reviewId}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

// Delete a review for a product
export const deleteProductReview = async (productId, reviewId) => {
    // console.log("API CALL: deleteProductReview", productId, reviewId);
    const res = await axios.delete(
        `/products/${productId}/reviews/${reviewId}`
    );
    return res.data;
};

// Delete specific images from a review
export const deleteReviewImages = async (productId, reviewId, imageIds) => {
    // console.log("API CALL: deleteReviewImages", productId, reviewId, imageIds);
    const res = await axios.delete(
        `/products/${productId}/reviews/${reviewId}/images`,
        {
            data: { imageIds },
        }
    );
    return res.data;
};
