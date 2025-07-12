import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    // Placeholder: just a fake user toggle
    const [user, setUser] = useState(null);
    const login = () => setUser({ _id: "demo", name: "Demo User" });
    const logout = () => setUser(null);
    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
