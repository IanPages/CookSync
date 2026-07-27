import React, { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../../types/user_service_types";
import type { AuthContextType } from "../../types/auth_context_type";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.created_at) {
                    // Ensure created_at is a string and normalize it for Date constructor
                    const normalizedDate = String(parsedUser.created_at).endsWith('Z')
                        ? parsedUser.created_at
                        : parsedUser.created_at.includes('T')
                            ? parsedUser.created_at + 'Z'
                            : parsedUser.created_at;
                    parsedUser.created_at = normalizedDate;
                }
                setUser(parsedUser);
                // Fetch fresh user data in background
                import("../../services/user_services").then(({ getUserProfile }) => {
                    getUserProfile(storedToken)
                        .then((freshUser) => {
                            setUser(freshUser);
                            localStorage.setItem("user", JSON.stringify(freshUser));
                        })
                        .catch((err) => console.error("Failed to fetch fresh user", err));
                });
            } catch (error) {
                console.error("Failed to parse stored user", error);
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
