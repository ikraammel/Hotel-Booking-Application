import React, { useContext, useState} from 'react'
import {Link, useNavigate,useLocation} from 'react-router-dom'
import {jwtDecode} from 'jwt-decode'
import {loginUser} from "../utils/ApiFunctions"
import { AuthContext } from './AuthProvider'

const Login = () => {
    const[errorMessage,setErrorMessage] = useState("")
    const[login,setLogin] = useState({
        email:"",
        password:""
    })

    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.path || "/"
    const { handleLogin } = useContext(AuthContext) 

    const handleInputChange = (e) => {
        setLogin({...login,[e.target.name] : e.target.value})
    }

    const handleSubmit = async(e) =>{
        e.preventDefault()
        const success = await loginUser(login)
        if(success && success.token){
            // Stocker token et userId/email dans localStorage
            localStorage.setItem("token", success.token);
            localStorage.setItem("userId", success.userId);
            localStorage.setItem("email", login.email);

            // Appeler la fonction du contexte pour gérer l’état d’authentification
            handleLogin(success.token);
            // Naviguer vers la page d’accueil ou profil
            navigate(from);
        }else{
            setErrorMessage("Invalid username/password. Please try again.")
        }
        setTimeout(() => {
            setErrorMessage("")
        },4000)
    }
  return (
    <section className='container col-6 mt-5 mb-5'>
      {errorMessage && <p className='alert alert-danger'>{errorMessage}</p>}
      {location.state?.path && (
        <p className="alert alert-info">
            Please log in to continue your booking.
        </p>
        )}

      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className='row mb-3'>
            <label htmlFor='email' className='col-sm-2 col-form-label'>Email</label>
            <div>
                <input type="email" id='email' name='email' className='form-control' value={login.email} 
                onChange={handleInputChange}/>
            </div>
        </div>

        <div className='row mb-3'>
            <label htmlFor='password' className='col-sm-2 col-form-label'>Password</label>
            <div>
                <input type="password" id='password' name='password' className='form-control' value={login.password} 
                onChange={handleInputChange}/>
            </div>
        </div>

        <div className='mb-3'>
            <button type='submit' className='btn btn-hotel' style={{marginRight : "10px"}}>Login</button>
            <span style={{marginLeft: "10px"}}>Don't have an account yet? <Link to={"/register"}>Register</Link></span>
        </div>
      </form>
    </section>
  )
}

export default Login
