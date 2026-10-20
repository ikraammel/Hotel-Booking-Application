import axios from "axios";

const isLocalhost = window.location.hostname === "localhost";

export const api = axios.create({
  baseURL: isLocalhost
    ? "http://localhost:8080"
    : "https://hotel-booking-backend-5x9o.onrender.com",
  withCredentials: true
});


export const getHeader = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };
};

// to add a new room to the db
export async function addRoom(photo, roomType, roomPrice) {
  const formData = new FormData();
  formData.append("photo", photo);
  formData.append("roomType", roomType);
  formData.append("roomPrice", roomPrice);

   const response = await api.post(
    "/rooms/add/new-room",
    formData,
    {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": undefined
      }
    }
  );

  return response.status === 201;
}

// To get all room types from the db
export async function getRoomTypes() {
  try {
    const response = await api.get("/rooms/room-types");
    return response.data;
  } catch (error) {
    throw new Error("Error fetching room types");
  }
}

// To get all rooms
export async function getAllRooms() {
  try {
    const result = await api.get("/rooms/all");
    return result.data;
  } catch (error) {
    throw new Error("Error fetching rooms");
  }
}

// To delete a room by id
export async function deleteRoom(roomId) {
  try {
    const result = await api.delete(`/rooms/delete/room/${roomId}`, {
      headers: getHeader()
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error deleting room ${error.message}`);
  }
}

// To update a room
export async function updateRoom(roomId, roomData) {
  try {
    const formData = new FormData();
    formData.append("roomType", roomData.roomType);
    formData.append("roomPrice", roomData.roomPrice);
    formData.append("photo", roomData.photo);

    const response = await api.put(`/rooms/update/${roomId}`, formData, {
      headers: {
        ...(localStorage.getItem("token")
          ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
          : {}),
        "Content-Type": undefined
    }
    });

    return response;
  } catch (error) {
    throw new Error(`Error updating room: ${error.message}`);
  }
}

// To get a room by id
export async function getRoomById(roomId) {
  try {
    const result = await api.get(`rooms/room/${roomId}`);
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching room ${error.message}`);
  }
}

// To save a new booking to the db
export async function bookRoom(roomId, booking) {
  if (!roomId) {
    throw new Error("Room ID is required");
  }

  try {
    const response = await api.post(
      `/bookings/room/${roomId}/booking`,
      booking,
      { headers: getHeader() }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error booking room: ${error.message}`);
    }
  }
}

// To get all bookings from the db
export async function getAllBookings() {
  try {
    const result = await api.get("/bookings/all-bookings", {
      headers: getHeader()
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error fetching bookings : ${error.message}`);
  }
}

// To get booking by the confirmation code
export async function getBookingByConfirmationCode(confirmationCode) {
  try {
    const result = await api.get(`/bookings/confirmation/${confirmationCode}`, {
      headers: getHeader()
    });
    return result.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`Error finding booking : ${error.message}`);
    }
  }
}

// To cancel booking
export async function cancelBooking(bookingId) {
  try {
    const result = await api.delete(`/bookings/booking/${bookingId}/delete`, {
      headers: getHeader()
    });
    return result.data;
  } catch (error) {
    throw new Error(`Error cancelling booking : ${error.message}`);
  }
}

// To get all available rooms from the db
export async function getAllAvailableRooms(checkInDate, checkOutDate, roomType) {
  const results = await api.get(
    `/rooms/available-rooms?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&roomType=${roomType}`
  );
  return results;
}

// Register user
export async function registerUser(registration) {
  try {
    const response = await api.post("/auth/register-user", registration);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`User registration error : ${error.message}`);
    }
  }
}

// Login user
export async function loginUser(login) {
  try {
    const response = await api.post("/auth/login", login);
    return response.status >= 200 && response.status < 300
      ? response.data
      : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Get user profile
export async function getUserProfile(userId) {
  try {
    const response = await api.get(`/users/profile/${userId}`, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Delete user
export async function deleteUser(userId) {
  try {
    const response = await api.delete(`/users/delete/${userId}`, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    return error.message;
  }
}

// Get user
export async function getUser(userId) {
  try {
    const response = await api.get(`/users/${userId}`, {
      headers: getHeader()
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

// Get bookings by email
export const getBookingsByEmail = async (email) => {
  try {
    const response = await api.get(`/bookings/user/${email}`, {
      headers: getHeader()
    });

    const data = response.data;
    return Array.isArray(data) ? data : [data];
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};
