/**
 * ENTITY REPRESENTATION CLASS: booking_platform.service_provider
 * Maps to service_provider entity in the database.
 */
class ServiceProvider {

    /**
     * Constructor
     * @param s_id
     * @param company_full_name
     * @param approved_status
     * @param location
     * @param bookingslots
     */
    constructor(s_id, company_full_name, approved_status, location, bookingslots = []){
        this.s_id = s_id;
        this.company_full_name = company_full_name;
        this.approved_status = approved_status;
        this.location = location;
        /**
         * ONE TO MANY relationship -> list of BookingSlots
         * @type {Array}
         */
        this.bookingSlots = bookingslots;
    }

    /**
     * setter for the array of BookingSlots
     * @param bookingSlots_
     * @returns {ServiceProvider}
     */
    withBookingSlots(bookingSlots_){
        return new ServiceProvider(
            this.s_id, this.company_full_name, this.approved_status, this.location,
            bookingSlots_.map(bookingSlot)
        );
    }
}

/**
 * HELPER function that converts an literal object received in a JSON format into a new Instance of Service provider class
 * @param s_id
 * @param company_full_name
 * @param approved_status
 * @param location
 * @param bookingSlots
 * @returns {ServiceProvider}
 */
const serviceProvider = ({s_id, company_full_name, approved_status, location, bookingSlots})=>
    new ServiceProvider(s_id, company_full_name, approved_status, location_(location), bookingSlots.map(bookingSlot));