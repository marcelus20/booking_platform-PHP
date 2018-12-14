/**
 * ENTITY REPRESENTATION CLASS: booking_platform.location
 *
 * Maps to the location entity in the database
 */
class Location {
    /**
     * construcotr
     * @param s_id
     * @param eir_code
     * @param second_line_address
     * @param first_line_address
     * @param city
     */
    constructor(s_id, eir_code, second_line_address, first_line_address, city){
        this.s_id = s_id;
        this.eirCode = eir_code;
        this.second_line_address = second_line_address;
        this.first_line_address = first_line_address;
        this.city = city;
    }
}

/**
 * Helper function to disconstruct an letaral object received in JSON format from the PHP server into the
 * new instance of Location class.
 * @param s_id
 * @param eir_code
 * @param second_line_address
 * @param first_line_address
 * @param city
 * @returns {Location}
 * @private
 */

const location_ = ({s_id, eir_code, second_line_address, first_line_address, city}) =>
    new Location(s_id, eir_code, second_line_address, first_line_address, city);