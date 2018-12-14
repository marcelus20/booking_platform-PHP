<?php


/**
 * Class CustomerFormModel
 * Maps each input of the view customer registration form to its attributes.
 *
 * Used to encapsulate entire object in a instance and then controller can take it and
 * insert each attribute data to the database.
 *
 */

class CustomerFormModel{
    /**
     * @var ATTRIBUTES
     */
    private $email, $password, $confirmPass, $phone, $firstName, $lastName;

    /**
     * CustomerFormModel constructor.
     * @param $email
     * @param $password
     * @param $confirmPass
     * @param $phone
     * @param $firstName
     * @param $lastName
     */
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