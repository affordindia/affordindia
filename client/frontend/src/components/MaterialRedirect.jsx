import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppData } from "../context/AppDataContext.jsx";

const MaterialRedirect = () => {
    const { material } = useParams();
    const navigate = useNavigate();
    const { categories } = useAppData();

    useEffect(() => {
        if (material && material !== "all") {
            // Find the matching category
            const matchingCategory = categories.find(
                (cat) => cat.name.toLowerCase() === material.toLowerCase()
            );

            if (matchingCategory) {
                // Redirect to /products with category query parameter
                navigate(`/products?categories=${matchingCategory._id}`, {
                    replace: true,
                });
            } else {
                // If material not found, redirect to all products
                navigate("/products", { replace: true });
            }
        } else {
            // If no material or "all", redirect to all products
            navigate("/products", { replace: true });
        }
    }, [material, categories, navigate]);

    // Return null since this is just a redirect component
    return null;
};

export default MaterialRedirect;
