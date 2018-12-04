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
        case "updateBooking": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            $data = json_decode(file_get_contents('php://input'), true);
//            var_dump($data);
            return $serviceProviderController->updateBooking($data["timestamp"], $s_id, $data["c_id"], $data["booking_status"]);
        }
        case "lookForSlotsWithDate": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            $date = json_decode(file_get_contents('php://input'), true);
            return $serviceProviderController->searchSlotsWithDate($date["date"], $s_id);
        }
        case "sendSlots": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();
            $dates = json_decode(file_get_contents('php://input'), true);
            return $serviceProviderController->insertSlots($dates, $s_id);
        }
    }
}


try{
    $serviceProviderController = ServiceProviderController::customerController();
    echo selectExecution($_GET["executionType"], $serviceProviderController);
}catch(Exception $e){
    echo false;
}
