import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { RBACProvider } from "./context/RBACContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <BrowserRouter>
        <AuthProvider>
            <RBACProvider>
                <App />
            </RBACProvider>
        </AuthProvider>
    </BrowserRouter>
);
