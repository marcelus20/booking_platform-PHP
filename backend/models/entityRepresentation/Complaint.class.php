<?php

/**
 * Class Complaint
 * Entity representation in DB : booking_platform.complaints
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */

class Complaint implements JsonSerializable {

    /**
     * @var attributes/ columns of the entity
     */
    private $complaint_ID;
    private $s_id;
    private $c_id;
    private $serviceName;
    private $customerName;
    private $complaint_status;
    private $complaint;

    /**
     * Complaint constructor.
     * @param $complaint_ID
     * @param $s_id
     * @param $c_id
     * @param $serviceName
     * @param $customerName
     * @param $complaint_status
     * @param $complaint
     */
    public function __construct($complaint_ID, $s_id, $c_id, $serviceName, $customerName, $complaint_status, $complaint)
    {
        $this->complaint_ID = $complaint_ID;
        $this->s_id = $s_id;
        $this->c_id = $c_id;
        $this->serviceName = $serviceName;
        $this->customerName = $customerName;
        $this->complaint_status = $complaint_status;
        $this->complaint = $complaint;
    }

    /**
     * @return mixed
     */
    public function getComplaintID()
    {
        return $this->complaint_ID;
    }

    /**
     * @param mixed $complaint_ID
     */
    public function setComplaintID($complaint_ID)
    {
        $this->complaint_ID = $complaint_ID;
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
    public function getServiceName()
    {
        return $this->serviceName;
    }

    /**
     * @param mixed $serviceName
     */
    public function setServiceName($serviceName)
    {
        $this->serviceName = $serviceName;
    }

    /**
     * @return mixed
     */
    public function getCustomerName()
    {
        return $this->customerName;
    }

    /**
     * @param mixed $customerName
     */
    public function setCustomerName($customerName)
    {
        $this->customerName = $customerName;
    }

    /**
     * @return mixed
     */
    public function getComplaintStatus()
    {
        return $this->complaint_status;
    }

    /**
     * @param mixed $complaint_status
     */
    public function setComplaintStatus($complaint_status)
    {
        $this->complaint_status = $complaint_status;
    }

    /**
     * @return mixed
     */
    public function getComplaint()
    {
        return $this->complaint;
    }

    /**
     * @param mixed $complaint
     */
    public function setComplaint($complaint)
    {
        $this->complaint = $complaint;
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