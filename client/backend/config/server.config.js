const config = {
    pagination: {
        defaultLimit: 20,
        maxLimit: 100,
    },
    products: {
        newProductDays: 30, // Products added in the last X days are 'new'
        popularMinViews: 100, // Minimum views to be considered popular
        popularMinSales: 10, // Minimum salesCount to be considered popular
        relatedLimit: 8, // Number of related products to return
    },
    // Add other global configs here as needed
};

export default config;
