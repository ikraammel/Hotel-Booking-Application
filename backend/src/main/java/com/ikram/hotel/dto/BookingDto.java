package com.ikram.hotel.dto;

import lombok.Data;

@Data
public class BookingDto {
    private String guestFullName;
    private String guestEmail;
    private String checkInDate;    // YYYY-MM-DD
    private String checkOutDate;
    private int numberOfAdults;
    private int numberOfChildren;
}
