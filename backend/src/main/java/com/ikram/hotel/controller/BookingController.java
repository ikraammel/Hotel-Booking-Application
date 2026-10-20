package com.ikram.hotel.controller;

import com.ikram.hotel.dto.BookingDto;
import com.ikram.hotel.exception.InvalidBookingRequestException;
import com.ikram.hotel.exception.ResourceNotFoundException;
import com.ikram.hotel.model.BookedRoom;
import com.ikram.hotel.model.Room;
import com.ikram.hotel.response.BookingResponse;
import com.ikram.hotel.response.RoomResponse;
import com.ikram.hotel.service.IBookingRoomService;
import com.ikram.hotel.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final IBookingRoomService bookingRoomService;
    private final IRoomService roomService;

    @GetMapping("/all-bookings")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<BookingResponse>> getAllBookings(){
        List<BookedRoom> bookings = bookingRoomService.getAllBookings();
        List<BookingResponse> bookingResponses = new ArrayList<>();
        for(BookedRoom booking : bookings){
            Room room = roomService.getRoomById(booking.getRoom().getId()).orElse(null);
            BookingResponse bookingResponse = null;
            if (room != null) {
                bookingResponse = new BookingResponse(
                        booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(),
                        booking.getGuestFullName(),
                        booking.getGuestEmail(),
                        booking.getNumOfAdults(),
                        booking.getNumOfChildren(),
                        booking.getTotalNumOfGuest(),
                        booking.getBookingConfirmationCode(),
                        room.getId(),
                        room.getRoomType()
                );
            }
            bookingResponses.add(bookingResponse);
        }
        return ResponseEntity.ok(bookingResponses);
    }


    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getBookingByConfirmationCode(@PathVariable String confirmationCode){
        try{
            BookedRoom booking = bookingRoomService.findByBookingConfirmationCode(confirmationCode);
            BookingResponse bookingResponse = getBookingResponse(booking);
            return ResponseEntity.ok(bookingResponse);
        }catch(ResourceNotFoundException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/room/{roomId}/booking")
    public ResponseEntity<?> saveBooking(@PathVariable Long roomId,@RequestBody BookingDto bookingRequest){
        try{
            String confirmationCode = bookingRoomService.saveBooking(roomId,bookingRequest);
            return ResponseEntity.ok("Room booked successfully ! Your booking confirmation code is : "+confirmationCode);
        }catch (InvalidBookingRequestException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/booking/{bookingId}/delete")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long bookingId, Principal principal){
        String currentEmail = principal.getName();
        BookedRoom bookedRoom = bookingRoomService.getBookingById(bookingId);
        if (!bookedRoom.getGuestEmail().equals(currentEmail)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        bookingRoomService.cancelBooking(bookingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BookingResponse>> getBookingsByUserEmail(@PathVariable String email) {
        List<BookedRoom> bookings = bookingRoomService.getBookingsByGuestEmail(email);
        List<BookingResponse> bookingResponses = new ArrayList<>();

        for (BookedRoom booking : bookings) {
            Room room = roomService.getRoomById(booking.getRoom().getId()).orElse(null);
            if (room != null) {
                BookingResponse bookingResponse = new BookingResponse(
                        booking.getBookingId(),
                        booking.getCheckInDate(),
                        booking.getCheckOutDate(),
                        booking.getGuestFullName(),
                        booking.getGuestEmail(),
                        booking.getNumOfAdults(),
                        booking.getNumOfChildren(),
                        booking.getTotalNumOfGuest(),
                        booking.getBookingConfirmationCode(),
                        room.getId(),
                        room.getRoomType()
                );
                bookingResponses.add(bookingResponse);
            }
        }

        return ResponseEntity.ok(bookingResponses);
    }


    private BookingResponse getBookingResponse(BookedRoom booking){
        Room room = roomService.getRoomById(booking.getRoom().getId()).get();
        RoomResponse roomResponse = new RoomResponse(room.getId(),
                                                    room.getRoomType(),
                                                    room.getRoomPrice()
                                                    );
        return new BookingResponse(booking.getBookingId(),
                                   booking.getCheckInDate(),
                                   booking.getCheckOutDate(),
                                   booking.getGuestFullName(),
                                   booking.getGuestEmail(),
                                   booking.getNumOfAdults(),
                                   booking.getNumOfChildren(),
                                   booking.getTotalNumOfGuest(),
                                   booking.getBookingConfirmationCode(), room.getId(),room.getRoomType());
    }
}

