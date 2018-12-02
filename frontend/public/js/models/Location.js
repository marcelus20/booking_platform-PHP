
class Location {
    constructor(s_id, eir_code, second_line_address, first_line_address, city){
        this.s_id = s_id;
        this.eirCode = eir_code;
        this.second_line_address = second_line_address;
        this.first_line_address = first_line_address;
        this.city = city;
    }
}

const location_ = ({s_id, eir_code, second_line_address, first_line_address, city}) =>
    new Location(s_id, eir_code, second_line_address, first_line_address, city);