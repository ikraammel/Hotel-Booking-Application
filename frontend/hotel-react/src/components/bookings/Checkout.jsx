import React, { useEffect, useState } from 'react'
import BookingForm from './BookingForm'
import { getRoomById } from '../utils/ApiFunctions'
import { useParams } from 'react-router-dom'
import { FaCar, FaParking, FaTshirt, FaUtensils, FaWineGlassAlt, FaWifi, FaTv } from 'react-icons/fa'
import RoomCarousel from '../common/RoomCarousel'


const Checkout = () => {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [roomInfo, setRoomInfo] = useState({ photo: "", roomType: "", roomPrice: "" })

  const { roomId } = useParams()

  useEffect(() => {
    setTimeout(() => {
      getRoomById(roomId)
        .then((response) => {
          setRoomInfo(response)
          setIsLoading(false)
        })
        .catch((error) => {
          setError(error.message || "Error fetching room info")
          setIsLoading(false)
        })
    }, 2000)
  }, [roomId])

  return (
    <div>
      <section className="container">
        <div
          className="row flex-column flex-md-row align-items-stretch"
          style={{ minHeight: '600px' }} // hauteur minimale pour la hauteur identique
        >
          {/* Colonne infos chambre (largeur moindre) */}
          <div className="col-md-4 mt-5 mb-5 d-flex flex-column">
            {isLoading ? (
              <p>Loading room infos...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <div className="room-info card shadow p-3 flex-grow-1 d-flex flex-column">
                <img
                  src={`data:image/png;base64,${roomInfo.photo}`}
                  alt="Room Photo"
                  style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                />
                <table className="table table-bordered mt-3 w-100">
                  <tbody>
                    <tr>
                      <th>Room Type :</th>
                      <td>{roomInfo.roomType}</td>
                    </tr>
                    <tr>
                      <th>Room Price :</th>
                      <td>{roomInfo.roomPrice} DH</td>
                    </tr>
                    <tr>
                      <th>Room Service :</th>
                      <td>
                        <ul className="list-unstyled">
                          <li><FaWifi /> WiFi</li>
                          <li><FaTv /> Netflix Premium</li>
                          <li><FaUtensils /> Breakfast</li>
                          <li><FaWineGlassAlt /> Mini bar refreshment</li>
                          <li><FaCar /> Car Service</li>
                          <li><FaParking /> Parking Space</li>
                          <li><FaTshirt /> Laundry</li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
</table>

                
              </div>
            )}
          </div>

          <div className="col-md-8 mt-5 mb-5 d-flex flex-column">
            <div className="flex-grow-1 d-flex flex-column">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
      <div className='container'>
            <RoomCarousel/>
      </div>
    </div>
  )
}

export default Checkout
