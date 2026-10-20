package com.ikram.hotel.service;

import com.ikram.hotel.model.Room;
import com.ikram.hotel.response.RoomResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IRoomService {

    Room addNewRoom(MultipartFile photo, String roomType , BigDecimal roomPrice) throws SQLException, IOException;
    List<String> getAllRoomTypes();
    List<Room> getAllRooms();
    byte[] getRoomPhotoByRoomId(Long roomId) throws SQLException;
    void deleteRoomById(Long roomId);
    Room updateRoom(Long roomId, String roomType, BigDecimal roomPrice,byte[] photoBytes);
    Optional<Room> getRoomById(Long roomId);

    List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType);
}
