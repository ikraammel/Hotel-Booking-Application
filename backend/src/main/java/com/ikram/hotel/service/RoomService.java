package com.ikram.hotel.service;

import com.ikram.hotel.exception.InternalServerException;
import com.ikram.hotel.exception.ResourceNotFoundException;
import com.ikram.hotel.model.Room;
import com.ikram.hotel.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoomService implements IRoomService{
    private final RoomRepository roomRepository;
    @Override
    public Room addNewRoom(MultipartFile file, String roomType , BigDecimal roomPrice) throws IOException {
        Room room = new Room();
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        if(!file.isEmpty()){
            byte[] photoBytes = file.getBytes();
            room.setPhoto(photoBytes);
        }
        return roomRepository.save(room);
    }

    @Override
    public List<String> getAllRoomTypes() {
        return roomRepository.findDistinctRoomTypes();
    }

    @Transactional(readOnly = true)
    @Override
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @Override
    public byte[] getRoomPhotoByRoomId(Long roomId) {
        Optional<Room> theRoom= roomRepository.findById(roomId);
        if(theRoom.isEmpty()){
            throw new ResourceNotFoundException("Sorry, Room not found!");
        }
        byte[] photoBytes = theRoom.get().getPhoto();
        return photoBytes;
    }

    @Override
    public void deleteRoomById(Long roomId) {
     roomRepository.findById(roomId).ifPresent(roomRepository::delete);
    }

    @Override
    public Room updateRoom(Long roomId, String roomType, BigDecimal roomPrice,byte[] photoBytes) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));
        if(roomType != null) room.setRoomType(roomType);
        if(roomPrice != null) room.setRoomPrice(roomPrice);
        if(photoBytes != null && photoBytes.length > 0) {
            room.setPhoto(photoBytes);
        }
        return roomRepository.save(room);
    }

    @Override
    public Optional<Room> getRoomById(Long roomId) {
        return Optional.ofNullable(roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found")));

    }

    @Override
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        return roomRepository.findAvailableRoomsByDatesAndType(checkInDate,checkOutDate,roomType);
    }
}
