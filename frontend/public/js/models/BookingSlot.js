/**
 * ENTITY REPRESENTATION: booking_platform.booking_slots:
 *
 * This class maps to the booking_slots table in the database
 */
class BookingSlot {
    /**
     * constructor gets 4 parameters, if the forth is not specifyied, then a defaul value of null is assigned.
     * @param timestamp -> column value
     * @param s_id -> column value
     * @param availability -> column value
     * @param booking -> column value
     */
    constructor(timestamp, s_id, availability, booking = null) {
        /**
         * timestamp attribute
         */
        this.timestamp = timestamp;
        /**
         * s_id : id of the service provider  -> attribute
         */
        this.s_id = s_id;
        /**
         * availability attribute
         */
        this.availability = availability;
        /**
         * Booking attribute: ONE TO ONE RELATIONSHIPS with the BOOKING ENTITY.
         */
        this.booking = booking;
    }

    /**
     * A SETTER FOR THE BOOKING.
     * As booking is set to null by default, after the object is constructor, it is still possible to assign value to the booking.
     * @param newBooking
     * @returns {BookingSlot}
     */
    withBooking(newBooking){
        return new BookingSlot(this.timestamp, this.s_id, this.availability, newBooking);
    }
}

/**
 * a helper function that desconstruct a literal object with the attributes: timestamp, s_id, availability, booking
 * and converts it into a new BookingSlots object.
 *
 * Tipicaly used when PHP server sends back the JSON format of this class, it can be easily converted into BookingSlots by
 * using this helper function.
 * @param timestamp
 * @param s_id
 * @param availability
 * @param booking
 * @returns {BookingSlot}
 */
const bookingSlot = ({timestamp, s_id, availability, booking}) =>
    new BookingSlot(timestamp, s_id, availability, booking);