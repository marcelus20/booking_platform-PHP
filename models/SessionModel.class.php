<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 21/11/18
 * Time: 05:46
 */

class SessionModel{
    private $userId, $user_type;

    /**
     * SessionModel constructor.
     */
    public function __construct()
    {
    }

    /**
     * SessionModel constructor.
     * @param $userId
     * @param $username
     */
//    public function __construct($userId, $username)
//    {
//        $this->userId = $userId;
//        $this->username = $username;
//    }





    /**
     * @return mixed
     */
    public function getUserId()
    {
        return $this->userId;
    }

    /**
     * @param mixed $userId
     */
    public function setUserId($userId)
    {
        $this->userId = $userId;
    }

    /**
     * @return mixed
     */
    public function getUsertype()
    {
        return $this->user_type;
    }

    /**
     * @param mixed $user_type
     */
    public function setUsertype($user_type)
    {
        $this->user_type = $user_type;
    }



}