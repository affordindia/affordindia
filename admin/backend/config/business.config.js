const businessConfig = {
    // Company Information
    name: "AffordIndia",
    address: "123, Business Street, Commercial Complex",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    country: "India",

    // GST and Tax Information
    gstin: "27ABCDE1234F1Z5", // Replace with actual GSTIN
    pan: "ABCDE1234F", // Replace with actual PAN

    // Contact Information
    phone: "+91-9876543210",
    email: "contact@affordindia.com",
    website: "www.affordindia.com",

    // Bank Details for Payments
    bankDetails: {
        accountName: "AffordIndia Private Limited",
        accountNumber: "123456789012",
        ifsc: "ICIC0001234",
        bankName: "ICICI Bank",
        branch: "Andheri West Branch",
    },

    // Default GST Configuration
    defaultGSTRate: 18, // 18% default GST rate

    // Invoice Configuration
    invoicePrefix: "INV",

    // Terms and Conditions
    terms: [
        "Payment is due within 30 days of invoice date",
        "Late payments may incur additional charges",
        "All disputes must be resolved within 7 days",
        "Goods once sold cannot be returned without prior approval",
    ],
};

export default businessConfig;
