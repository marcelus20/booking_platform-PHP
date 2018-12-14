/**
 * CustomerFormModel class.
 *
 * This is to be used by to map the customer registration Form from HTML inputs and send it over to
 * PHP router in JSON format.
 */
class CustomerFormModel {
    /**
     * constructor
     * @param email
     * @param password
     * @param confirmPassword
     * @param phone
     * @param firstName
     * @param lastName
     */
    constructor(email, password, confirmPassword, phone, firstName, lastName){
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phone = phone;
        this.first_name = firstName;
        this.last_name = lastName;
    }
}