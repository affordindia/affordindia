import React from "react";
import { useOrderContext } from "../context/OrderContext";

const Orders = () => {
  const {
    orders,
    selectedOrder,
    setSelectedOrder,
    handleStatusChange,
    deleteOrder,
    loading,
    error,
  } = useOrderContext();

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "text-green-600 font-semibold";
      case "shipped":
        return "text-yellow-600 font-semibold";
      case "pending":
        return "text-red-600 font-semibold";
      case "processing":
        return "text-blue-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-[#2c2a4a]">All Orders</h2>
      <table className="min-w-full bg-white border border-gray-300 text-sm">
        <thead className="bg-gray-100 text-[#2c2a4a]">
          <tr>
            <th className="py-2 px-3 border-b">Customer</th>
            <th className="py-2 px-3 border-b">Email</th>
            <th className="py-2 px-3 border-b">Items</th>
            <th className="py-2 px-3 border-b">Payment</th>
            <th className="py-2 px-3 border-b">Status</th>
            <th className="py-2 px-3 border-b">Total</th>
            <th className="py-2 px-3 border-b">Date</th>
            <th className="py-2 px-3 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="py-2 px-3 border-b">{order.user}</td>
              <td className="py-2 px-3 border-b">{order.email}</td>
              <td className="py-2 px-3 border-b">{order.itemsCount}</td>
              <td className="py-2 px-3 border-b">{order.paymentStatus}</td>
              <td className="py-2 px-3 border-b">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value)
                  }
                  className={`border px-2 py-1 rounded ${getStatusColor(
                    order.status
                  )}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </td>
              <td className="py-2 px-3 border-b">₹{order.total.toFixed(2)}</td>
              <td className="py-2 px-3 border-b">
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td className="py-2 px-3 border-b text-center">
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setSelectedOrder(order.fullOrder)}
                    className="bg-[#2c2a4a] text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-[#1f1d38] transition"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4 text-gray-500">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-[90%] max-w-md shadow-lg relative overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold text-[#2c2a4a] mb-4">
              Order Details
            </h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>

            <div className="mt-3">
              <p className="font-semibold">Shipping Address:</p>
              <p>
                {selectedOrder.shippingAddress?.houseNumber},{" "}
                {selectedOrder.shippingAddress?.street},{" "}
                {selectedOrder.shippingAddress?.landmark},{" "}
                {selectedOrder.shippingAddress?.area},{" "}
                {selectedOrder.shippingAddress?.city},{" "}
                {selectedOrder.shippingAddress?.state} -{" "}
                {selectedOrder.shippingAddress?.pincode},{" "}
                {selectedOrder.shippingAddress?.country}
              </p>
            </div>

            <p className="mt-2">
              <strong>Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>

            <div className="mt-4">
              <h4 className="font-semibold mb-2">Items:</h4>
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="border p-2 mb-2 rounded bg-gray-50">
                  <p><strong>Name:</strong> {item.product?.name || "N/A"}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ₹{item.price}</p>
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded mt-2"
                    />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
