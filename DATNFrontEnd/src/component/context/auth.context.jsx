import { createContext, useState } from 'react';

export const AuthContext = createContext({
    username: "",
    password: "",
    confirm_password: "",
    email: "",
    role: "",
    id: "",
    phone: ""
});

export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
        id: "",
    })

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}
