class ServiceProvider {

    constructor(s_id, company_full_name, approved_status){
        this.s_id = s_id;
        this.company_full_name = company_full_name;
        this.approved_status = approved_status;
    }
}

const serviceProvider = ({s_id, company_full_name, approved_status})=>
    new ServiceProvider(s_id, company_full_name, approved_status);