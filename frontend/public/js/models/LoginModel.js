/**
 * Login Model class.
 *
 * Encapsulates the entries of the login form in an object to be sent over to PHP server in JSON format.
 */
class LoginModel{
    /**
     * constructor.
     * @param email
     * @param password
     */
    constructor(email, password){
        this.email = email;
        this.password = password;
    }
}
