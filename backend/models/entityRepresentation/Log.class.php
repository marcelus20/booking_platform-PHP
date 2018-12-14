<?php

/**
 * Class Log
 * Entity representation in DB : booking_platform.logs
 *
 * The reason it implements JsonSerializable interface is because it needs to be converted into JSON
 * for the routers to send it back to AJAX frontend.
 */

class Log implements JsonSerializable {

    /**
     * @var attributes/ Entity Columns
     */

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