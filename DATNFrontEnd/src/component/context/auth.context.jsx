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

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            console.log("User saved to localStorage:", user);
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (loginStatus) {
            localStorage.setItem("loginStatus", loginStatus);
            console.log("Login status saved to localStorage:", loginStatus);
        } else {
            localStorage.removeItem("loginStatus");
        }
    }, [loginStatus]);

    console.log("Current user:", user);
    console.log("Current loginStatus:", loginStatus);

    return (
        <AuthContext.Provider value={{ user, setUser, loginStatus, setLoginStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

