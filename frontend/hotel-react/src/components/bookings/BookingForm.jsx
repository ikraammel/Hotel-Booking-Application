import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import { getRoomById, bookRoom } from '../utils/ApiFunctions';
import BookingSummary from './BookingSummary';

const BookingForm = () => {
  const [isValidated, setIsValidated] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [roomPrice, setRoomPrice] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const currentUser = localStorage.getItem("userId")

  const [booking, setBooking] = useState({
    guestFullName: "",
    guestEmail: currentUser,
    checkInDate: "",
    checkOutDate: "",
    numberOfAdults: 1,
    numberOfChildren: 0
  });

  const location = useLocation();
  const {roomId} = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBooking({ ...booking, [name]: value });
    setErrorMessage("");
  };

  const getRoomPriceById = async (roomId) => {
    try {
      const response = await getRoomById(roomId);
      setRoomPrice(response.roomPrice);
    } catch (error) {
      throw new Error(error);
    }
  };

  useEffect(() => {
    if (roomId) {
      getRoomPriceById(roomId);
    }
  }, [roomId]);

  const calculatePayment = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return 0;

    const checkIn = moment(booking.checkInDate);
    const checkOut = moment(booking.checkOutDate);

    if (!checkOut.isAfter(checkIn, 'day')) return 0;

    const nights = checkOut.diff(checkIn, 'days');
    return (roomPrice * nights);
  };

  const isGuestCountValid = () => {
    const adultCount = parseInt(booking.numberOfAdults);
    const childrenCount = parseInt(booking.numberOfChildren);
    const totalCount = adultCount + childrenCount;
    return totalCount >= 1 && adultCount >= 1;
  };

  const isCheckOutDateValid = () => {
    if (!booking.checkInDate || !booking.checkOutDate) return false;

    const checkInDate = moment(booking.checkInDate);
    const checkOutDate = moment(booking.checkOutDate);

    if (!checkOutDate.isSameOrAfter(checkInDate)) {
      setErrorMessage("The check-out date must be after the check-in date.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMessage("")

    if(!isGuestCountValid() || !isCheckOutDateValid()){
      setIsValidated(true)
      return ;
    }
    setIsSubmitted(true)
  }

  const handleBooking = async () => {
    if (!roomId) {
      setErrorMessage("No room selected");
      return;
    }
    if (!isGuestCountValid() || !isCheckOutDateValid()) {
      setErrorMessage("Check your dates and number of people.");
      return;
    }

    setIsLoading(true);

    try {
      const confirmationCode = await bookRoom(roomId, booking);
      setSuccessMessage(`Reservation confirmed! Code: ${confirmationCode}`);

      setTimeout(() => {
        navigate("/booking-success", {
          state: {
            confirmationCode,
            bookingDetails: booking,
            payment: calculatePayment(),
          },
        });
      }, 3000);
    } catch (error) {
      setErrorMessage(`Reservation Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const numberOfNights = booking.checkInDate && booking.checkOutDate
    ? moment(booking.checkOutDate).diff(moment(booking.checkInDate), 'days')
    : 0;

  return (
      <div className='container-fluid py-4' style={{ maxWidth: '1200px' }}>
        <div className='row justify-content-center'>
      {/* Formulaire principal */}
          <div className={isSubmitted ? 'col-lg-7' : 'col-lg-10'}>
            <div className='card shadow' style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className='card-body p-4 p-md-5'>
                <h2 className='card-title mb-4'>Reserve Room</h2>
              
              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}

              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              <Form noValidate validated={isValidated}>
                {/* Nom */}
                <div className='mb-4'>
                  <Form.Group>
                    <Form.Label htmlFor='guestFullName' className='h5' style={{ color: '#A94D7B' }}>
                      Full Name:
                    </Form.Label>
                    <Form.Control
                      required
                      type='text'
                      id='guestFullName'
                      name='guestFullName'
                      value={booking.guestFullName}
                      placeholder='Enter your full name'
                      onChange={handleInputChange}
                      className='py-3'
                      style={{ borderColor: '#A94D7B' }}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Please enter your full name
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                {/* Email */}
                <div className='mb-4'>
                  <Form.Group>
                    <Form.Label htmlFor='guestEmail' className='h5' style={{ color: '#A94D7B' }}>
                      Email:
                    </Form.Label>
                    <Form.Control
                      required
                      type='email'
                      id='guestEmail'
                      name='guestEmail'
                      value={booking.guestEmail}
                      placeholder='Enter your email'
                      onChange={handleInputChange}
                      className='py-3'
                      style={{ borderColor: '#A94D7B' }}
                    />
                    <Form.Control.Feedback type='invalid'>
                      Please enter a valid email
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                {/* Période de séjour */}
                <div className='mb-4'>
                  <fieldset className="p-4" style={{ border: "1px solid #A94D7B", borderRadius: "8px" }}>
                    <legend className='h5 px-2'>Lodging Period</legend>
                    <div className='row'>
                      <div className='col-md-6 mb-3 mb-md-0'>
                        <Form.Group>
                          <Form.Label htmlFor='checkInDate' style={{ color: '#A94D7B' }}>Check-in date:</Form.Label>
                          <Form.Control
                            required
                            type='date'
                            id='checkInDate'
                            name='checkInDate'
                            value={booking.checkInDate}
                            min={moment().format("YYYY-MM-DD")}
                            onChange={handleInputChange}
                            className='py-2'
                          />
                          <Form.Control.Feedback type='invalid'>
                            Select check-in date
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>

                      <div className='col-md-6'>
                        <Form.Group >
                          <Form.Label htmlFor='checkOutDate' style={{ color: '#A94D7B' }}>Check-out date:</Form.Label>
                          <Form.Control
                            required
                            type='date'
                            id='checkOutDate'
                            name='checkOutDate'
                            value={booking.checkOutDate}
                            min={booking.checkInDate || moment().format("YYYY-MM-DD")}
                            onChange={handleInputChange}
                            className='py-2'
                          />
                          <Form.Control.Feedback type='invalid'>
                            Select check-out date
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </div>
                  </fieldset>
                </div>

                {/* Nombre de personnes */}
                <div className='mb-4'>
                  <fieldset className="p-4" style={{ border: "1px solid #A94D7B", borderRadius: "8px" }}>
                    <legend className='h5 px-2'>Number of Guests</legend>
                    <div className='row'>
                      <div className='col-md-6 mb-3 mb-md-0'>
                        <Form.Group>
                          <Form.Label htmlFor='numberOfAdults' style={{ color: '#A94D7B' }}>Adults:</Form.Label>
                          <Form.Control
                            required
                            type='number'
                            id='numberOfAdults'
                            name='numberOfAdults'
                            min={1}
                            value={booking.numberOfAdults}
                            onChange={handleInputChange}
                            className='py-2'
                          />
                          <Form.Control.Feedback type='invalid'>
                            Minimum 1 adult
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>

                      <div className='col-md-6'>
                        <Form.Group>
                          <Form.Label htmlFor='numberOfChildren' style={{ color: '#A94D7B' }}>Children:</Form.Label>
                          <Form.Control
                            type='number'
                            id='numberOfChildren'
                            name='numberOfChildren'
                            min={0}
                            value={booking.numberOfChildren}
                            onChange={handleInputChange}
                            className='py-2'
                          />
                        </Form.Group>
                      </div>
                    </div>
                  </fieldset>
                </div>

                {/* Bouton Confirmer */}
                <div className='d-grid mt-4'>
                  <button
                    type="button"
                    className="btn py-3"
                    onClick={isSubmitted ? handleBooking : handleSubmit}
                    style={{
                      backgroundColor: '#A94D7B',
                      color: 'white',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '500'
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Confirm Reservation'}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>

        {/* Résumé de réservation */}
        {isSubmitted && (
        <div className='col-lg-5 mt-lg-0 mt-4'>
          <div className='card shadow-lg' style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className='card-body p-4'>
              <BookingSummary
                booking={booking}
                payment={calculatePayment()}
                onConfirm={handleBooking}
                onCancel={() => setIsSubmitted(false)}
                isFormValid={true}
                isLoading={isLoading}
                numberOfNights={numberOfNights}
              />
              
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
