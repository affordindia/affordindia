import React, { useState } from "react";
import {
    FaFileInvoice,
    FaDownload,
    FaTimes,
    FaCalendar,
    FaHashtag,
    FaUser,
    FaMapMarkerAlt,
    FaBox,
    FaTruck,
    FaDollarSign,
} from "react-icons/fa";
import { downloadInvoicePDFByOrderId } from "../../api/invoice.api.js";

const InvoiceModal = ({ invoice, orderId, isOpen, onClose }) => {
    const [downloading, setDownloading] = useState(false);

    if (!isOpen || !invoice) return null;

    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return `₹${numAmount.toLocaleString("en-IN")}`;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDownload = async () => {
        if (!orderId) {
            alert("Order ID is required to download invoice");
            return;
        }

        try {
            setDownloading(true);
            const pdfBlob = await downloadInvoicePDFByOrderId(orderId);

            // Create download link
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice_${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to download invoice PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const invoiceData = invoice.invoiceData || {};

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-admin-card rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-admin-border">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-admin-border">
                    <div className="flex items-center gap-3">
                        <FaFileInvoice className="text-admin-primary w-6 h-6" />
                        <h2 className="text-xl font-semibold text-admin-text">
                            Invoice Details
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="flex items-center gap-2 px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50"
                        >
                            <FaDownload className="w-4 h-4" />
                            {downloading ? "Downloading..." : "Download PDF"}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-admin-text-secondary hover:text-admin-text transition-colors"
                        >
                            <FaTimes className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Invoice Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FaHashtag className="text-admin-primary w-5 h-5" />
                                <div>
                                    <p className="text-sm text-admin-text-secondary">
                                        Invoice Number
                                    </p>
                                    <p className="font-semibold text-admin-text">
                                        {invoice.invoiceNumber}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <FaCalendar className="text-admin-primary w-5 h-5" />
                                <div>
                                    <p className="text-sm text-admin-text-secondary">
                                        Invoice Date
                                    </p>
                                    <p className="font-semibold text-admin-text">
                                        {formatDate(invoice.generatedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <FaBox className="text-admin-primary w-5 h-5" />
                                <div>
                                    <p className="text-sm text-admin-text-secondary">
                                        Order ID
                                    </p>
                                    <p className="font-semibold text-admin-text">
                                        {invoiceData.order?.orderId || "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer & Business Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Billing Info */}
                        <div className="bg-admin-bg rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-admin-text mb-3 flex items-center gap-2">
                                <FaUser className="text-admin-primary w-4 h-4" />
                                Bill To
                            </h3>
                            <div className="space-y-2">
                                <p className="font-medium text-admin-text">
                                    {invoiceData.customer?.name || "N/A"}
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Phone:{" "}
                                    {invoiceData.customer?.phone || "N/A"}
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Email:{" "}
                                    {invoiceData.customer?.email || "N/A"}
                                </p>
                                {invoiceData.addresses?.billing && (
                                    <div className="mt-2 pt-2 border-t border-admin-border">
                                        <p className="text-sm text-admin-text-secondary">
                                            {
                                                invoiceData.addresses.billing
                                                    .houseNumber
                                            }
                                            ,{" "}
                                            {
                                                invoiceData.addresses.billing
                                                    .street
                                            }
                                        </p>
                                        {invoiceData.addresses.billing
                                            .landmark && (
                                            <p className="text-sm text-admin-text-secondary">
                                                {
                                                    invoiceData.addresses
                                                        .billing.landmark
                                                }
                                            </p>
                                        )}
                                        <p className="text-sm text-admin-text-secondary">
                                            {invoiceData.addresses.billing.city}
                                            ,{" "}
                                            {
                                                invoiceData.addresses.billing
                                                    .state
                                            }{" "}
                                            -{" "}
                                            {
                                                invoiceData.addresses.billing
                                                    .pincode
                                            }
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-admin-bg rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-admin-text mb-3 flex items-center gap-2">
                                <FaTruck className="text-admin-primary w-4 h-4" />
                                Ship To
                            </h3>
                            <div className="space-y-2">
                                <p className="font-medium text-admin-text">
                                    {invoiceData.addresses
                                        ?.isDifferentReceiver &&
                                    invoiceData.receiverInfo?.name
                                        ? invoiceData.receiverInfo.name
                                        : invoiceData.customer?.name || "N/A"}
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Phone:{" "}
                                    {invoiceData.addresses
                                        ?.isDifferentReceiver &&
                                    invoiceData.receiverInfo?.phone
                                        ? invoiceData.receiverInfo.phone
                                        : invoiceData.customer?.phone || "N/A"}
                                </p>
                                {invoiceData.addresses?.shipping && (
                                    <div className="mt-2 pt-2 border-t border-admin-border">
                                        <p className="text-sm text-admin-text-secondary">
                                            {
                                                invoiceData.addresses.shipping
                                                    .houseNumber
                                            }
                                            ,{" "}
                                            {
                                                invoiceData.addresses.shipping
                                                    .street
                                            }
                                        </p>
                                        {invoiceData.addresses.shipping
                                            .landmark && (
                                            <p className="text-sm text-admin-text-secondary">
                                                {
                                                    invoiceData.addresses
                                                        .shipping.landmark
                                                }
                                            </p>
                                        )}
                                        <p className="text-sm text-admin-text-secondary">
                                            {
                                                invoiceData.addresses.shipping
                                                    .city
                                            }
                                            ,{" "}
                                            {
                                                invoiceData.addresses.shipping
                                                    .state
                                            }{" "}
                                            -{" "}
                                            {
                                                invoiceData.addresses.shipping
                                                    .pincode
                                            }
                                        </p>
                                    </div>
                                )}
                                {invoiceData.addresses?.isDifferentReceiver && (
                                    <div className="mt-2 pt-2 border-t border-admin-border">
                                        <p className="text-xs text-admin-primary font-medium">
                                            Different receiver for this order
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Business Info */}
                    <div className="bg-admin-bg rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-admin-text mb-3 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-admin-primary w-4 h-4" />
                            Business Details
                        </h3>
                        <div className="space-y-2">
                            <p className="font-medium text-admin-text">
                                {invoiceData.business?.name || "N/A"}
                            </p>
                            <p className="text-sm text-admin-text-secondary">
                                GSTIN: {invoiceData.business?.gstin || "N/A"}
                            </p>
                            <p className="text-sm text-admin-text-secondary">
                                Email: {invoiceData.business?.email || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <h3 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaBox className="text-admin-primary w-4 h-4" />
                            Invoice Items ({invoiceData.items?.length || 0})
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-admin-primary text-white">
                                        <th className="border border-admin-border px-4 py-2 text-left">
                                            Product
                                        </th>
                                        <th className="border border-admin-border px-4 py-2 text-center">
                                            HSN
                                        </th>
                                        <th className="border border-admin-border px-4 py-2 text-center">
                                            Qty
                                        </th>
                                        <th className="border border-admin-border px-4 py-2 text-right">
                                            Unit Price
                                        </th>
                                        <th className="border border-admin-border px-4 py-2 text-right">
                                            Total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {invoiceData.items?.map((item, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-admin-bg"
                                        >
                                            <td className="border border-admin-border px-4 py-2">
                                                {item.productName || "N/A"}
                                            </td>
                                            <td className="border border-admin-border px-4 py-2 text-center">
                                                {item.hsnCode || "N/A"}
                                            </td>
                                            <td className="border border-admin-border px-4 py-2 text-center">
                                                {item.quantity || 0}
                                            </td>
                                            <td className="border border-admin-border px-4 py-2 text-right">
                                                {formatCurrency(item.price)}
                                            </td>
                                            <td className="border border-admin-border px-4 py-2 text-right">
                                                {formatCurrency(
                                                    item.price * item.quantity
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-admin-bg rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaDollarSign className="text-admin-primary w-4 h-4" />
                            Amount Summary
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-admin-text-secondary">
                                    Subtotal
                                </span>
                                <span className="text-admin-text">
                                    {formatCurrency(
                                        invoiceData.pricing.subtotal
                                    )}
                                </span>
                            </div>
                            {invoiceData.pricing.totalDiscount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        Discount
                                    </span>
                                    <span className="text-admin-success">
                                        -
                                        {formatCurrency(
                                            invoiceData.pricing.totalDiscount
                                        )}
                                    </span>
                                </div>
                            )}
                            {invoiceData.pricing.shippingFee > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        Shipping
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(
                                            invoiceData.pricing.shippingFee
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-admin-text-secondary">
                                    Taxable Amount
                                </span>
                                <span className="text-admin-text">
                                    {formatCurrency(
                                        invoiceData.pricing.taxableAmount
                                    )}
                                </span>
                            </div>
                            {invoiceData.pricing.cgst.amount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        CGST ({invoiceData.pricing.cgst.rate}%)
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(
                                            invoiceData.pricing.cgst.amount
                                        )}
                                    </span>
                                </div>
                            )}
                            {invoiceData.pricing.sgst.amount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        SGST ({invoiceData.pricing.sgst.rate}%)
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(
                                            invoiceData.pricing.sgst.amount
                                        )}
                                    </span>
                                </div>
                            )}
                            {invoiceData.pricing.igst.amount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        IGST ({invoiceData.pricing.igst.rate}%)
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(
                                            invoiceData.pricing.igst.amount
                                        )}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-admin-text-secondary">
                                    Total Tax
                                </span>
                                <span className="text-admin-text">
                                    {formatCurrency(
                                        invoiceData.pricing.totalTax
                                    )}
                                </span>
                            </div>
                            <div className="border-t border-admin-border pt-2">
                                <div className="flex justify-between font-bold text-lg">
                                    <span className="text-admin-text">
                                        Grand Total
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(
                                            invoiceData.pricing.finalAmount
                                        )}
                                    </span>
                                </div>
                            </div>
                            {invoiceData.pricing.totalInWords && (
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <p className="text-sm text-admin-text-secondary mb-1">
                                        Amount in Words:
                                    </p>
                                    <p className="font-medium text-admin-text">
                                        {invoiceData.pricing.totalInWords}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceModal;
