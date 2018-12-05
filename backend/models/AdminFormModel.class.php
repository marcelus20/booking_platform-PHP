<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 06:01
 */

class AdminFormModel{
    private $email;
    private $password;
    private $confirmPassword;

    /**
     * AdminFormModel constructor.
     * @param $email
     * @param $password
     * @param $confirmPassword
     */
    public function __construct($email, $password, $confirmPassword)
    {
        $this->email = $email;
        $this->password = $password;
        $this->confirmPassword = $confirmPassword;
    }

    /**
     * @return mixed
     */
    public function getEmail(){
        return $this->email;
    }

    /**
     * @return mixed
     */
    public function getPassword(){
        return $this->password;
    }

    /**
     * @return mixed
     */
    public function getConfirmPassword(){
        return $this->confirmPassword;
    }






}