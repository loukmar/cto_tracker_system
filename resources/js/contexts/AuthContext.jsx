import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get("/api/auth/me");
            console.log("Fetched user:", response.data);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        const response = await axios.post("/api/auth/login", credentials);
        const { user, token } = response.data;

        console.log("Login response:", response.data);

        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        return user;
    };

    const register = async (data) => {
        const response = await axios.post("/api/auth/register", data);
        const { user, token } = response.data;

        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setUser(user);

        return user;
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
        }
    };

    // Helper function to check if user is admin
    const isAdmin = user?.role === "admin";
    const isCTO = user?.role === "cto";
    const isDepartmentOwner = user?.role === "department_owner";
    const canViewAllDepartments =
        user?.role === "admin" || user?.role === "cto";

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user,
        isAdmin, // This is what was missing
        isCTO,
        isDepartmentOwner,
        canViewAllDepartments,
        setUser, // Add this so profile updates can update the user
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
