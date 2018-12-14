/**
 * ENTITY REPRESENTATION: table: booking_platform.Booking
 *
 * This class maps to the Booking table database
 */

class Booking {
    /**
     * CONSTRUCTOR
     * @param booking_status // column value
     * @param review // column value
     */
    constructor(booking_status, review){
        /**
         * column/ attribute
         */
        this.booking_status = booking_status;
        /**
         * column attrivure
         */
        this.review = review;
    }
}

/**
 * A helper function to return a new instance of Booking.
 * @param booking_status
 * @param review
 * @returns {Booking}
 */
const booking = (booking_status, review) => new Booking(booking_status, review);