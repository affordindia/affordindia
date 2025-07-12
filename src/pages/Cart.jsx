import React from "react";
import { useCartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart = [], updateQuantity, removeFromCart } = useCartContext();

  const totalAmount = cart.reduce((acc, item) => {
    const price =
      parseFloat((item.price || "0").toString().replace(/[^\d.]/g, "")) || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  if (!cart.length) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h1>
        <Link
          to="/silver"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      <div className="space-y-4">
        {cart.map((product) => {
          const price =
            parseFloat((product.price || "0").toString().replace(/[^\d.]/g, "")) ||
            0;
          const quantity = product.quantity || 1;

          return (
            <div
              key={product.id}
              className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-20 h-20 object-cover rounded shadow"
                />
                <div>
                  <h2 className="font-semibold">{product.title}</h2>
                  <p className="text-gray-600">Price: ₹{price}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Quantity Controller */}
                <div className="flex items-center bg-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() =>
                      updateQuantity(product.id, Math.max(1, quantity - 1))
                    }
                    className="px-3 py-1 text-lg bg-gray-300 hover:bg-gray-400"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      updateQuantity(
                        product.id,
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-12 text-center border-0 outline-none bg-gray-200"
                  />
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="px-3 py-1 text-lg bg-gray-300 hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>

                {/* Product Total */}
                <div>
                  <span className="text-lg font-bold">
                    ₹{(price * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="text-red-500 text-sm hover:underline"
                >
                  ✕ Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 text-right">
        <h2 className="text-xl font-semibold mb-2">
          Total: ₹{totalAmount.toFixed(2)}
        </h2>
        <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
