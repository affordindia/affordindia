import ProductCard from "../common/ProductCard";

const ProductList = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <div className="text-center py-16 text-gray-500 text-lg">
                No products found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
                <ProductCard key={product._id} product={product} />
            ))}
        </div>
    );
};

export default ProductList;
