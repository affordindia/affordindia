import React from "react";
import { useNavigate } from "react-router-dom";
import OrderStatusBadge from "../orders/OrderStatusBadge";

const RecentOrders = ({ stats, formatCurrency }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-text font-montserrat">
                    Recent Orders
                </h3>
                <button
                    onClick={() => navigate("/orders")}
                    className="text-sm text-admin-primary hover:text-admin-primary-dark transition-colors"
                >
                    View All
                </button>
            </div>
            <div className="space-y-3">
                {stats?.recentActivity?.recentOrders?.length > 0 ? (
                    stats.recentActivity.recentOrders.map((order) => (
                        <div
                            key={order.id}
                            className="flex items-center justify-between p-3 bg-admin-bg rounded-lg border border-admin-border hover:border-admin-primary cursor-pointer transition-all duration-200 hover:scale-105"
                            onClick={() => navigate(`/orders/${order.id}`)}
                        >
                            <div>
                                <p className="font-medium text-admin-text">
                                    #{order.orderNumber}
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    {order.customer}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-admin-text">
                                    {formatCurrency(order.total)}
                                </p>
                                <OrderStatusBadge
                                    status={order.status}
                                    size="sm"
                                />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-admin-text-secondary text-center py-4">
                        No recent orders
                    </p>
                )}
            </div>
        </div>
    );
};

export default RecentOrders;
