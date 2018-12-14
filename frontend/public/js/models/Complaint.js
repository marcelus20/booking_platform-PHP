/**
 * ENTITY REPRESENTATION : booking_platform.complaints
 *
 * This class maps to the Complaints entity in DB.
 *
 */
class Complaint {

    /**
     * List of attributes for the CONSTRUCTOR intiliasation.
     * @param complaint_ID -> column value
     * @param s_id -> column value
     * @param c_id -> column value
     * @param serviceName -> column value
     * @param customerName -> column value
     * @param complaintStatus -> column value
     * @param complaint -> column value
     */
    constructor(complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint){
        /**
         * complaint_ID column ATTRIBUTE
         */
        this.complaint_ID = complaint_ID;
        /**
         * s_id : id of service provider column attribute
         */
        this.s_id = s_id;
        /**
         * c_id : id of customer column attribute
         */
        this.c_id = c_id;
        /**
         * service Name : not an attribute of the entity.
         */
        this.serviceName = serviceName;
        /**
         * customer Name: not an attribute of the entity
         */
        this.customerName = customerName;
        /**
         * complaintStatus atribute
         */
        this.complaintStatus = complaintStatus;
        /**
         * complaint text attribute
         */
        this.complaint = complaint
    }
}

/**
 * HELPER function to desconstruct a literal object pased from JSON to a new Complaint object.
 * @param complaint_ID
 * @param s_id
 * @param c_id
 * @param serviceName
 * @param customerName
 * @param complaintStatus
 * @param complaint
 * @returns {Complaint}
 */
const complaint = ({complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint}) =>
    new Complaint(complaint_ID, s_id, c_id, serviceName, customerName, complaintStatus ,complaint);