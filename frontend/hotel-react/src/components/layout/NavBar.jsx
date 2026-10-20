import React, { useContext, useState } from 'react'
import {Link,NavLink,useNavigate} from 'react-router-dom'
import Logout from '../auth/Logout'
import { AuthContext } from '../auth/AuthProvider'

const NavBar = () => {
    const [showAccount,setShowAccount] = useState(false)
    const {user,handleLogout} = useContext(AuthContext)
    const navigate = useNavigate()
    const handleAccountClick = () => {
        setShowAccount(!showAccount)
    }
    const isLoggedIn = user !== null
    const userRole = user?.roles?.[0] || null
  return (
    <nav className='navbar navbar-expand-lg bg-body-tertiary px-5 shadow mt-5 sticky-top'>
      <div className='container-fluid'>
        <Link to={"/"}>
            <span className='hotel-color'>Ikram's Hotel</span>
        </Link>
        <button className='navbar-toggler'
        type='button'
        data-bs-toggle="collapse"
        data-bs-target="#navbarScroll"
        aria-controls='navbarScroll'
        aria-expanded="false"
        aria-label='Toggle navigation'>
         <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarScroll'>
            <ul className='navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll'>
                <li className='nav-item'>
                    <NavLink className='nav-link' aria-current="page" to={"/browse-all-rooms"}>
                       Browse all rooms 
                    </NavLink>
                </li>
                {isLoggedIn && userRole == 'ROLE_ADMIN' && (
                    <li className='nav-item'>
                        <NavLink className='nav-link' aria-current="page" to={"/admin"}>
                            Admin 
                        </NavLink>
                    </li>
                )}
            </ul>

            <ul className='d-flex navbar-nav'>
                <li className='nav-item'>
                    <NavLink className='nav-link' to={"/find-booking"}>
                        Find My Booking
                    </NavLink>
                </li>

                <li className='nav-item dropdown'>
                <a href="#"
                className={`nav-link dropdown-toggle ${showAccount ? "show" : ""}`}
                role='button'
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={handleAccountClick}
                >
                    Account
                </a>
                <ul
                className={`dropdown-menu ${showAccount ? "show" : ""}`}
                aria-labelledby= "navbarDropdown">

                    {isLoggedIn ? (
  <>
    <li>
      <Link to="/profile" className="dropdown-item">Profile</Link>
    </li>
    <li><hr className="dropdown-divider" /></li>
    <li>
      <button className="dropdown-item" onClick={() => {
        handleLogout()
        navigate("/", { state: { message: "You have been logged out." } })
      }}>
        Logout
      </button>
    </li>
  </>
) : (
  <li>
    <Link to="/login" className="dropdown-item">Login</Link>
  </li>
)}

                </ul>
                </li>
            </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
