import React, { useEffect, useState } from 'react';
import RoomFilter from '../common/RoomFilter';
import RoomPaginator from '../common/RoomPaginator';
import { Col, Row } from 'react-bootstrap';
import { deleteRoom, getAllRooms } from '../utils/ApiFunctions';
import { FaEdit, FaEye, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const ExistingRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [roomsPerPage] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const result = await getAllRooms();
      setRooms(result);
      setIsLoading(false);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (selectedRoomType === "") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter((room) => room.roomType === selectedRoomType);
      setFilteredRooms(filtered);
    }
    setCurrentPage(1);
  }, [rooms, selectedRoomType]);

  const handlePaginationClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (roomId) => {
    try {
      const result = await deleteRoom(roomId);
      if (result === "") {
        setSuccessMessage(`Room N°${roomId} was deleted successfully`);
        fetchRooms();
      } else {
        console.error(`Error deleting room : ${result.message}`);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
    setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);
  };

  const calculateTotalPages = (filteredRooms, roomsPerPage, rooms) => {
    const totalRooms = filteredRooms.length > 0 ? filteredRooms.length : rooms.length;
    return Math.ceil(totalRooms / roomsPerPage);
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const clearFilter = () => {
    setFilteredRooms(rooms);
    setSelectedRoomType("");
  };

  return (
    <>
      <section className='mt-5 mb-5 container'>
  <h2 className='mb-4'>Existing Rooms</h2>

  <Row className='align-items-center mb-4'>
    <Col md={6}>
      <RoomFilter
        data={rooms}
        setFiltered={setFilteredRooms}
        clearFilter={clearFilter}
      />
    </Col>
    <Col md={6} className='text-end'>
      <Link to="/add-room" className="btn btn-outline-primary d-inline-flex align-items-center">
        <FaPlus className="me-2" /> Add New Room
      </Link>
    </Col>
  </Row>


  <table className='table table-bordered table-hover'>
    <thead>
      <tr className='text-center'>
        <th>Id</th>
        <th>Room Type</th>
        <th>Room Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {currentRooms.map((room) => (
        <tr key={room.id} className='text-center'>
          <td>{room.id}</td>
          <td>{room.roomType}</td>
          <td>{room.roomPrice}</td>
          <td className='d-flex justify-content-center gap-2'>
            <Link to={`/edit-room/${room.id}`} className='btn btn-info btn-sm'>
              <FaEye />
            </Link>
            <Link to={`/edit-room/${room.id}`} className='btn btn-warning btn-sm'>
              <FaEdit />
            </Link>
            <button
              className='btn btn-danger btn-sm'
              onClick={() => handleDelete(room.id)}
            >
              <FaTrashAlt />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  <RoomPaginator
    currentPage={currentPage}
    totalPages={calculateTotalPages(filteredRooms, roomsPerPage, rooms)}
    onPageChange={handlePaginationClick}
  />
</section>

    </>
  );
};

export default ExistingRooms;
