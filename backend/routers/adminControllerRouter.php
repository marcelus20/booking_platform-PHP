<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:12
 */


include_once "../controllers/AdminController.class.php";

session_start();


function selectExecution($executionType, AdminController $adminController){
    switch ($executionType) {
        case "getAllLogs":{
            return json_encode($adminController->getAllLogs());
        }
    }
}


try{
    $adminController = AdminController::adminController();
    echo selectExecution($_GET["executionType"], $adminController);
}catch(Exception $e){
    echo false;
}
