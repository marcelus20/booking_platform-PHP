/**
 * Class to gather all the user thats logged in relevant information such as id, email and user_type
 */
class SessionModel{
    /**
     * CONSTRUCTOR
     * @param userId
     * @param user_type
     * @param email
     */
    constructor(userId, user_type, email){
        this.userId = userId;
        this.user_type = user_type;
        this.email = email;
    }
}

/**
 * helper function to converts the literal object received in JSON from the server and converts it into a SessionModel instance
 * @param userId
 * @param user_type
 * @param email
 * @returns {SessionModel}
 */
const sessionModel = ({userId, user_type, email}) => new SessionModel(userId, user_type, email);
