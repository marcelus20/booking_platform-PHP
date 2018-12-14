<?php

/**
 * Class BookingSlot
 * Entity representation in DB : booking_platform.booking_slots
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */

include_once "Booking.class.php";

class BookingSlot implements JsonSerializable {

    /**
     * @var attributes/ columns
     */
    private $timestamp;
    private $s_id;
    private $availability;
    private $booking; // ONE TO ONE RELATIONSHIP WITH Booking class.

    /**
     * BookingSlot constructor.
     * @param $timestamp
     * @param $s_id
     * @param $availability
     * @param $booking  -- ONE_TO_ONE relationship
     */
    public function __construct($timestamp, $s_id, $availability, Booking $booking = null)
    {
        $this->timestamp = $timestamp;
        $this->s_id = $s_id;
        $this->availability = $availability;
        $this->booking = $booking;
    }

    /**
     * @return mixed
     */
    public function getTimestamp()
    {
        return $this->timestamp;
    }

    /**
     * @param mixed $timestamp
     */
    public function setTimestamp($timestamp)
    {
        $this->timestamp = $timestamp;
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
    public function getAvailability()
    {
        return $this->availability;
    }

    /**
     * @param mixed $availability
     */
    public function setAvailability($availability)
    {
        $this->availability = $availability;
    }

    /**
     * @return mixed
     */
    public function getBooking()
    {
        return $this->booking;
    }

    /**
     * @param mixed $booking
     */
    public function setBooking($booking)
    {
        $this->booking = $booking;
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
        // TODO: Implement jsonSerialize() method.
        return get_object_vars($this);
    }
}