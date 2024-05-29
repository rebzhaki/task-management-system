import { createContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken")
        if (token) {
            setAuth(true)
        }
        setLoading(false)
    }, [])
    return (
        <AuthContext.Provider value={{ auth, setAuth, loading }} >
            {children}
        </AuthContext.Provider>

    )
}

export default AuthContext