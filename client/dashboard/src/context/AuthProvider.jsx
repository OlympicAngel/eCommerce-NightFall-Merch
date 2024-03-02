import { createContext, useState } from 'react';

export const AuthContext = createContext();

function AuthProvider({ children }) {

    const [isAuth, setIsAuth] = useState(false)
    const [manager, setManager] = useState(false)
    const SERVER = "http://localhost:4000/"
    const data = {
        isAuth, setIsAuth,
        manager, setManager,
        SERVER
    };

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider