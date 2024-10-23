import { createContext, useState } from 'react';

export const AuthContext = createContext({
    username: "",
    password: "",
});

export const AuthWrapper = (props) => {
    const [user, setUser] = useState({
        username: "",
        password: "",
    })

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {props.children}
        </AuthContext.Provider>
    )
}
