// src/context/OrderContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      const data = response.data;

      if (!data.success || !Array.isArray(data.orders || data.data)) {
        throw new Error("Invalid data format: expected an array");
      }

      // Use 'data.orders' or 'data.data' depending on API response
      const rawOrders = data.orders || data.data;

      // Normalize for frontend display
      const formattedOrders = rawOrders.map((order) => ({
        id: order._id,
        user: order.user?.name || order.user, // fallback if not populated
        email: order.user?.email || "N/A",
        itemsCount: order.items?.length || 0,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.total,
        date: order.createdAt,
        fullOrder: order,
      }));

      setOrders(formattedOrders);
      setError("");
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`/orders/${id}`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const deleteOrder = async (id) => {
  try {
    await axiosInstance.delete(`/orders/${id}`);
    setOrders((prev) => prev.filter((order) => order.id !== id));
  } catch (err) {
    console.error("Failed to delete order:", err);
    setError("Failed to delete order.");
  }
};


  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider
      value={{
        orders,
        selectedOrder,
        setSelectedOrder,
        handleStatusChange,
        deleteOrder,
        loading,
        error,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within an OrderProvider");
  }
  return context;
};
