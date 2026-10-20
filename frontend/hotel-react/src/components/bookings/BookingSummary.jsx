import React from 'react'

const BookingSummary = ({ 
  booking,
  payment, 
  isFormValid, 
  onConfirm,
  isLoading,
  onCancel,
  numberOfNights
}) => {
  const checkInDate = new Date(booking.checkInDate)
  const checkOutDate = new Date(booking.checkOutDate)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <h4 className="mb-4" style={{ color: '#A94D7B', fontSize: '1.5rem', borderBottom: '2px solid #A94D7B', paddingBottom: '8px' }}>
        Booking Summary
      </h4>
      {/* Guest Information */}
      <div className='mb-4'>
        <h5 className='h5 mb-3' style={{ color: '#A94D7B', fontSize: '1.2rem' }}>Guest Information</h5>
        <div className='ps-3'>
          <p className='mb-2' style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Full Name:</span> {booking.guestFullName}
          </p>
          <p style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Email:</span> {booking.guestEmail}
          </p>
        </div>
      </div>

      {/* Stay Information */}
      <div className='mb-4'>
        <h5 className='h5 mb-3' style={{ color: '#A94D7B', fontSize: '1.2rem' }}>Stay Details</h5>
        <div className='ps-3'>
          <p className='mb-2' style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Check-in:</span> {formatDate(checkInDate)}
          </p>
          <p className='mb-2' style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Check-out:</span> {formatDate(checkOutDate)}
          </p>
          <p style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Nights:</span> {numberOfNights}
          </p>
        </div>
      </div>

      {/* Guests */}
      <div className='mb-4'>
        <h5 className='h5 mb-3' style={{ color: '#A94D7B', fontSize: '1.2rem' }}>Guests</h5>
        <div className='ps-3'>
          <p className='mb-2' style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Adults:</span> {booking.numberOfAdults}
          </p>
          <p style={{ fontSize: '1rem' }}>
            <span className='fw-medium'>Children:</span> {booking.numberOfChildren}
          </p>
        </div>
      </div>

      {/* Payment */}
      <div className='mb-4 p-3' style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <h5 className='h5 mb-2' style={{ color: '#A94D7B', fontSize: '1.2rem' }}>Total Payment</h5>
        <p className='h4 fw-bold' style={{ color: '#A94D7B', fontSize: '1.5rem' }}>
          {payment.toFixed(2)} DH
        </p>
      </div>

      {/* Buttons */}
      {isFormValid && (
        <div className='d-grid gap-3'>
          <button 
            className='btn py-3'
            onClick={onConfirm}
            disabled={isLoading}
            style={{
              backgroundColor: '#A94D7B',
              color: 'white',
              border: 'none',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Processing...
              </>
            ) : (
              'Confirm & Pay'
            )}
          </button>
          
          <button 
            className='btn py-3'
            onClick={onCancel}
            disabled={isLoading}
            style={{
              backgroundColor: 'white',
              color: '#A94D7B',
              border: '2px solid #A94D7B',
              fontSize: '1.1rem',
              fontWeight: '500'
            }}
          >
            Back to Edit
          </button>
        </div>
      )}
    </>
  )
}

export default BookingSummary;
