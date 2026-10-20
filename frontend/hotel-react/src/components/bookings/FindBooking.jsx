import React, { useState } from 'react'
import { cancelBooking, getBookingByConfirmationCode } from '../utils/ApiFunctions'


const FindBooking = () => {
  const[confirmationCode,setConfirmationCode]= useState("")
  const[error,setError]= useState("")
  const[successMessage,setSuccessMessage]= useState("")
  const[isLoading,setIsLoading]= useState(false)
  const[bookingInfo,setBookingInfo]= useState({
    booking_id:"",
    roomId:"",
    roomType:"",
    bookingConfirmationCode:"",
    roomNumber:"",
    checkInDate:"",
    checkOutDate:"",
    guestFullName:"",
    guestEmail:"",
    numOfAdults:"",
    numOfChildren:"",
    totalNumOfGuest:""
  })
  const [isDeleted ,setIsDeleted] = useState(false)

  const clearBookingInfo = {
    booking_id:"",
    roomId:"",
    roomType:"",
    bookingConfirmationCode:"",
    roomNumber:"",
    checkInDate:"",
    checkOutDate:"",
    guestFullName:"",
    guestEmail:"",
    numOfAdults:"",
    numOfChildren:"",
    totalNumOfGuest:""
  }

  const handleInputChange = (e) => {
    setConfirmationCode(e.target.value)
  }
  const handleFormSubmit = async(e) =>{
    e.preventDefault()
    setIsLoading(true)
    try{
        const data = await getBookingByConfirmationCode(confirmationCode)
        setBookingInfo(data)
        setError(null)
    }catch(error){
        setBookingInfo(clearBookingInfo)
        if(error.response && error.response.status == 404){
            setError(error.response.data.message)
        }else{
            setError(error.response)
        }
    }
    setTimeout(() => {
        setIsLoading(false)
    },2000)
  }

const handleBookingCancellation = async (bookingId) => {
  const confirmed = window.confirm("Are you sure you want to cancel this booking?");
  if (!confirmed) return; // utilisateur a annulé la confirmation

  try {
    await cancelBooking(bookingId);
    setIsDeleted(true);
    setSuccessMessage("Booking has been canceled successfully!");
    setBookingInfo(clearBookingInfo);
    setConfirmationCode("");
    setError("");
  } catch (error) {
    if (error.response && error.response.status === 403) {
      setError("You are not authorized to cancel this booking.");
    } else {
      setError(error.message);
    }
  }

  setTimeout(() => {
    setSuccessMessage("");
    setIsDeleted(false);
  }, 2000);
};



  return (
    <>
      <div className='container mt-5 d-flex flex-column justify-content-center align-items-center'>
        <h2>Find My Booking</h2>
        <form onSubmit={handleFormSubmit} className='col-md-6'>
            <div className='input-group mb-3'>
                <input type="text"
                 className='form-control'
                  id='confirmationCode' 
                  name='confirmationCode'
                   value={confirmationCode}
                   onChange={handleInputChange}
                   placeholder='Enter the booking confirmation code'/>
                   <button className='btn btn-hotel input-group-text'>Find Booking</button>
            </div>
        </form>

    {isLoading ? (
        <div>Finding Booking ...</div>
        ) : error ? (
        <div className='text-danger'>{error}</div>
        ) : bookingInfo.bookingConfirmationCode ? (
        <div className='col-md-6 mt-4 mb-5'>
            <h3>Booking Information</h3>
            <p>Booking confirmation Code: {bookingInfo.bookingConfirmationCode}</p>
            <p>Booking ID : {bookingInfo.bookingId}</p>
            <p>Room Number : {bookingInfo.roomId}</p> 
            <p>Room Type:{bookingInfo.roomType}</p>
            <p>Check-In Date : {bookingInfo.checkInDate}</p>
            <p>Check-Out Date : {bookingInfo.checkOutDate}</p>
            <p>Full Name : {bookingInfo.guestFullName}</p>
            <p>Email Address : {bookingInfo.guestEmail}</p>
            <p>Adults : {bookingInfo.numOfAdults}</p>
            <p>Children: {bookingInfo.numOfChildren}</p>
            <p>Total Guest : {bookingInfo.totalNumOfGuest}</p>

    {!isDeleted && (
        <button className='btn btn-danger' 
                onClick={() => handleBookingCancellation(bookingInfo.bookingId)}>
            Cancel Booking
        </button>
        )}
    </div>
    ) : confirmationCode ? (
    <div className="text-muted">No booking found for this code.</div>
    ) : null}
    {isDeleted && (
        <div className='alert alert-success mt-3' role='alert'>{successMessage}</div>
    )}
      </div> 
    </>
  )
}

export default FindBooking
