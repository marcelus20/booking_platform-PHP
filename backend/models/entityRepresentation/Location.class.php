<?php

/**
 * Class Location
 * Entity representation in DB : booking_platform.location
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */

class Location implements JsonSerializable {

    /**
     * @var Attributes / Entity Columns
     */
    private $s_id;
    private $eir_code;
    private $second_line_address;
    private $first_line_address;
    private $city;

    /**
     * Location constructor.
     * @param $s_id
     * @param $eir_code
     * @param $second_line_address
     * @param $first_line_address
     * @param $city
     */
    public function __construct($s_id, $eir_code, $second_line_address, $first_line_address, $city)
    {
        $this->s_id = $s_id;
        $this->eir_code = $eir_code;
        $this->second_line_address = $second_line_address;
        $this->first_line_address = $first_line_address;
        $this->city = $city;
    }

    /**
     * @return mixed
     */
    public function getSId()
    {
        return $this->s_id;
    }

    /**
     * @param mixed $s_id
     */
    public function setSId($s_id)
    {
        $this->s_id = $s_id;
    }

    /**
     * @return mixed
     */
    public function getEirCode()
    {
        return $this->eir_code;
    }

    /**
     * @param mixed $eir_code
     */
    public function setEirCode($eir_code)
    {
        $this->eir_code = $eir_code;
    }

    /**
     * @return mixed
     */
    public function getSecondLineAddress()
    {
        return $this->second_line_address;
    }

    /**
     * @param mixed $second_line_address
     */
    public function setSecondLineAddress($second_line_address)
    {
        $this->second_line_address = $second_line_address;
    }

    /**
     * @return mixed
     */
    public function getFirstLineAddress()
    {
        return $this->first_line_address;
    }

    /**
     * @param mixed $first_line_address
     */
    public function setFirstLineAddress($first_line_address)
    {
        $this->first_line_address = $first_line_address;
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
     * Specify data which should be serialized to JSON
     * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize(){
        // TODO: Implement jsonSerialize() method.
        return get_object_vars($this);
    }
}