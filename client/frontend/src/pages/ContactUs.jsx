import React, { useState } from "react";
import {
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSpinner,
} from "react-icons/fa";
import { submitContactForm } from "../api/email.js";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const [formState, setFormState] = useState({
        isSubmitting: false,
        isSubmitted: false,
        error: null,
        errors: {},
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear field-specific error when user starts typing
        if (formState.errors[name]) {
            setFormState((prev) => ({
                ...prev,
                errors: { ...prev.errors, [name]: null },
            }));
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim() || formData.name.trim().length < 2) {
            errors.name = "Name must be at least 2 characters long";
        }

        if (
            !formData.email.trim() ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            errors.email = "Please provide a valid email address";
        }

        if (!formData.message.trim() || formData.message.trim().length < 10) {
            errors.message = "Message must be at least 10 characters long";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormState((prev) => ({ ...prev, errors }));
            return;
        }

        setFormState((prev) => ({
            ...prev,
            isSubmitting: true,
            error: null,
            errors: {},
        }));

        try {
            const response = await submitContactForm(formData);

            if (response.success) {
                setFormState((prev) => ({
                    ...prev,
                    isSubmitting: false,
                    isSubmitted: true,
                }));

                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    message: "",
                });
            } else {
                throw new Error(response.message || "Failed to send message");
            }
        } catch (error) {
            console.error("Contact form error:", error);

            let errorMessage = "Failed to send your message. Please try again.";
            let fieldErrors = {};

            if (error.response?.data) {
                const data = error.response.data;
                errorMessage = data.message || errorMessage;

                // Handle validation errors from backend
                if (data.errors && Array.isArray(data.errors)) {
                    fieldErrors = data.errors.reduce((acc, err) => {
                        if (err.includes("Name")) acc.name = err;
                        if (err.includes("Email") || err.includes("email"))
                            acc.email = err;
                        if (err.includes("Message")) acc.message = err;
                        return acc;
                    }, {});
                }
            }

            setFormState((prev) => ({
                ...prev,
                isSubmitting: false,
                error: errorMessage,
                errors: fieldErrors,
            }));
        }
    };

    // Success message component
    if (formState.isSubmitted) {
        return (
            <div className="bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
                <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl overflow-hidden p-8 text-center">
                    <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Message Sent Successfully!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Thank you for contacting us! We've received your message
                        and our team will get back to you within 24-48 hours.
                    </p>
                    <button
                        onClick={() =>
                            setFormState((prev) => ({
                                ...prev,
                                isSubmitted: false,
                            }))
                        }
                        className="bg-[#B76E79] text-white px-6 py-2 rounded-md hover:bg-[#333] transition"
                    >
                        Send Another Message
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
            {/* Main Heading */}
            <h1 className="text-xl md:text-2xl font-bold text-center text-[#4b4a3f] mb-10">
                Welcome to afford INDIA, Where Arts Comes Alive
            </h1>

            <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left Section - Contact Info */}
                <div className="bg-[#B76E79] text-white p-8 flex flex-col justify-center space-y-6">
                    <h2 className="text-2xl font-bold">Get in Touch</h2>
                    <p className="text-gray-200 text-sm">
                        Have questions or need support? We’re here to help you
                        anytime.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <FaPhoneAlt className="text-lg" />
                            <span>+91 92115 01006</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-lg" />
                            <span>contact@affordindia.com</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaClock className="text-lg" />
                            <span>Mon-Sat: 10:00 AM - 05:00 PM</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="p-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Send Us a Message
                    </h3>

                    {/* Error message */}
                    {formState.error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                            <FaExclamationTriangle className="text-red-500" />
                            <span className="text-red-700 text-sm">
                                {formState.error}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Your Name"
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f] ${
                                    formState.errors.name
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                disabled={formState.isSubmitting}
                            />
                            {formState.errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Your Email"
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f] ${
                                    formState.errors.email
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                disabled={formState.isSubmitting}
                            />
                            {formState.errors.email && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Your Message"
                                rows="4"
                                className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f] ${
                                    formState.errors.message
                                        ? "border-red-500"
                                        : "border-gray-300"
                                }`}
                                disabled={formState.isSubmitting}
                            ></textarea>
                            {formState.errors.message && (
                                <p className="text-red-500 text-xs mt-1">
                                    {formState.errors.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={formState.isSubmitting}
                            className="bg-[#B76E79] text-white w-full py-2 text-sm font-medium rounded-md hover:bg-[#333] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {formState.isSubmitting ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Sentence */}
            <p className="text-center text-sm text-gray-600 mt-8">
                Thank you for reaching out to us — we’ll get back to you
                shortly.
            </p>
        </div>
    );
};

export default ContactUs;
