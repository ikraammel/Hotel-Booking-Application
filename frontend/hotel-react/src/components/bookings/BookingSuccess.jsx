import React from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../common/Header'

const BookingSuccess = () => {
    const location = useLocation()
    const confirmationCode = location.state?.confirmationCode
    const bookingDetails = location.state?.bookingDetails
    const payment = location.state?.payment

  return (
    <div className='container-fluid py-5' style={{ maxWidth: '1200px' }}>
      <Header title="Booking Confirmation"/>
      <div className='card shadow-lg p-5 mt-4' style={{ borderRadius: '15px' }}>
        {confirmationCode ? (
            <div className='text-center'>
                <h2 className='text-success mb-4' style={{ color: '#A94D7B', fontSize: '2.2rem' }}>
                  Booking successful!
                </h2>
                
                <div className='alert alert-success p-4' style={{ fontSize: '1.2rem' }}>
                  <p className='mb-3'>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Your reservation has been successfully confirmed.
                  </p>
                  <p className='mb-0'>
                      Confirmation code: <strong className='h4'>{confirmationCode}</strong>
                  </p>
                </div>

                <div className='my-5 p-4 border rounded' style={{ backgroundColor: '#f8f9fa' }}>
                  <h4 className='mb-4' style={{ color: '#A94D7B' }}>Reservation Details</h4>
                  <div className='row text-start'>
                    <div className='col-md-6'>
                      <p><strong>Name:</strong> {bookingDetails?.guestName}</p>
                      <p><strong>Email:</strong> {bookingDetails?.guestEmail}</p>
                    </div>
                    <div className='col-md-6'>
                      <p><strong>Check-in Date:</strong> {bookingDetails?.checkInDate}</p>
                      <p><strong>Check-out Date:</strong> {bookingDetails?.checkOutDate}</p>
                    </div>
                  </div>
                  <div className='mt-3 pt-3 border-top'>
                    <h5 className='mb-0'>
                      Total Payment: <span className='text-primary'>{payment} MAD</span>
                    </h5>
                  </div>
                </div>

                <button 
                  className='btn mt-4 py-3 px-5' 
                  style={{
                    backgroundColor: '#A94D7B',
                    color: 'white',
                    fontSize: '1.1rem',
                    borderRadius: '8px'
                  }}
                  onClick={() => window.location.href = '/'}
                >
                  Back to home page.
                </button>
            </div>
        ):(
            <div className='text-center'>
                <h2 className='text-danger mb-4'>Error occurred during reservation. </h2>
                <div className='alert alert-danger p-4' style={{ fontSize: '1.2rem' }}>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  No confirmation code received. Please try again.
                </div>
                <button 
                  className='btn btn-danger mt-4 py-3 px-5'
                  style={{ fontSize: '1.1rem', borderRadius: '8px' }}
                  onClick={() => window.location.href = '/book-room'}
                >
                  Try again.
                </button>
            </div>
        )}
      </div>
    </div>
  )
}

export default BookingSuccess