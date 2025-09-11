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
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
        }
        .company-info h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
        }
        .invoice-details {
            text-align: right;
        }
        .invoice-details h2 {
            color: #007bff;
            margin: 0;
            font-size: 24px;
        }
        .section {
            margin-bottom: 25px;
        }
        .section-title {
            background-color: #f8f9fa;
            padding: 10px;
            border-left: 4px solid #007bff;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .address-row {
            display: flex;
            justify-content: space-between;
            gap: 30px;
        }
        .address-box {
            flex: 1;
            border: 1px solid #ddd;
            padding: 15px;
            background-color: #f9f9f9;
        }
        .address-box h4 {
            margin-top: 0;
            color: #007bff;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #007bff;
            color: white;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .totals-section {
            margin-top: 30px;
            display: flex;
            justify-content: flex-end;
        }
        .totals-table {
            width: 400px;
        }
        .totals-table th {
            background-color: #6c757d;
        }
        .grand-total {
            background-color: #28a745 !important;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="invoice-header">
        <div class="company-info">
            <h1>${data.business.name}</h1>
            <p>
                ${data.business.address}<br>
                ${data.business.city}, ${data.business.state} ${
        data.business.pincode
    }<br>
                GSTIN: ${data.business.gstin}<br>
                Phone: ${data.business.phone}<br>
                Email: ${data.business.email}
            </p>
        </div>
        <div class="invoice-details">
            <h2>INVOICE</h2>
            <p>
                <strong>Invoice No:</strong> ${data.invoiceNumber}<br>
                <strong>Date:</strong> ${data.invoiceDate}
            </p>
        </div>
    </div>

    <!-- Billing & Shipping Address -->
    <div class="section">
        <div class="section-title">BILLING & SHIPPING DETAILS</div>
        <div class="address-row">
            <div class="address-box">
                <h4>Bill To:</h4>
                <p>
                    <strong>${data.customer.name}</strong><br>
                    ${data.billingAddress.houseNumber}
                    <br> 
                    ${data.billingAddress.street}
                    <br>
                    ${
                        data.billingAddress.landmark
                            ? data.billingAddress.landmark + "<br>"
                            : ""
                    } 
                    ${
                        data.billingAddress.area
                            ? data.billingAddress.area + "<br>"
                            : ""
                    }
                    ${data.billingAddress.city}, 
                    ${data.billingAddress.state}, 
                    ${data.billingAddress.pincode}
                    <br>
                    Phone: ${data.customer.phone}<br>
                    Email: ${data.customer.email}
                </p>
            </div>
            <div class="address-box">
                <h4>Ship To:</h4>
                <p>
                    <strong>${data.customer.name}</strong><br>
                    ${data.shippingAddress.houseNumber}
                    <br> 
                    ${data.shippingAddress.street}
                    <br>
                    ${
                        data.shippingAddress.landmark
                            ? data.shippingAddress.landmark + "<br>"
                            : ""
                    } 
                    ${
                        data.shippingAddress.area
                            ? data.shippingAddress.area + "<br>"
                            : ""
                    }
                    ${data.shippingAddress.city}, 
                    ${data.shippingAddress.state}, 
                    ${data.shippingAddress.pincode}
                    <br>
                    Phone: ${data.customer.phone}<br>
                </p>
            </div>
        </div>
    </div>

    <!-- Items Table -->
    <div class="section">
        <div class="section-title">ITEMS</div>
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>HSN Code</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${data.items
                    .map(
                        (item) => `
                <tr>
                    <td>${item.productName}</td>
                    <td>${item.hsnCode}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.unitPrice}</td>
                    <td>₹${item.totalPrice}</td>
                </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    </div>

    <!-- Totals -->
    <div class="totals-section">
        <table class="totals-table">
            <tr>
                <th>Subtotal</th>
                <td class="text-right">₹${data.subtotal}</td>
            </tr>
            ${
                data.discount
                    ? `
            <tr>
                <th>Discount</th>
                <td class="text-right">-₹${data.discount}</td>
            </tr>
            `
                    : ""
            }
            ${
                data.shippingCharges
                    ? `
            <tr>
                <th>Shipping</th>
                <td class="text-right">₹${data.shippingCharges}</td>
            </tr>
            `
                    : ""
            }
            <tr>
                <th>Taxable Amount</th>
                <td class="text-right">₹${data.taxableAmount}</td>
            </tr>
            ${
                data.cgst
                    ? `
            <tr>
                <th>CGST (${data.cgstRate}%)</th>
                <td class="text-right">₹${data.cgst}</td>
            </tr>
            <tr>
                <th>SGST (${data.sgstRate}%)</th>
                <td class="text-right">₹${data.sgst}</td>
            </tr>
            `
                    : ""
            }
            ${
                data.igst
                    ? `
            <tr>
                <th>IGST (${data.igstRate}%)</th>
                <td class="text-right">₹${data.igst}</td>
            </tr>
            `
                    : ""
            }
            <tr>
                <th>Total Tax</th>
                <td class="text-right">₹${data.totalTax}</td>
            </tr>
            <tr class="grand-total">
                <th>Grand Total</th>
                <td class="text-right">₹${data.finalAmount}</td>
            </tr>
        </table>
    </div>

    <!-- Amount in Words -->
    <div class="section">
        <div class="section-title">AMOUNT IN WORDS</div>
        <div style="padding: 15px; background-color: #f9f9f9; border: 1px solid #ddd; font-weight: bold; font-size: 14px;">
            ${data.totalInWords}
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Thank you for your business!</p>
        <p>This is a computer generated invoice.</p>
    </div>
</body>
</html>
    `;
};

export default { generateInvoicePDF };
