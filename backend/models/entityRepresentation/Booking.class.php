<?php

/**
 * Class Booking
 * Entity representation in DB : booking_platform.booking
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */
class Booking implements JsonSerializable{

    /**
     * @var Columns / attributes
     */
    private $booking_status;
    private $review;

    /**
     * Booking constructor.
     * @param $booking_status
     * @param $review
     */
    public function __construct($booking_status, $review)
    {
        $this->booking_status = $booking_status;
        $this->review = $review;
    }

    /**
     * @return mixed
     */
    public function getBookingStatus()
    {
        return $this->booking_status;
    }

    /**
     * @param mixed $booking_status
     */
    public function setBookingStatus($booking_status)
    {
        $this->booking_status = $booking_status;
    }

    /**
     * @return mixed
     */
    public function getReview()
    {
        return $this->review;
    }

    /**
     * @param mixed $review
     */
    public function setReview($review)
    {
        $this->review = $review;
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