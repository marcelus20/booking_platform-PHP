<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 21/11/18
 * Time: 05:46
 */



class SessionModel implements JsonSerializable {
    private $userId;
    private $user_type;
    private $email;

    /**
     * SessionModel constructor.
     * @param $userId
     * @param $user_type
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