import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext({
    user: null,
    setUser: () => { },
    loginStatus: null,
    setLoginStatus: () => { },
});

export const AuthWrapper = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
    const [loginStatus, setLoginStatus] = useState(localStorage.getItem("loginStatus") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (loginStatus) {
            localStorage.setItem("loginStatus", loginStatus);
        } else {
            localStorage.removeItem("loginStatus");
        }
    }, [loginStatus]);

    useEffect(() => {
        if (role) {
            localStorage.setItem("role", role);
        } else {
            localStorage.removeItem("role");
        }
    }, [role]);

    return (
        <AuthContext.Provider value={{ user, setUser, loginStatus, setLoginStatus, role, setRole }}>
            {children}
        </AuthContext.Provider>
    );
};

