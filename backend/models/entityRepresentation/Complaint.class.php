<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 12/12/18
 * Time: 05:28
 */

class Complaint implements JsonSerializable {

    private $complaint_ID;
    private $s_id;
    private $c_id;
    private $complaint_status;
    private $complaint;

    /**
     * Complaints constructor.
     * @param $complaint_ID
     * @param $s_id
     * @param $c_id
     * @param $complaint_status
     * @param $complaint
     */
    public function __construct($complaint_ID, $s_id, $c_id, $complaint_status, $complaint){
        $this->complaint_ID = $complaint_ID;
        $this->s_id = $s_id;
        $this->c_id = $c_id;
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