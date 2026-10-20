import React, { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { cancelBooking, getAllBookings } from '../utils/ApiFunctions'
import BookingsTable from './BookingsTable'
import Main from '../layout/Main'

const Bookings = () => {
    const[bookingInfo,setBookingInfo] = useState([])
    const[isLoading,setIsLoading] = useState(true)
    const[error,setError] = useState("")
    const id = useParams

    useEffect(() => {
        setTimeout(() =>{
            getAllBookings().then((data) => {
                setBookingInfo(data)
                setIsLoading(false)
            }).catch((error) => {
                setError(error.message)
                setIsLoading(false)
            })
        },1000)
    },[])
    const handleBookingCancellation = async(bookingId) => {
        try{
            await cancelBooking(bookingId)
            const data = await getAllBookings()
            setBookingInfo(data)
        }catch(error){
            setError(error.message)
        }
    }
  return (
    <section style={{backgroundColor:"whitesmoke"}}>
      <Main title={"Existing Bookings"}/>
      {error && (<div className='text-danger'>{error}</div>)}
      {isLoading ? (<div>Loading existing bookings</div>
      ):(
        <BookingsTable bookingInfo={bookingInfo} handleBookingCancellation={handleBookingCancellation}/>    
      )}
    </section>
  )
}

export default Bookings
