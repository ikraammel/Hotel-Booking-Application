import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteUser, getUser, getBookingsByEmail } from '../utils/ApiFunctions';
import moment from 'moment'

const Profile = () => {
const[user,setUser] = useState(null)
const [message,setMessage]= useState("")
const[errorMessage,setErrorMessage]= useState("")
const navigate = useNavigate()
const [bookings,setBookings] = useState([])

const userId = localStorage.getItem("userId")
const token = localStorage.getItem("token")

useEffect(() => {
  const fetchUserAndBookings = async () => {
    try {
      const userData = await getUser(userId, token);
      setUser(userData);

      // Charger les bookings à partir de l'email du user
      const userBookings = await getBookingsByEmail(userData.email, token);

      console.log("Bookings fetched:", userBookings); // <-- ici

      setBookings(userBookings);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load user or bookings.");
    }
  };

  fetchUserAndBookings();
}, [userId, token]);

    const handleDeleteAccount = async() => {
        const confirmed = window.confirm(
            "Are you sure you want to delete your account? This action cannot be undone. "
        )
        if(confirmed){
            await deleteUser(userId)
            .then((response) =>{
                setMessage(response.data)
                localStorage.removeItem("token")
                localStorage.removeItem("userId")
                localStorage.removeItem("userRole")
                navigate("/")
                window.location.reload()
            })
            .catch((error) => {
                setErrorMessage(error.data)
            })
        }
    }
  return (
    <div className='container'>
      {errorMessage && <p className='text-danger'>{errorMessage}</p>}
      {message && <p className='text-danger'>{message}</p>}
      {user ?(
        <div className='card p-5 mt-5' style={{backgroundColor: "whitesmoke"}}>
            <h4 className='card-title text-center'>User Information</h4>
            <div className='card-body'>
                    <div className='row'>
                        <div className='col-md-10 mx-auto'>
                            <div className='card mb-3 shadow'>
                                <div className='row g-0'>
                                    <div className='col-md-2'>
                                        <div className='d-flex justify-content-center align-items-center'>
                                    <img src="user.jpg" alt="Profile" className='rounded-circle' 
                                    style={{width:"150px",height:"150px",objectFit:"cover"}}/>
                                        </div>
                                    </div>

                            <div className='col-md-10'>
                              <div className='card-body'>

                                <div className='form-group-row'>
                                    <label className='col-md-2 col-form-label fw-bold'>Id:</label>
                                    <div className='col-md-10'>
                                        <p className='card-text'>{user.id}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className='form-group-row'>
                                    <label className='col-md-2 col-form-label fw-bold'>First Name:</label>
                                    <div className='col-md-10'>
                                        <p className='card-text'>{user.firstName}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className='form-group-row'>
                                    <label className='col-md-2 col-form-label fw-bold'>Last Name:</label>
                                    <div className='col-md-10'>
                                        <p className='card-text'>{user.lastName}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className='form-group-row'>
                                    <label className='col-md-2 col-form-label fw-bold'>Email:</label>
                                    <div className='col-md-10'>
                                        <p className='card-text'>{user.email}</p>
                                    </div>
                                </div>
                                <hr />

                                <div className='form-group-row'>
                                    <label className='col-md-2 col-form-label fw-bold'>Role:</label>
                                    <div className='col-md-10'>
                                        <p className='card-text'>{user.roles && user.roles.length > 0 ? user.roles[0].name : "No role"}</p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            </div>
        </div>
      ):(
        <p>Loading...</p>
      )}
            <h4 className='card-title text-center'>Booking History</h4>

            {bookings.length > 0 ? (
                <table className='table table-bordered table-hover shadow'>
                    <thead>
                        <tr>
                            <th scope='col'>Booking Id</th>
                            <th scope='col'>Room Id</th>
                            <th scope='col'>Room Type</th>
                            <th scope='col'>Check in Date</th>
                            <th scope='col'>Check Out Date</th>
                            <th scope='col'>Confirmation Code</th>
                            <th scope='col'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index}>
                            <td>{booking.bookingId || "N/A"}</td>
                            <td>{booking.roomId || "N/A"}</td>
                            <td>{booking.roomType || "N/A"}</td>
                            <td>{booking.checkInDate ? moment(booking.checkInDate).subtract(1,"month").format("MMM Do, YYYY") : "N/A"}</td>
                            <td>{booking.checkOutDate ? moment(booking.checkOutDate).subtract(1,"month").format("MMM Do, YYYY") : "N/A"}</td>
                            <td>{booking.bookingConfirmationCode}</td>
                            <td className='text-success'>On-going</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            ): (
                <p>You have not made any booking yet.</p>
            )}
            <div className='d-flex justify-content-center'>
                <div className='mx-2'>
                    <button className='btn btn-danger btn-sm' onClick={handleDeleteAccount}>Close Account</button>
                </div>
            </div>
    </div>
  )
}

export default Profile
