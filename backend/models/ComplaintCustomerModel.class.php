<?php

/**
 * Class ComplaintCustomerModel
 * this class maps the complaint form inputs in the frontend to the attributes of this class
 *
 * Implements JSONserializable for converting it to JSON text to send for the router to send it back to frontEND
 */

class ComplaintCustomerModel implements JsonSerializable {

    /**
     * @var attributes
     */
    private $s_id;
    private $company_full_name;
    private $times_booked;

    /**
     * ComplaintCustomerModel constructor.
     * @param $s_id
     * @param $company_full_name
     * @param $times_booked
     */
    public function __construct($s_id, $company_full_name, $times_booked){
        $this->s_id = $s_id;
        $this->company_full_name = $company_full_name;
        $this->times_booked = $times_booked;
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
    public function getCompanyFullName()
    {
        return $this->company_full_name;
    }

    /**
     * @param mixed $company_full_name
     */
    public function setCompanyFullName($company_full_name)
    {
        $this->company_full_name = $company_full_name;
    }

    /**
     * @return mixed
     */
    public function getTimesBooked()
    {
        return $this->times_booked;
    }

    /**
     * @param mixed $times_booked
     */
    public function setTimesBooked($times_booked)
    {
        $this->times_booked = $times_booked;
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