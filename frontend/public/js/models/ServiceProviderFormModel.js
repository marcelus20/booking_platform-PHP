/**
 * ServiceProviderFormModel class
 *
 * encapsulates all the information retrieved from the form for services providers registration in an object
 * and sends it over to PHP routers server.
 */
class ServiceProviderFormModel {

    /**
     * CONSTRUCTOR
     * @param email
     * @param password
     * @param confirmPassword
     * @param phone
     * @param companyName
     * @param firstLineAddress
     * @param secondLineAddress
     * @param city
     * @param eirCode
     */
    constructor(email, password, confirmPassword, phone, companyName, firstLineAddress, secondLineAddress, city, eirCode){
        this.email = email.trim();
        this.password = password.trim();
        this.confirm_password = confirmPassword.trim();
        this.phone = phone.trim();
        this.company_full_name = companyName.trim();
        this.first_line_address = firstLineAddress.trim();
        this.second_line_address = secondLineAddress.trim();
        this.city = city.trim();
        this.eir_code = eirCode.trim();
    }
}