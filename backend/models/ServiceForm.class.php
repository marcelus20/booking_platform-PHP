<?php


/**
 * Class ServiceForm
 * Maps each Frontend form view inputs to each attribute of this class.
 * Used by FormControllers to register this new Entry in the database.
 */

class ServiceForm{
    private $email, $password, $confirmPassword, $phone, $companyName, $firstLineAddress, $secondLineAddress, $city, $eirCode;

    /**
     * ServiceForm constructor.
     * @param $email
     * @param $password
     * @param $confirmPassword
     * @param $phone
     * @param $companyName
     * @param $firstLineAddress
     * @param $secondLineAddress
     * @param $city
     * @param $eirCode
     */
    public function __construct($email, $password, $confirmPassword, $phone, $companyName, $firstLineAddress, $secondLineAddress, $city, $eirCode)
    {
        $this->email = $email;
        $this->password = $password;
        $this->confirmPassword = $confirmPassword;
        $this->phone = $phone;
        $this->companyName = $companyName;
        $this->firstLineAddress = $firstLineAddress;
        $this->secondLineAddress = $secondLineAddress;
        $this->city = $city;
        $this->eirCode = $eirCode;
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
    public function getConfirmPassword()
    {
        return $this->confirmPassword;
    }

    /**
     * @param mixed $confirmPassword
     */
    public function setConfirmPassword($confirmPassword)
    {
        $this->confirmPassword = $confirmPassword;
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
    public function getCompanyName()
    {
        return $this->companyName;
    }

    /**
     * @param mixed $companyName
     */
    public function setCompanyName($companyName)
    {
        $this->companyName = $companyName;
    }

    /**
     * @return mixed
     */
    public function getFirstLineAddress()
    {
        return $this->firstLineAddress;
    }

    /**
     * @param mixed $firstLineAddress
     */
    public function setFirstLineAddress($firstLineAddress)
    {
        $this->firstLineAddress = $firstLineAddress;
    }

    /**
     * @return mixed
     */
    public function getSecondLineAddress()
    {
        return $this->secondLineAddress;
    }

    /**
     * @param mixed $secondLineAddress
     */
    public function setSecondLineAddress($secondLineAddress)
    {
        $this->secondLineAddress = $secondLineAddress;
    }

    /**
     * @return mixed
     */
    public function getCity()
    {
        return $this->city;
    }

    /**
     * @param mixed $city
     */
    public function setCity($city)
    {
        $this->city = $city;
    }

    /**
     * @return mixed
     */
    public function getEirCode()
    {
        return $this->eirCode;
    }

    /**
     * @param mixed $eirCode
     */
    public function setEirCode($eirCode)
    {
        $this->eirCode = $eirCode;
    }




}