/**
 * AdminFormModel class
 *
 * This class is used to to be transformed into JSON format to send data about the registration of new admins to the
 * System.
 *
 * The routers will map the JSON string from this class back to AdminFormModel class in PHP.
 */
class AdminFormModel {

    constructor(email, password, confirmPassword) {

        /**
         * email of the new Admin
         */
        this.email = email;
        /**
         * password for the new ADMIN
         */
        this.password = password;
        /**
         * form password confirmation for this new admin
         */
        this.confirmPassword = confirmPassword;
    }
}