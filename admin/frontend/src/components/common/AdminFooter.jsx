import React from "react";

const AdminFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 py-4 px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="text-sm text-gray-600">
                    © {currentYear} AffordIndia Admin Panel. All rights
                    reserved.
                </div>
                <div className="flex items-center space-x-6 mt-2 sm:mt-0">
                    <a
                        href="/privacy"
                        className="text-sm text-gray-600 hover:text-[#B76E79] transition-colors duration-200"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/terms"
                        className="text-sm text-gray-600 hover:text-[#B76E79] transition-colors duration-200"
                    >
                        Terms of Service
                    </a>
                    <span className="text-sm text-gray-400">Version 1.0.0</span>
                </div>
            </div>
        </footer>
    );
};

export default AdminFooter;
