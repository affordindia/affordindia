const config = {
    pagination: {
        defaultLimit: 10,
        maxLimit: 100,
    },
    products: {
        newProductDays: 30, // Products added in the last X days are 'new'
        popularMinViews: 100, // Minimum views to be considered popular
        popularMinSales: 10, // Minimum salesCount to be considered popular
        relatedLimit: 8, // Number of related products to return
    },
    shipping: {
        minOrderForFree: 0, // Orders >= this get free shipping
        shippingFee: 0, // Shipping fee if below minOrderForFree
        discount: 0, // Default discount (can be extended)
    },
    // Add other global configs here as needed
};

export default config;
