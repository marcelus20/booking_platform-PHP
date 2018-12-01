<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 21:40
 */

class ServiceProvider implements JsonSerializable {

    private $s_id;
    private $company_full_name;
    private $approved_status;

    /**
     * ServiceProvider constructor.
     * @param $s_id
     * @param $company_full_name
     * @param $approved_status
     */
    public function __construct($s_id, $company_full_name, $approved_status){
        $this->s_id = $s_id;
        $this->company_full_name = $company_full_name;
        $this->approved_status = $approved_status;
    }

    /**
     * @return mixed
     */
    public function getSId(){
        return $this->s_id;
    }

    /**
     * @return mixed
     */
    public function getCompanyFullName(){
        return $this->company_full_name;
    }

    /**
     * @return mixed
     */
    public function getApprovedStatus(){
        return $this->approved_status;
    }

    /**
     * @param mixed $s_id
     */
    public function setSId($s_id){
        $this->s_id = $s_id;
    }

    /**
     * @param mixed $company_full_name
     */
    public function setCompanyFullName($company_full_name){
        $this->company_full_name = $company_full_name;
    }

    /**
     * @param mixed $approved_status
     */
    public function setApprovedStatus($approved_status){
        $this->approved_status = $approved_status;
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