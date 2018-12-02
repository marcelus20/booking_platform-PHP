class Customer {
    constructor(c_id, first_name, last_name){
        this.c_id = c_id;
        this.first_name = first_name;
        this.last_name = last_name;
    }
}

const customer = ({c_id, first_name, last_name}) => new Customer(c_id, first_name, last_name);