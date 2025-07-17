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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {products.map((product) => (
                <div
                    key={product._id}
                    className="flex justify-center items-center"
                >
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
};

export default ProductList;
