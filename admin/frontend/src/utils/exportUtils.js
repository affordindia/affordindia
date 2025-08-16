// Utility functions for analytics data export

export const exportToCSV = (data, filename) => {
    const csvContent = convertToCSV(data);
    downloadFile(csvContent, filename, "text/csv");
};

export const exportToJSON = (data, filename) => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, filename, "application/json");
};

const convertToCSV = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return "";
    }

    const headers = Object.keys(data[0]);
    const csvRows = [];

    // Add headers
    csvRows.push(headers.join(","));

    // Add data rows
    for (const row of data) {
        const values = headers.map((header) => {
            const value = row[header];
            // Escape commas and quotes in values
            if (
                typeof value === "string" &&
                (value.includes(",") || value.includes('"'))
            ) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
};

const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};

// Format analytics data for export
export const formatAnalyticsForExport = (analyticsData, timeframe) => {
    const timestamp = new Date().toISOString().split("T")[0];

    return {
        overview: {
            filename: `analytics-overview-${timeframe}-${timestamp}.csv`,
            data: [analyticsData.overview],
        },
        revenue: {
            filename: `revenue-data-${timeframe}-${timestamp}.csv`,
            data: analyticsData.revenue?.chartData || [],
        },
        topProducts: {
            filename: `top-products-${timeframe}-${timestamp}.csv`,
            data: analyticsData.topProducts || [],
        },
        customers: {
            filename: `customer-analytics-${timeframe}-${timestamp}.csv`,
            data: analyticsData.customers?.topCustomers || [],
        },
    };
};
