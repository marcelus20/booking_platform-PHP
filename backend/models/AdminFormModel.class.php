<?php

/**
 * Class AdminFormModel
 * Model class used for inserting new Admin to the system.
 * The view admin form inputs are mapped to the AdminFormModel attributes.
 */
class AdminFormModel{

    /**
     * @var ATTRIBUTES
     */
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