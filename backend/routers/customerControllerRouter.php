<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 21:59
 */


include_once "../models/SearchBarberModel.class.php";
include_once "../controllers/CustomerController.class.php";

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
    }
}


try{
    $customerController = CustomerController::customerController();
    echo selectExecution($_GET["executionType"], $customerController);
}catch(Exception $e){
    echo false;
}
