<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 20/11/18
 * Time: 00:21
 */


class CustomerFormModel{
    private $email, $password, $confirmPass, $phone, $firstName, $lastName;

    function __construct($email, $password, $confirmPass, $phone, $firstName, $lastName){
        $this->email = $email;
        $this->password = $password;
        $this->confirmPass = $confirmPass;
        $this->phone = $phone;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param mixed $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return mixed
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param mixed $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * @return mixed
     */
    public function getConfirmPass()
    {
        return $this->confirmPass;
    }

    /**
     * @param mixed $confirmPass
     */
    public function setConfirmPass($confirmPass)
    {
        $this->confirmPass = $confirmPass;
    }

    /**
     * @return mixed
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param mixed $phone
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;
    }

    /**
     * @return mixed
     */
    public function getFirstName()
    {
        return $this->firstName;
    }

    /**
     * @param mixed $firstName
     */
    public function setFirstName($firstName)
    {
        $this->firstName = $firstName;
    }

    /**
     * @return mixed
     */
    public function getLastName()
    {
        return $this->lastName;
    }

    /**
     * @param mixed $lastName
     */
    public function setLastName($lastName)
    {
        $this->lastName = $lastName;
    }


}