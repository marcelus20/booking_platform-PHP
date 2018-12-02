class BookingSlots {
    constructor(timestamp, s_id, availability, booking = null) {
        this.timestamp = timestamp;
        this.s_id = s_id;
        this.availability = availability;
        this.booking = booking;
    }
}

const bookingSlots = ({timestamp, s_id, availability, booking}) =>
    new BookingSlots(timestamp, s_id, availability, booking);