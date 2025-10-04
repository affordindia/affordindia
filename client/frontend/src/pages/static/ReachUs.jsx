import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { HiExternalLink } from "react-icons/hi";
import NavLogo from "../../assets/NavLogo.png";

const ReachUs = () => {
    const socialLinks = [
        {
            name: "Visit our Website",
            url: "https://affordindia.com",
            icon: (
                <img
                    src="/favicon.png"
                    alt="Website"
                    className="w-6 h-6 object-contain"
                />
            ),
            bgColor: "bg-rose-50 hover:bg-rose-100",
            textColor: "text-gray-700",
            borderColor: "border-[#b76e79]",
        },
        {
            name: "Facebook",
            url: "https://facebook.com/affordindia",
            icon: <FaFacebook className="w-6 h-6" />,
            bgColor: "bg-white hover:bg-gray-50",
            textColor: "text-gray-700",
            borderColor: "border-[#b76e79]",
        },
        {
            name: "Instagram",
            url: "https://www.instagram.com/teamaffordindia/",
            icon: <FaInstagram className="w-6 h-6" />,
            bgColor: "bg-white hover:bg-gray-50",
            textColor: "text-gray-700",
            borderColor: "border-[#b76e79]",
        },
        {
            name: "X",
            url: "https://x.com/teamAffordIndia",
            icon: <FaXTwitter className="w-6 h-6" />,
            bgColor: "bg-white hover:bg-gray-50",
            textColor: "text-gray-700",
            borderColor: "border-[#b76e79]",
        },
        {
            name: "LinkedIn",
            url: "https://www.linkedin.com/in/teamaffordindia-969a23386/",
            icon: <FaLinkedin className="w-6 h-6" />,
            bgColor: "bg-white hover:bg-gray-50",
            textColor: "text-gray-700",
            borderColor: "border-[#b76e79]",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 sm:p-12">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <img
                                src={NavLogo}
                                alt="Afford India"
                                className="h-16 sm:h-20 w-auto"
                            />
                        </div>
                        <p className="text-gray-500 text-lg">
                            Connect with us on our digital platforms
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4 mb-8">
                        {socialLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    flex items-center justify-between w-full p-4 rounded-lg border
                                    ${link.bgColor} ${link.textColor} ${link.borderColor}
                                    transition-all duration-200 hover:shadow-md group
                                `}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {link.icon}
                                    </div>
                                    <span className="text-lg font-medium">
                                        {link.name}
                                    </span>
                                </div>
                                <HiExternalLink className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
                            </a>
                        ))}
                    </div>

                    {/* Footer Message */}
                    <div className="text-center pt-6 border-t border-gray-100">
                        <p className="text-gray-400 text-lg">
                            Thank You for connecting with us!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReachUs;
