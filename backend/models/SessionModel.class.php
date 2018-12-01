<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 21/11/18
 * Time: 05:46
 */

class SessionModel{
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





}