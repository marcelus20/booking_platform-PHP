class Complaint {
    constructor(complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint){
        this.complaint_ID = complaint_ID;
        this.s_id = s_id;
        this.c_id = c_id;
        this.serviceName = serviceName;
        this.customerName = customerName;
        this.complaintStatus = complaintStatus
        this.complaint = complaint
    }
}

const complaint = ({complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint}) =>
    new Complaint(complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint);