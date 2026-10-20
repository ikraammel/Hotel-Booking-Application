package com.ikram.hotel.service;

import com.ikram.hotel.dto.BookingDto;
import com.ikram.hotel.model.BookedRoom;
import com.ikram.hotel.response.BookingResponse;

import java.util.List;

public interface IBookingRoomService {
    public List<BookedRoom> getAllBookings();
    public List<BookedRoom> getAllBookingsByRoomId(Long roomId);
    public void cancelBooking(Long bookingId);
    public String saveBooking(Long roomId, BookingDto bookingDto);
    public BookedRoom findByBookingConfirmationCode(String confirmationCode);
    public List<BookedRoom> getBookingsByGuestEmail(String email);

    BookedRoom getBookingById(Long bookingId);
}
