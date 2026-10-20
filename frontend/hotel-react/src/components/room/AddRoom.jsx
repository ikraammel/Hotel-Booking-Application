
import React, { useState, useEffect } from "react";
import { addRoom } from "../utils/ApiFunctions";
import RoomTypeSelector from "../common/RoomTypeSelector";
import { useNavigate } from "react-router-dom";

const initialRoom = {
  photo: null,
  roomType: "",
  roomPrice: "",
  description: ""
};

const AddRoom = () => {
  const [newRoom, setNewRoom] = useState({ ...initialRoom });
  const [imagePreview, setImagePreview] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const handleBack = () => navigate(-1);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files?.[0];

    if (!selectedImage) return;

    if (!selectedImage.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image.");
      return;
    }

    setNewRoom((prev) => ({
      ...prev,
      photo: selectedImage
    }));

    setImagePreview(URL.createObjectURL(selectedImage));
    setErrorMessage("");
  };

  const handleRoomInputChange = (e) => {
    const { name, value } = e.target;

    setNewRoom((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    if (
      !newRoom.roomType ||
      !newRoom.roomPrice ||
      !newRoom.description.trim()
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (Number(newRoom.roomPrice) <= 0) {
      setErrorMessage("Room price must be greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await addRoom(
        newRoom.photo,
        newRoom.roomType,
        newRoom.roomPrice,
        newRoom.description
      );

      if (success) {
        setSuccessMessage(
          "A new room was successfully added to the database!"
        );

        setNewRoom({ ...initialRoom });
        setImagePreview("");

        const photoInput = document.getElementById("photo");
        if (photoInput) photoInput.value = "";
      } else {
        setErrorMessage("Error adding room.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <h2 className="mt-5 mb-4">Add a New Room</h2>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="mb-3">
              <label htmlFor="roomType" className="form-label">
                Room Type
              </label>

              <RoomTypeSelector
                handleRoomInputChange={handleRoomInputChange}
                newRoom={newRoom}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="roomPrice" className="form-label">
                Room Price
              </label>

              <input
                className="form-control"
                required
                min="0.01"
                step="0.01"
                id="roomPrice"
                type="number"
                name="roomPrice"
                placeholder="e.g. 850"
                value={newRoom.roomPrice}
                onChange={handleRoomInputChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Room Description
              </label>

              <textarea
                id="description"
                name="description"
                className="form-control"
                rows={4}
                maxLength={2000}
                required
                placeholder="Describe the room, amenities, and features..."
                value={newRoom.description}
                onChange={handleRoomInputChange}
              />
              <small className="text-muted">
                {newRoom.description.length}/2000 characters
              </small>
            </div>

            <div className="mb-3">
              <label htmlFor="photo" className="form-label">
                Room Photo
              </label>

              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="form-control"
                onChange={handleImageChange}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview Room Photo"
                  className="img-fluid rounded mt-3 mb-3"
                  style={{
                    maxWidth: "400px",
                    maxHeight: "400px",
                    objectFit: "cover"
                  }}
                />
              )}
            </div>

            <div className="d-flex gap-3 mt-4">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleBack}
              >
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Room"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </section>
  );
};

export default AddRoom;
