import React, { useState } from 'react';

const RoomFilter = ({ data, setFiltered, clearFilter }) => {
    const [filter, setFilter] = useState("");

    const handleSelectChange = (e) => {
        const selectedRoomType = e.target.value;
        setFilter(selectedRoomType);
        const filteredRooms = data.filter((room) =>
            room.roomType.toLowerCase().includes(selectedRoomType.toLowerCase())
        );
        setFiltered(filteredRooms);  // Applique le filtre
    };

    const roomTypes = Array.isArray(data)
        ? ["", ...new Set(data.map((room) => room.roomType))]
        : [];

    return (
        <div className='input-group mb-3'>
            <span className='input-group-text' id='room-type-filter'>
                Filter rooms by type
            </span>
            <select
                className='form-select'
                value={filter}
                onChange={handleSelectChange}
            >
                <option value={""}>Select a room type to filter ...</option>
                {roomTypes.map((type, index) => (
                    <option key={index} value={type}>
                        {type}
                    </option>
                ))}
            </select>
            <button
                className='btn btn-hotel'
                type='button'
                onClick={clearFilter}  // Appel de clearFilter depuis le parent (ExistingRooms)
            >
                Clear Filter
            </button>
        </div>
    );
};

export default RoomFilter;
