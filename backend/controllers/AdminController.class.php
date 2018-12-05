<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:15
 */

include_once "AbstractController.class.php";
include_once "../models/entityRepresentation/Log.class.php";

class AdminController extends AbstractController {

    private static $_adminController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct();
    }

    public static function adminController(){
        if(!isset(self::$_adminController)){
            self::$_adminController = new AdminController();
        }
        return self::$_adminController;
    }

    public function getAllLogs () {
        return $this->connectPDO(function ($conn){
            $stmt = $conn->prepare("SELECT * FROM logs l JOIN users u ON l.id = u.id ORDER BY log_id DESC LIMIT 50;");
            $stmt->execute();
            $logs = [];

            foreach ($stmt->fetchAll() as $row){
                array_push($logs, new Log($row["log_id"], $row["email"], $row["activity_log"])) ;

            }
            return $logs;
        });
    }
}