import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductContext } from '../context/ProductContext';
import { useCartContext } from '../context/CartContext';


const ProductDetail = () => {
  const { id } = useParams();
  const { products } = useProductContext();
  const { addToCart } = useCartContext();

  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="text-center py-10">
        Product not found. <Link to="/silver" className="text-blue-600">Go back</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.title} added to cart!`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8">
      {/* Product Section */}
      <div className="flex flex-col md:flex-row justify-center gap-8">
        <div className="md:w-1/4 max-w-[250px]">
          <img
            src={product.image}
            alt={product.title}
            className="w-full rounded-lg shadow"
          />
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {Array(4).fill(0).map((_, idx) => (
              <img
                key={idx}
                src={product.image}
                alt={`${product.title} thumbnail ${idx + 1}`}
                className="w-14 h-14 object-cover rounded border cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        <div className="md:w-2/3 max-w-xl space-y-4">
          <h1 className="text-2xl font-bold">{product.title}</h1>
          <div className="text-sm text-gray-600">
            ⭐ {product.rating} ★ <span className="ml-2">{product.stock} in stock</span>
          </div>
          <div className="text-xl font-semibold text-green-700">{product.price}</div>
          <div className="text-sm text-green-600">In Stock ({product.stock} left)</div>

        

        

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-black text-white rounded"
            >
              Add to Cart
            </button>
            <button className="px-3 py-2 border rounded">♡</button>
          </div>

          <div className="mt-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-700 mt-2">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 text-center">
        <div><div className="text-2xl">🪙</div><p className="font-medium">Authentic 999 Silver</p><p className="text-sm text-gray-500">Certified Purity</p></div>
        <div><div className="text-2xl">🧵</div><p className="font-medium">Artisan Crafted</p><p className="text-sm text-gray-500">Traditional Craftsmanship</p></div>
        <div><div className="text-2xl">🚚</div><p className="font-medium">Free Shipping</p><p className="text-sm text-gray-500">On orders above ₹999</p></div>
        <div><div className="text-2xl">↩️</div><p className="font-medium">Easy Returns</p><p className="text-sm text-gray-500">10-day return policy</p></div>
      </div>

    {/* You Might Also Like */}
<div className="mt-12">
  <h2 className="text-center text-lg font-semibold mb-4">
    YOU MIGHT ALSO LIKE THESE PRODUCTS
  </h2>
  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
    {Array(5)
      .fill(0)
      .map((_, idx) => {
        const similarProduct = {
          id: `similar-${idx + 1}`,
          title: `Silver Ring ${idx + 1}`,
          price: 1500,
          image: product.image,
        };

        return (
          <div
            key={idx}
            className="bg-white p-2 shadow rounded"
          >
            <img
              src={similarProduct.image}
              alt="Similar Product"
              className="w-full h-28 object-cover mb-2"
            />
            <p className="text-sm">{similarProduct.title}</p>
            <p className="text-xs text-gray-500">4.6 ★ | 300</p>
            <p className="text-sm font-semibold">₹{similarProduct.price}</p>
            <button
              onClick={() => {
                addToCart(similarProduct);
                alert(`${similarProduct.title} added to cart!`);
              }}
              className="w-full mt-1 bg-black text-white text-xs py-1 rounded"
            >
              Add to Cart
            </button>
          </div>
        );
      })}
  </div>
</div>


      {/* Customer Ratings & Reviews */}
      <div className="mt-12 flex flex-col md:flex-row gap-6">
        {/* Ratings */}
        <div className="md:w-1/3 bg-gray-50 p-4 shadow rounded">
          <h3 className="text-lg font-semibold">Customer rating</h3>
          <p className="text-3xl font-bold my-2">4.5/5</p>
          <div className="text-yellow-500 text-lg">★★★★★</div>
          <p className="text-sm text-gray-500 mt-1">Based on 128 reviews</p>

          <div className="mt-4 space-y-1">
            {[5,4,3,2,1].map(star => (
              <div key={star} className="flex items-center text-sm">
                <span className="w-4">{star}</span>
                <div className="bg-gray-200 h-2 flex-1 mx-2">
                  <div className="bg-yellow-400 h-2" style={{width: star===5?"70%":star===4?"20%":star===3?"8%":star===1?"2%":"0%"}}></div>
                </div>
                <span>{star===5?"70%":star===4?"20%":star===3?"8%":star===1?"2%":"0%"}</span>
              </div>
            ))}
          </div>

          <button className="mt-4 px-4 py-1 bg-blue-500 text-white rounded text-sm">Write a Review</button>
        </div>

        {/* Reviews */}
        <div className="md:w-2/3 space-y-4">
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="font-semibold">Priya S. <span className="text-sm text-gray-500">| July 10, 2025</span></p>
            <p className="text-sm font-medium">Beautiful craftsmanship!</p>
            <p className="text-sm text-gray-600">I bought this for my brother and he absolutely loved it! The silver work is exquisite and the pearl accent adds a touch of elegance. The packaging was also premium and perfect for gifting. Highly recommend!</p>
          </div>
          <div className="bg-gray-50 p-4 rounded shadow">
            <p className="font-semibold">Rahul M. <span className="text-sm text-gray-500">| July 10, 2025</span></p>
            <p className="text-sm font-medium">Great quality, well priced</p>
            <p className="text-sm text-gray-600">The rakhi is beautiful and well-crafted. The silver work is intricate and the pearl looks genuine. My only complaint is that it’s a bit expensive compared to similar products, but the quality is undeniable. Fast shipping and nice packaging.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/silver" className="text-blue-600">← Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetail;
