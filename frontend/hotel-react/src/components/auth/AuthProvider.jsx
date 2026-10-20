import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const AuthContext = createContext({
  user: null,
  handleLogin: (token) => {},
  handleLogout: () => {}
})

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (error) {
        console.error("Token invalide ou expiré")
        localStorage.clear()
        setUser(null)
      }
    }
  }, [])

  const handleLogin = (token) => {
    try {
      const decodedToken = jwtDecode(token)
      localStorage.setItem("token", token)
      localStorage.setItem("userId", decodedToken.sub)
      localStorage.setItem("userRole", decodedToken.roles?.[0])
      setUser(decodedToken)
    } catch (error) {
      console.error("Erreur de décodage du token:", error)
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
