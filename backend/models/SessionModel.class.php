<?php


/**
 * Class SessionModel
 * Gathers all the necessary information of the logged in user, serialize it to JSON and saves its
 * string JSON version to the _SESSION[userSession] superGlobal
 *
 * To save it into _SESSION[userSession]:
 *
 * serialize(new SessionModel("2", "CUSTOMER","marcelus20felipe@gmail.com")) -> RETURNS
 *
 * {
    "userId": "2",
    "user_type": "CUSTOMER",
    "email": "marcelus20felipe.com"
 * }
 *
 * to retrieve the object back:
 * unserialize(_SESSION[userSession]) -> returns new SessionModel("2", "CUSTOMER","marcelus20felipe@gmail.com"));
 */

class SessionModel implements JsonSerializable {
    /**
     * @var string attributes
     */
    private $userId;
    private $user_type;
    private $email;

    /**
     * SessionModel constructor.
     * @param $userId
     * @param $user_type;
     * @param $email
     */
    public function __construct($userId = "", $user_type = "", $email = ""){
        $this->userId = $userId;
        $this->user_type = $user_type;
        $this->email = $email;
    }

    /**
     * @return string
     */
    public function getUserId(){
        return $this->userId;
    }

    /**
     * @return string
     */
    public function getUserType(){
        return $this->user_type;
    }

    /**
     * @return string
     */
    public function getEmail(){
        return $this->email;
    }


    /**
     * Specify data which should be serialized to JSON
     * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize(){
        return get_object_vars($this);
    }
}