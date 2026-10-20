import React, { useContext } from 'react'
import { AuthContext } from './AuthProvider'
import { useNavigate, Link } from 'react-router-dom'

const Logout = () => {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.handleLogout()
    navigate("/", { state: { message: "You have been logged out." } })
  }

  const isLoggedIn = auth.user !== null

  if (!isLoggedIn) return null

  return (
    <>
      <Link className="dropdown-item" to="/profile">Profile</Link>
      <hr className="dropdown-divider" />
      <button className="dropdown-item" onClick={handleLogout}>Logout</button>
    </>
  )
}

export default Logout
