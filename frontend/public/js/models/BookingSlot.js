class BookingSlot {
    constructor(timestamp, s_id, availability, booking = null) {
        this.timestamp = timestamp;
        this.s_id = s_id;
        this.availability = availability;
        this.booking = booking;
    }

    withBooking(newBooking){
        return new BookingSlot(this.timestamp, this.s_id, this.availability, newBooking);
    }
}

const bookingSlot = ({timestamp, s_id, availability, booking}) =>
    new BookingSlot(timestamp, s_id, availability, booking);