/**
 * ENTITY REPRESENTATION CLASS: booking_platform.customers
 */
/**
 * Maps to customers entity in the database
 */
class Customer {
    /**
     * CONSTRUCTOR
     * @param c_id
     * @param first_name
     * @param last_name
     * @param bookingSlots
     */
    constructor(c_id, first_name, last_name, bookingSlots){
        this.c_id = c_id;
        this.first_name = first_name;
        this.last_name = last_name;
        /**
         * ONE TO MANY RELATIONSHIP: List of bookingSlots
         */
        this.bookingSlots = bookingSlots;
    }
}

/**
 * FUNCTION that gets an literal object received as JSON parsed from the server and converts it into a Customer object.
 * @param c_id
 * @param first_name
 * @param last_name
 * @param bookingSlots
 * @returns {Customer}
 */
const customer = ({c_id, first_name, last_name, bookingSlots}) =>
    new Customer(c_id, first_name, last_name, bookingSlots.map(bookingSlot));