import puppeteer from "puppeteer";

/**
 * Generate PDF from invoice data
 * @param {Object} invoiceData - Invoice data from database
 * @returns {Buffer} PDF buffer
 */
export const generateInvoicePDF = async (invoiceData) => {
    let browser = null;
    let page = null;

    try {
        // Launch browser
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        });

        page = await browser.newPage();

        // Create HTML content
        const htmlContent = createInvoiceHTML(invoiceData);

        // Set content and generate PDF
        await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.5in",
                right: "0.5in",
                bottom: "0.5in",
                left: "0.5in",
            },
        });

        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw new Error(`PDF generation failed: ${error.message}`);
    } finally {
        if (page) await page.close();
        if (browser) await browser.close();
    }
};

/**
 * Create HTML content for invoice
 * @param {Object} data - Invoice data
 * @returns {string} HTML content
 */
const createInvoiceHTML = (data) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice ${data.invoiceNumber}</title>
    <style>
        * {
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 15px;
            color: #1f2937;
            background: #ffffff;
            font-size: 13px;
            line-height: 1.4;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            background: white;
        }
        
        /* Header Section */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 3px solid #b76e79;
        }
        
        .company-info h1 {
            color: #b76e79;
            margin: 0 0 8px 0;
            font-size: 28px;
            font-weight: 700;
        }
        
        .company-info p {
            margin: 3px 0;
            color: #718096;
            font-size: 12px;
        }
        
        .invoice-details {
            text-align: right;
        }
        
        .invoice-details h2 {
            color: #b76e79;
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: 600;
        }
        
        .invoice-meta {
            background: #fbf7f8;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #b76e79;
        }
        
        .invoice-meta p {
            margin: 3px 0;
            font-size: 12px;
        }
        
        /* Info Cards Section */
        .info-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 25px;
        }
        
        .info-card {
            background: #fbf7f8;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #e2e8f0;
        }
        
        .info-card h3 {
            color: #b76e79;
            margin: 0 0 12px 0;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .info-card .icon {
            width: 16px;
            height: 16px;
            background: #b76e79;
            border-radius: 50%;
            display: inline-block;
        }
        
        .info-card p {
            margin: 3px 0;
            font-size: 12px;
        }
        
        .info-card .name {
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 6px;
        }
        
        /* Items Table */
        .items-section {
            margin-bottom: 25px;
        }
        
        .section-title {
            color: #b76e79;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-title .icon {
            width: 18px;
            height: 18px;
            background: #b76e79;
            border-radius: 4px;
            display: inline-block;
        }
        
        .items-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .items-table thead {
            background: #b76e79;
            color: white;
        }
        
        .items-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 12px;
        }
        
        .items-table th.text-center {
            text-align: center;
        }
        
        .items-table th.text-right {
            text-align: right;
        }
        
        .items-table tbody tr {
            border-bottom: 1px solid #e2e8f0;
        }
        
        .items-table tbody tr:nth-child(even) {
            background: #fbf7f8;
        }
        
        .items-table td {
            padding: 10px 8px;
            font-size: 12px;
            vertical-align: top;
        }
        
        .items-table .text-center {
            text-align: center;
        }
        
        .items-table .text-right {
            text-align: right;
        }
        
        /* Summary Section */
        .summary-section {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 25px;
            margin-bottom: 20px;
        }
        
        .amount-summary {
            background: #fbf7f8;
            border-radius: 8px;
            padding: 16px;
            border: 1px solid #e2e8f0;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
        }
        
        .summary-row.total {
            font-weight: 600;
            font-size: 14px;
            color: #2d3748;
            padding-top: 8px;
            border-top: 2px solid #b76e79;
            margin-top: 12px;
        }
        
        .summary-label {
            color: #718096;
        }
        
        .summary-value {
            color: #2d3748;
            font-weight: 500;
        }
        
        .discount {
            color: #48bb78 !important;
        }
        
        /* Amount in Words */
        .words-section {
            background: #fbf7f8;
            border: 1px solid #c68f98;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
        }
        
        .words-section h3 {
            color: #b76e79;
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
        }
        
        .words-section p {
            margin: 0;
            font-weight: 600;
            color: #2d3748;
            font-size: 13px;
        }
        
        /* Footer */
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 11px;
        }
        
        .footer p {
            margin: 3px 0;
        }
        
        /* Print optimizations */
        @media print {
            body {
                padding: 0;
            }
            .container {
                margin: 0;
                box-shadow: none;
            }
        }
        
        /* Utility classes */
        .text-bold {
            font-weight: 600;
        }
        
        .text-primary {
            color: #b76e79;
        }
        
        .text-success {
            color: #48bb78;
        }
        
        .text-secondary {
            color: #718096;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="invoice-header">
            <div class="company-info">
                <h1>${data.business.name}</h1>
                <p><strong>Address:</strong> ${data.business.address}</p>
                <p><strong>City:</strong> ${data.business.city}, ${
        data.business.state
    } ${data.business.pincode}</p>
                <p><strong>GSTIN:</strong> ${data.business.gstin}</p>
                <p><strong>Phone:</strong> ${data.business.phone}</p>
                <p><strong>Email:</strong> ${data.business.email}</p>
            </div>
            <div class="invoice-details">
                <h2>INVOICE</h2>
                <div class="invoice-meta">
                    <p><strong>Invoice No:</strong> ${data.invoiceNumber}</p>
                    <p><strong>Date:</strong> ${data.invoiceDate}</p>
                    <p><strong>Order ID:</strong> ${
                        data.order?.orderId || "N/A"
                    }</p>
                </div>
            </div>
        </div>

        <!-- Customer & Business Info Cards -->
        <div class="info-section">
            <div class="info-card">
                <h3><span class="icon"></span>Bill To</h3>
                <p class="name">${data.customer.name}</p>
                <p>${data.addresses.billing.houseNumber}</p>
                <p>${data.addresses.billing.street}</p>
                ${
                    data.addresses.billing.landmark
                        ? `<p>${data.addresses.billing.landmark}</p>`
                        : ""
                }
                ${
                    data.addresses.billing.area
                        ? `<p>${data.addresses.billing.area}</p>`
                        : ""
                }
                <p>${data.addresses.billing.city}, ${
        data.addresses.billing.state
    }, ${data.addresses.billing.pincode}</p>
                <p><strong>Phone:</strong> ${data.customer.phone}</p>
                <p><strong>Email:</strong> ${data.customer.email}</p>
            </div>
            <div class="info-card">
                <h3><span class="icon"></span>Ship To</h3>
                ${
                    data.addresses.isDifferentReceiver &&
                    (data.receiverInfo?.name || data.receiverInfo?.phone)
                        ? `
                    <p class="name">${
                        data.receiverInfo.name || data.customer.name
                    }</p>
                    <p>${data.addresses.shipping.houseNumber}</p>
                    <p>${data.addresses.shipping.street}</p>
                    ${
                        data.addresses.shipping.landmark
                            ? `<p>${data.addresses.shipping.landmark}</p>`
                            : ""
                    }
                    ${
                        data.addresses.shipping.area
                            ? `<p>${data.addresses.shipping.area}</p>`
                            : ""
                    }
                    <p>${data.addresses.shipping.city}, ${
                              data.addresses.shipping.state
                          }, ${data.addresses.shipping.pincode}</p>
                    <p><strong>Phone:</strong> ${
                        data.receiverInfo.phone || data.customer.phone
                    }</p>
                `
                        : `
                    <p class="name">${data.customer.name}</p>
                    <p>${data.addresses.shipping.houseNumber}</p>
                    <p>${data.addresses.shipping.street}</p>
                    ${
                        data.addresses.shipping.landmark
                            ? `<p>${data.addresses.shipping.landmark}</p>`
                            : ""
                    }
                    ${
                        data.addresses.shipping.area
                            ? `<p>${data.addresses.shipping.area}</p>`
                            : ""
                    }
                    <p>${data.addresses.shipping.city}, ${
                              data.addresses.shipping.state
                          }, ${data.addresses.shipping.pincode}</p>
                    <p><strong>Phone:</strong> ${data.customer.phone}</p>
                `
                }
            </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
            <h3 class="section-title">
                <span class="icon"></span>
                Invoice Items (${data.items.length})
            </h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th class="text-center">HSN Code</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Unit Price</th>
                        <th class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.items
                        .map(
                            (item) => `
                    <tr>
                        <td><strong>${item.productName}</strong></td>
                        <td class="text-center">${item.hsnCode}</td>
                        <td class="text-center">${item.quantity}</td>
                        <td class="text-right">₹${Number(
                            item.unitPrice || 0
                        ).toLocaleString("en-IN")}</td>
                        <td class="text-right">₹${Number(
                            item.totalPrice || 0
                        ).toLocaleString("en-IN")}</td>
                    </tr>
                    `
                        )
                        .join("")}
                </tbody>
            </table>
        </div>

        <!-- Summary Section -->
        <div class="summary-section">
            <div></div>
            <div class="amount-summary">
                <h3 class="section-title">
                    <span class="icon"></span>
                    Amount Summary
                </h3>
                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">₹${Number(
                        data.subtotal || 0
                    ).toLocaleString("en-IN")}</span>
                </div>
                ${
                    data.discount > 0
                        ? `
                <div class="summary-row">
                    <span class="summary-label">Discount</span>
                    <span class="summary-value discount">-₹${Number(
                        data.discount
                    ).toLocaleString("en-IN")}</span>
                </div>
                `
                        : ""
                }
                ${
                    data.shippingCharges > 0
                        ? `
                <div class="summary-row">
                    <span class="summary-label">Shipping</span>
                    <span class="summary-value">₹${Number(
                        data.shippingCharges
                    ).toLocaleString("en-IN")}</span>
                </div>
                `
                        : ""
                }
                <div class="summary-row">
                    <span class="summary-label">Taxable Amount</span>
                    <span class="summary-value">₹${Number(
                        data.taxableAmount || 0
                    ).toLocaleString("en-IN")}</span>
                </div>
                ${
                    data.cgst > 0
                        ? `
                <div class="summary-row">
                    <span class="summary-label">CGST (${data.cgstRate}%)</span>
                    <span class="summary-value">₹${Number(
                        data.cgst
                    ).toLocaleString("en-IN")}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">SGST (${data.sgstRate}%)</span>
                    <span class="summary-value">₹${Number(
                        data.sgst
                    ).toLocaleString("en-IN")}</span>
                </div>
                `
                        : ""
                }
                ${
                    data.igst > 0
                        ? `
                <div class="summary-row">
                    <span class="summary-label">IGST (${data.igstRate}%)</span>
                    <span class="summary-value">₹${Number(
                        data.igst
                    ).toLocaleString("en-IN")}</span>
                </div>
                `
                        : ""
                }
                <div class="summary-row">
                    <span class="summary-label">Total Tax</span>
                    <span class="summary-value">₹${Number(
                        data.totalTax || 0
                    ).toLocaleString("en-IN")}</span>
                </div>
                <div class="summary-row total">
                    <span class="summary-label">Grand Total</span>
                    <span class="summary-value">₹${Number(
                        data.finalAmount || 0
                    ).toLocaleString("en-IN")}</span>
                </div>
            </div>
        </div>

        <!-- Amount in Words -->
        ${
            data.totalInWords
                ? `
        <div class="words-section">
            <h3>Amount in Words</h3>
            <p>${data.totalInWords}</p>
        </div>
        `
                : ""
        }

        <!-- Footer -->
        <div class="footer">
            <p><strong>We declare this invoice shows the actual price of the goods described and that all particulars are true and correct.</strong></p>
            
        </div>
    </div>
</body>
</html>
    `;
};

export default { generateInvoicePDF };
