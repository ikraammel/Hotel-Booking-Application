package com.ikram.hotel.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roomType;
    private BigDecimal roomPrice;
    private boolean isBooked = false;

    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "photo", columnDefinition = "bytea")
    @JsonIgnore
    private byte[] photo;

    @OneToMany(mappedBy = "room", fetch = FetchType.LAZY,cascade = CascadeType.ALL)
    @JsonIgnore
    private List<BookedRoom> bookings = new ArrayList<>();

    public void addBooking(BookedRoom booking){
        if(bookings == null){
            bookings = new ArrayList<>();
        }
        else {
            bookings.add(booking);
            booking.setRoom(this);
            isBooked = true;
            String bookingCode = RandomStringUtils.randomNumeric(10);
            booking.setBookingConfirmationCode(bookingCode);
        }
    }
}
