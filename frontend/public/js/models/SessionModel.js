class SessionModel{
    constructor(userId, user_type, email){
        this.userId = userId;
        this.user_type = user_type;
        this.email = email;
    }
}

const sessionModel = ({userId, user_type, email}) => new SessionModel(userId, user_type, email);
