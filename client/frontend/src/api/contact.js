import api from "./axios";

// Submit contact form
export const submitContactForm = async (contactData) => {
    // console.log("API CALL: submitContactForm", {
    //     name: contactData.name,
    //     email: contactData.email,
    //     messageLength: contactData.message?.length,
    // });

    const res = await api.post("/contact", contactData);
    return res.data;
};

// Check email service health (for admin use)
export const checkContactEmailHealth = async () => {
    // console.log("API CALL: checkContactEmailHealth");
    const res = await api.get("/contact/health");
    return res.data;
};
