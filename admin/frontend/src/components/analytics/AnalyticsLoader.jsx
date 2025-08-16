import React from "react";

const AnalyticsLoader = () => {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="h-8 bg-admin-border rounded w-64 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-admin-border rounded w-48 animate-pulse"></div>
                </div>
                <div className="flex space-x-3">
                    <div className="h-10 bg-admin-border rounded w-32 animate-pulse"></div>
                    <div className="h-10 bg-admin-border rounded w-24 animate-pulse"></div>
                </div>
            </div>

            {/* Metrics cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border"
                    >
                        <div className="animate-pulse">
                            <div className="h-4 bg-admin-border rounded w-24 mb-2"></div>
                            <div className="h-8 bg-admin-border rounded w-16 mb-2"></div>
                            <div className="h-4 bg-admin-border rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
                    <div className="animate-pulse">
                        <div className="h-6 bg-admin-border rounded w-32 mb-4"></div>
                        <div className="h-64 bg-admin-border rounded"></div>
                    </div>
                </div>
                <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
                    <div className="animate-pulse">
                        <div className="h-6 bg-admin-border rounded w-24 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="h-6 bg-admin-border rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                    <div
                        key={i}
                        className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border"
                    >
                        <div className="animate-pulse">
                            <div className="h-6 bg-admin-border rounded w-32 mb-4"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((j) => (
                                    <div
                                        key={j}
                                        className="flex items-center space-x-3"
                                    >
                                        <div className="w-12 h-12 bg-admin-border rounded-lg"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-admin-border rounded w-3/4 mb-2"></div>
                                            <div className="h-3 bg-admin-border rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsLoader;
