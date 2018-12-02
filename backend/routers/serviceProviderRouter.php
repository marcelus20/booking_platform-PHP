<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 02/12/18
 * Time: 18:48
 */

include_once "../models/SessionModel.class.php";
include_once "../controllers/ServiceProviderController.class.php";
include_once "../models/entityRepresentation/BookingSlot.class.php";


session_start();


function selectExecution($executionType, ServiceProviderController $serviceProviderController){
    switch ($executionType){
        case "getCustomersList": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            header('Content-Type: application/json');
            return json_encode($serviceProviderController->getCustomerList($s_id));
        }
        case "cancelBooking": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            $data = json_decode(file_get_contents('php://input'), true);
//            var_dump($data);
            return $serviceProviderController->cancelBooking(
                new BookingSlot($data["timestamp"], $s_id, false, null), $data["c_id"]);
        }
    }
}


try{
    $serviceProviderController = ServiceProviderController::customerController();
    echo selectExecution($_GET["executionType"], $serviceProviderController);
}catch(Exception $e){
    echo false;
}
