<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:12
 */


include_once "../controllers/AdminController.class.php";
include_once "../models/AdminFormModel.class.php";

session_start();


function selectExecution($executionType, AdminController $adminController){
    switch ($executionType) {
        case "getAllLogs":{
            return json_encode($adminController->getAllLogs());
        }
        case "registerAdmin": {
            $data = json_decode(file_get_contents('php://input'), true);
            $adminFormModel = new AdminFormModel($data["email"], strtoupper(md5($data["password"])), strtoupper(md5($data["confirmPassword"])));
            return $adminController->registerAdmin($adminFormModel);
        }case "getPendentServices":{
            return json_encode($adminController->getPendentServices());
        }
    }
}


try{
    $adminController = AdminController::adminController();
    echo selectExecution($_GET["executionType"], $adminController);
}catch(Exception $e){
    echo false;
}
