<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 02/12/18
 * Time: 18:48
 */

include_once "../models/SessionModel.class.php";
include_once "../controllers/ServiceProviderController.class.php";


session_start();


function selectExecution($executionType, ServiceProviderController $serviceProviderController){
    switch ($executionType){
        case "getCustomersList": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            header('Content-Type: application/json');
            return json_encode($serviceProviderController->getCustomerList($s_id));
        }
    }
}


try{
    $serviceProviderController = ServiceProviderController::customerController();
    echo selectExecution($_GET["executionType"], $serviceProviderController);
}catch(Exception $e){
    echo false;
}
