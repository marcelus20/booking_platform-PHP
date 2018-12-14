<?php
/**
 * Class ServiceProvider
 * Entity representation in DB : booking_platform.service_provider
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */

include_once "Location.class.php";

class ServiceProvider implements JsonSerializable {

    /**
     * @var Attributes/ Entity Columns
     */
    private $s_id;
    private $company_full_name;
    private $approved_status;
    private $location; //ONE_TO_ONE relationship
    private $bookingSlots;// ONE_TO_MANY relationship (array of bookingslots)

    /**
     * ServiceProvider constructor.
     * @param $s_id
     * @param $company_full_name
     * @param $approved_status
     * @param $location //ONE_TO_ONE relationship
     * @param $bookingSlots // ONE_TO_MANY relationship (array of bookingslots)
     */
    public function __construct($s_id, $company_full_name, $approved_status, Location $location, array $bookingSlots = [])
    {
        $this->s_id = $s_id;
        $this->company_full_name = $company_full_name;
        $this->approved_status = $approved_status;
        $this->location = $location;
        $this->bookingSlots = $bookingSlots;
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
    public function getApprovedStatus()
    {
        return $this->approved_status;
    }

    /**
     * @param mixed $approved_status
     */
    public function setApprovedStatus($approved_status)
    {
        $this->approved_status = $approved_status;
    }

    /**
     * @return mixed
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * @param mixed $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
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
    public function jsonSerialize(){
        return get_object_vars($this);
    }
}