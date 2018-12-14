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

/**
 * This router will handle ALL HTTP requests performed by the service provider controller frontend JS and asks the backend
 * ServiceProviderController to look for an information in DB.
 * @param $executionType -> the URL query string retrieved from POST/GET AJAX HTTP request.
 * @param ServiceProviderController $serviceProviderController -> the controller that will handle the request
 * @return false|mixed|string
 */
function selectExecution($executionType, ServiceProviderController $serviceProviderController){
    switch ($executionType){
        /**
         * If the URL query string is "getCustomerList" it will trigger the getCustomerList() method from controller
         */
        case "getCustomersList": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();// id retrieved from SessionModel class instance
            header('Content-Type: application/json');
            return json_encode($serviceProviderController->getCustomerList($s_id));// return JSON format of CustomerLIst
        }
        /**
         * If URL query string is "cancelBooking" it will trigger the method cancelBooking(booking) from controller
         */
        case "cancelBooking": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId(); // getting id of service logged in
            $data = json_decode(file_get_contents('php://input'), true);//retrieving POST data
//            var_dump($data);
            return $serviceProviderController->cancelBooking(//triggering method
                new BookingSlot($data["timestamp"], $s_id, false, null), $data["c_id"]);
        }
        /**
         * if URL query string is updateBooking, it will trigger the method updateBooking from controller
         */
        case "updateBooking": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();// getting id of service
            $data = json_decode(file_get_contents('php://input'), true); // retrieving data from JS
            //triggering controller method
            return $serviceProviderController->updateBooking($data["timestamp"], $s_id, $data["c_id"], $data["booking_status"]);
        }
        /**
         * if URL query string is "lookForSlotsWithDate", it will trigger the function searchSlotsWithDate() from controller
         */
        case "lookForSlotsWithDate": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();//getting logged in service ID
            $date = json_decode(file_get_contents('php://input'), true);// retireving POST data from JS
            return $serviceProviderController->searchSlotsWithDate($date["date"], $s_id); // trigger method
        }
        /**
         * If URL query string is "sendSlots", it will trigger the function insertSlots from controller class
         */
        case "sendSlots": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();// getting id of the session user
            $dates = json_decode(file_get_contents('php://input'), true);// retrievind POST date from JS
            return $serviceProviderController->insertSlots($dates, $s_id);//triggering the function
        }
        /**
         * if URL query string is "checkMyStatus", the checkIfIsPresent() method from controller class will trigger
         */
        case "checkMyStatus": {
            $s_id = unserialize($_SESSION["userSession"])->getUserId();//getting id of the SessionModel
            return $serviceProviderController->checkIfIsPendent($s_id);//triggering function
        }
    }
}


/**
 * It will initialise the serviceProviderController singleton and print the return of the
 * selectExecution(a,b) function as a response to the frontEnd AJAX
 */
try{
    $serviceProviderController = ServiceProviderController::serviceProviderController();
    echo selectExecution($_GET["executionType"], $serviceProviderController);
}catch(Exception $e){
    echo false;
}
