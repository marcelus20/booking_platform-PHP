class ServiceProvider {

    constructor(s_id, company_full_name, approved_status, location, bookingslots = []){
        this.s_id = s_id;
        this.company_full_name = company_full_name;
        this.approved_status = approved_status;
        this.location = location;
        this.bookingSlots = bookingslots;
    }
}

const serviceProvider = ({s_id, company_full_name, approved_status, location, bookingSlots})=>
    new ServiceProvider(s_id, company_full_name, approved_status, location_(location), bookingSlots.map(bookingSlot));