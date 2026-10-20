import React ,{useEffect, useState} from 'react'
import { getRoomById,updateRoom } from '../utils/ApiFunctions'
import {Link,useParams} from "react-router-dom"
import RoomTypeSelector from '../common/RoomTypeSelector'
import {useNavigate} from 'react-router-dom'

const EditRoom = () => {
   const[room,setRoom] = useState({
          photo : null,
          roomType : "",
          roomPrice : ""
      })
  
      const[imagePreview,setImagePreview] = useState("")
      const[successMessage,setSuccessMessage] = useState("")
      const[errorMessage,setErrorMessage] = useState("")

      const {roomId} = useParams()

const navigate = useNavigate();
const handleBack = () => {
  navigate(-1)
}
      const handleRoomInputChange = (e) =>{
        const name = e.target.name
        let value = e.target.value
        if(name == "roomPrice"){
            if(!isNaN(value)){
                value = parseInt(value);
            } else{
                value=""
            }
        }
        setRoom({...room,[name]: value})
    }
      const handleImageChange = (e) => {
        const selectedImage = e.target.files[0]
        setRoom({...room, photo: selectedImage})
        setImagePreview(URL.createObjectURL(selectedImage))
    }

    useEffect(() => {
      const fetchRoom = async() =>{
        try{
          const roomData = await getRoomById(roomId)
          setRoom(roomData)
          setImagePreview(roomData.photo)
        }catch(error){
          console.error(error)
        }
      }
      fetchRoom()
    },[roomId])
    const handleSubmit = async(e) => {
            e.preventDefault()
            try{
                await updateRoom(roomId, room)
                setSuccessMessage("Room updated successfully!")
                const updatedRoomData = await getRoomById(roomId)
                setRoom(updatedRoomData)
                setImagePreview(updatedRoomData.photo)
                setErrorMessage("")
            }catch(error){
                setErrorMessage("Error updating room")
            }
            setTimeout(() => {
                setSuccessMessage("")
                setErrorMessage("")
            },3000)
        }
        return (
          <>
          <section className="container,mt-5 mb-5">
              <div className='row justify-content-center'>
                  <div className='col-md-8 col-lg-6'>
                      <h2 className='mt-5 mb-2'>Edit  a  Room</h2>
                      {successMessage && (
                          <div className='alert alert-success fade show'>{successMessage}</div>
                      )}
                      {errorMessage && (
                          <div className='alert alert-danger fade show'>{errorMessage}</div>
                      )}
      
      
                      <form onSubmit={handleSubmit}>
                          <div className='mb-3 '>
                          <label htmlFor="roomType" className='form-label'>Room Type</label>
                          <input type="text" className='form-control' id='roomType' name='roomType' value={room.roomType}
                          onChange={handleRoomInputChange} />
                          </div>
      
                          <div className='mb-3 '>
                          <label htmlFor="roomPrice" className='form-label'>Room Price</label>
                          <input 
                          className='form-control' 
                          required 
                          id='roomPrice'
                          type='number'
                          name='roomPrice'
                          value={room.roomPrice} 
                          onChange={handleRoomInputChange}/>
                          </div>
      
                          <div className='mb-3 '>
                          <label htmlFor="photo" className='form-label'>Room Photo</label>
                          <input id='photo' name='photo' type='file' className='form-control' onChange={handleImageChange}/>
                          {imagePreview && (
                              <img src={imagePreview}
                               alt="Preview Room Photo" 
                               style={{maxWidth: "400px", maxHeight: "400px"}} 
                               className="mb-3"/>
                          )}
                          </div>
                          <div className='d-grid d-md-flex mt-2'>
                            <button type="button" className='btn btn-outline-info ml-5' onClick={handleBack}>
                                 Back
                              </button>
                              <button type="submit" className='btn btn-outline-primary ml-5'>
                                  Save Room
                              </button>
                              
                          </div>
                      </form>
                  </div>
              </div>    
          </section> 
          </>
        )
      }

export default EditRoom
