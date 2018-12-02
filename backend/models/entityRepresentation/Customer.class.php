<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 02/12/18
 * Time: 19:10
 */

include_once "BookingSlot.class.php";

class Customer implements JsonSerializable {


    private $c_id;
    private $first_name;
    private $last_name;
    private $bookingSlots;

    /**
     * Customer constructor.
     * @param $c_id
     * @param $first_name
     * @param $last_name
     * @param $bookingSlot
     */
    public function __construct($c_id, $first_name, $last_name, array $bookingSlot)
    {
        $this->c_id = $c_id;
        $this->first_name = $first_name;
        $this->last_name = $last_name;
        $this->bookingSlots = $bookingSlot;
    }

    /**
     * @return mixed
     */
    public function getCId()
    {
        return $this->c_id;
    }

    /**
     * @param mixed $c_id
     */
    public function setCId($c_id)
    {
        $this->c_id = $c_id;
    }

    /**
     * @return mixed
     */
    public function getFirstName()
    {
        return $this->first_name;
    }

    /**
     * @param mixed $first_name
     */
    public function setFirstName($first_name)
    {
        $this->first_name = $first_name;
    }

    /**
     * @return mixed
     */
    public function getLastName()
    {
        return $this->last_name;
    }

    /**
     * @param mixed $last_name
     */
    public function setLastName($last_name)
    {
        $this->last_name = $last_name;
    }

    /**
     * @return mixed
     */
    public function getBookingSlots()
    {
        return $this->bookingSlots;
    }

    /**
     * @param mixed $bookingSlots
     */
    public function setBookingSlots($bookingSlots)
    {
        $this->bookingSlots = $bookingSlots;
    }


    /**
     * Specify data which should be serialized to JSON
     * @link https://php.net/manual/en/jsonserializable.jsonserialize.php
     * @return mixed data which can be serialized by <b>json_encode</b>,
     * which is a value of any type other than a resource.
     * @since 5.4.0
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}