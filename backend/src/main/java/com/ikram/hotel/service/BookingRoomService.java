package com.ikram.hotel.service;

import com.ikram.hotel.dto.BookingDto;
import com.ikram.hotel.exception.InvalidBookingRequestException;
import com.ikram.hotel.exception.ResourceNotFoundException;
import com.ikram.hotel.model.BookedRoom;
import com.ikram.hotel.model.Room;
import com.ikram.hotel.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingRoomService implements IBookingRoomService {

    private final BookingRepository bookingRepository;
    private final RoomService roomService;

    @Override
    public List<BookedRoom> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<BookedRoom> getAllBookingsByRoomId(Long roomId) {
        List<BookedRoom> bookings = bookingRepository.findAll();
        List<BookedRoom> bookingByRoomId = new ArrayList<>();
        for (BookedRoom booking : bookings) {
            Room room = booking.getRoom();
            if (room.getId().equals(roomId)) {
                bookingByRoomId.add(booking);
            }
        }
        return bookingByRoomId;
    }

    @Override
    public void cancelBooking(Long bookingId) {
        bookingRepository.deleteById(bookingId);
    }

    @Override
    public String saveBooking(Long roomId, BookingDto bookingDto) {
        Room room = roomService.getRoomById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + roomId));

        BookedRoom booking = new BookedRoom();
        booking.setGuestFullName(bookingDto.getGuestFullName());
        booking.setGuestEmail(bookingDto.getGuestEmail());
        booking.setCheckInDate(LocalDate.parse(bookingDto.getCheckInDate()));
        booking.setCheckOutDate(LocalDate.parse(bookingDto.getCheckOutDate()));
        booking.setNumOfAdults(bookingDto.getNumberOfAdults());
        booking.setNumOfChildren(bookingDto.getNumberOfChildren());
        booking.setTotalNumOfGuest(bookingDto.getNumberOfAdults() + bookingDto.getNumberOfChildren());
        booking.setBookingConfirmationCode(generateBookingCode());
        booking.setRoom(room);

        if (booking.getCheckOutDate().isBefore(booking.getCheckInDate())) {
            throw new InvalidBookingRequestException("Check-in must come before check-out date!");
        }

        if (!roomIsAvailable(booking, room.getBookings())) {
            throw new InvalidBookingRequestException("Sorry, this room isn't available for the selected dates.");
        }

        room.addBooking(booking);
        bookingRepository.save(booking);

        return booking.getBookingConfirmationCode();
    }

    private boolean roomIsAvailable(BookedRoom bookingRequest, List<BookedRoom> existingBookings) {
        return existingBookings.stream()
                .noneMatch(existingBooking ->
                        bookingRequest.getCheckInDate().equals(existingBooking.getCheckInDate())

                                || (bookingRequest.getCheckInDate().isAfter(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().isBefore(existingBooking.getCheckInDate())
                                && bookingRequest.getCheckOutDate().isAfter(existingBooking.getCheckOutDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckOutDate().equals(existingBooking.getCheckInDate()))

                                || (bookingRequest.getCheckInDate().equals(existingBooking.getCheckOutDate())
                                && bookingRequest.getCheckInDate().equals(bookingRequest.getCheckOutDate()))
                );
    }

    private String generateBookingCode() {
        return UUID.randomUUID().toString().substring(0, 10); // ex: "a1b2c3d4e5"
    }

    @Override
    public BookedRoom findByBookingConfirmationCode(String confirmationCode) {
        return bookingRepository.findByBookingConfirmationCode(confirmationCode)
                .orElseThrow(() -> new ResourceNotFoundException("No booking found with booking code :"+confirmationCode));
    }

    @Override
    public List<BookedRoom> getBookingsByGuestEmail(String email) {
        return bookingRepository.findByGuestEmail(email);
    }

    @Override
    public BookedRoom getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));
    }

}
