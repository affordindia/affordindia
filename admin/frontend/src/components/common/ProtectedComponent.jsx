import React from "react";
import { FaLock } from "react-icons/fa";
import { useRBAC } from "../../context/RBACContext";

const ProtectedComponent = ({
    permission,
    children,
    fallback = null,
    view = false,
    ...props
}) => {
    const { hasPermission } = useRBAC();
    const allowed = hasPermission(permission);

    if (allowed) {
        if (React.isValidElement(children)) {
            return React.cloneElement(children, props);
        }
        return children;
    }

    if (fallback !== null) return fallback;

    if (!view) {
        return null;
    }

    if (React.isValidElement(children)) {
        return React.cloneElement(children, {
            disabled: true,
            title: "Access Denied",
            className: `${
                children.props.className || ""
            } opacity-60 cursor-not-allowed pointer-events-none`,
            children: (
                <>
                    {children.props.children}{" "}
                    <FaLock className="ml-2 w-4 h-4" />
                </>
            ),
        });
    }

    return (
        <span
            className="opacity-60 cursor-not-allowed pointer-events-none flex items-center"
            title="Access Denied"
        >
            {children} <FaLock className="ml-2 w-4 h-4" />
        </span>
    );
};

export default ProtectedComponent;
