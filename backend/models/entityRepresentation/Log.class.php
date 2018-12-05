<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:24
 */

class Log implements JsonSerializable {


    private $logId;
    private $id;
    private $activity_log;

    /**
     * Log constructor.
     * @param $logId
     * @param $id
     * @param $activity_log
     */
    public function __construct($logId, $id, $activity_log){
        $this->logId = $logId;
        $this->id = $id;
        $this->activity_log = $activity_log;
    }

    /**
     * @return mixed
     */
    public function getLogId(){
        return $this->logId;
    }

    /**
     * @return mixed
     */
    public function getId(){
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getActivityLog(){
        return $this->activity_log;
    }






    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}