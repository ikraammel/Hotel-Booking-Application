package com.ikram.hotel.repository;

import com.ikram.hotel.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room,Long> {

    @Query("select DISTINCT r.roomType from Room r")
    List<String> findDistinctRoomTypes();

    @Query("select r from Room r " +
    "where r.roomType LIKE %:roomType% "+
    "and r.id NOT IN ("+
    "select br.room.id from BookedRoom br "+
    "WHERE (br.checkInDate <= :checkOutDate) and (br.checkOutDate >= :checkInDate))")
    List<Room> findAvailableRoomsByDatesAndType(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
}
