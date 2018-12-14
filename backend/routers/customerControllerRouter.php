<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 21:59
 */

include_once "../models/SearchBarberModel.class.php";
include_once "../controllers/CustomerController.class.php";
include_once "../models/entityRepresentation/BookingSlot.class.php";
include_once "../models/entityRepresentation/Booking.class.php";
include_once "../models/SessionModel.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";

session_start();

/**
 * This router will handle ALL HTTP requests performed by the frontend JS customer controller and asks the backend
 * customerController to look for an information in DB.
 * @param $executionType -> will come in the URL in the query string URL part
 * @param CustomerController $customerController -> the controller that will handle the router
 * @return false|mixed|string|true
 */

function selectExecution($executionType, CustomerController $customerController){
    switch ($executionType){
        /**
         * If URL query string is "searchBarbers" it is going return the JSON format of the searchBarbers return customerController
         * method.
         */
        case "searchBarbers": {
            $data = json_decode(file_get_contents('php://input'), true);// JSON sent from JS
            header('Content-Type: application/json');
            return json_encode($customerController->searchBarbers(new SearchBarberModel($data["fullName"])));//JSON sent to JS
        }
        /**
         * If URL query string is "searchBookingSlots", the searchBookingSlots method from customerController will trigger
         * and its return will be sent back in JSON format to AJAX handler
         */
        case "searchBookingSlots":{
            $id = json_decode(file_get_contents('php://input'), true);// JSON sent from JS
            header('Content-Type: application/json');
            return json_encode($customerController->searchBookingSlots($id["s_id"]));//JSON sent to JS
        }
        /**
         * If URL query string is "bookSlot", the bookSlot method from customerController class will trigger
         * and respond it back true or false whether slot was booked or not.
         */
        case  "bookSlot":{
            $data = json_decode(file_get_contents('php://input'), true);//JSON data sent from JS
            $bookingSlot = new BookingSlot(//mapping data to BookingSlot php Class
                $data["timestamp"], $data["s_id"], $data["availability"], new Booking(
                    $data["booking"]["booking_status"], $data["booking"]["review"]
                )
            );
            return $customerController->bookSlot($bookingSlot);// returning/calling bookSlot from customerController
        }
        /**
         * If the URL query string is "getAllBookings", it will trigger the function getAllBookings from
         * customerControllerClass and its return will be converted to JSON to send data as response to AJAX js handler
         */
        case "getAllBookings" : {
            header('Content-Type: application/json');
            return json_encode($customerController->getAllBookings());//sending JSON to js handler
        }
        /**
         * If the URL query string is "cancelBokking", the method cancelBooking($booking) from customerController class
         * will trigger and the response will be true for successful deletion of booking or false for not successful.
         */
        case "cancelBooking" : {
            $c_id = unserialize($_SESSION["userSession"])->getUserId();// retriving ID from SessionModel->getUserId()
            $data = json_decode(file_get_contents('php://input'), true);// data set from JS
            return $customerController->cancelBooking( // cancelling slot passed by parameter
                new BookingSlot($data["timestamp"], $data["s_id"], false, null), $c_id
            );
        }
        /**
         * If the URL query string is "updateReview", the method updateReview from customerController will trigger
         * and its return will be true or false for successful update.
         */
        case "updateReview" : {
            $c_id = unserialize($_SESSION["userSession"])->getUserId();// geting id of logged in user
            $data = json_decode(file_get_contents('php://input'), true); //data set from JS
            return $customerController->updateReview(//mapping data to BookingSlot instance.
                new BookingSlot($data["timestamp"], $data["s_id"], false,
                    new Booking($data["booking"]["booking_status"],$data["booking"]["review"])
                ), $c_id
            );
        }
        /**
         * If URL query string is "selectBarbersBooked", the getServicesBooked method from customerController class
         * will trigger and return a JSON format of the list of services.
         */
        case "selectBarbersBooked" : {
            $c_id = unserialize($_SESSION["userSession"])->getUserId(); // getting id of the logged in user
            return json_encode($customerController->getServicesBooked($c_id)); // JSON sent back to JS
        }
        /**
         * If URL query string is "insertComplaint", the addComplaint() method from customerController will trigger
         */
        case "insertComplaint" : {
            $data = json_decode(file_get_contents('php://input'), true);// data sent from JS
            $c_id = unserialize($_SESSION["userSession"])->getUserId();// getting id of the logged in user
            $complaint = new Complaint(// mapping data to complaint
                $data["complaint_ID"], $data["s_id"], $c_id, $data["serviceName"], "",
                $data["complaintStatus"] ,$data["complaint"]
            );
            return $customerController->addComplaint($complaint);// trigger the method and send response back to JS
        }
    }
}


/**
 * It is going to initialise singleton CustomerController::customerControler()
 * and print the return of the selectExecution(a,b) as a HTTP response for AJAX frontEnd handler
 */
try{
    $customerController = CustomerController::customerController();
    echo selectExecution($_GET["executionType"], $customerController);
}catch(Exception $e){
    echo false;
}
