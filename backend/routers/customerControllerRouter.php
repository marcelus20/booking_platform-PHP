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

session_start();



function selectExecution($executionType, CustomerController $customerController){
    switch ($executionType){
        case "searchBarbers": {
            $data = json_decode(file_get_contents('php://input'), true);
            header('Content-Type: application/json');
            return json_encode($customerController->searchBarbers(new SearchBarberModel($data["fullName"])));
        }
        case "searchBookingSlots":{
            $id = json_decode(file_get_contents('php://input'), true);
            header('Content-Type: application/json');
            return json_encode($customerController->searchBookingSlots($id["s_id"]));
        }
        case  "bookSlot":{
            $data = json_decode(file_get_contents('php://input'), true);
            $bookingSlot = new BookingSlot(
                $data["timestamp"], $data["s_id"], $data["availability"], new Booking(
                    $data["booking"]["booking_status"], $data["booking"]["review"]
                )
            );
            return $customerController->bookSlot($bookingSlot);
        }
        case "getAllBookings" : {
            header('Content-Type: application/json');
            return json_encode($customerController->getAllBookings());
        }
    }
}


try{
    $customerController = CustomerController::customerController();
    echo selectExecution($_GET["executionType"], $customerController);
}catch(Exception $e){
    echo false;
}