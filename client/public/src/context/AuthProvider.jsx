import { createContext, useState } from 'react';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [isAuth, setIsAuth] = useState(false)
    const [user, setUser] = useState(false)
    const SERVER = import.meta.env.VITE_SERVER || "http://localhost:4000/"
    const data = {
        isAuth, setIsAuth,
        user, setUser,
        SERVER
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider
