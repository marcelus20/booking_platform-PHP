<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 03/12/18
 * Time: 12:18
 */

include_once "../models/ServiceForm.class.php";
include_once "../controllers/FormController.class.php";
include_once "../models/CustomerFormModel.class.php";

function selectExecution($executionType, FormController $mainController){
    switch ($executionType){
        case "registerCustomer": {
            $data = json_decode(file_get_contents('php://input'), true);
            $customerFormModel = new CustomerFormModel($data["email"], strtoupper(md5($data["password"])), strtoupper(md5($data["confirmPassword"])),
                $data["phone"], $data["first_name"], $data["last_name"]);
            return $mainController->registerCustomer($customerFormModel);
        }
        case "registerServiceProvider":{
            $data = json_decode(file_get_contents('php://input'), true);
            $serviceFormModel = new ServiceForm($data["email"], strtoupper(md5($data["password"])),
                strtoupper(md5($data["confirm_password"])),$data["phone"], $data["company_full_name"],
                $data["first_line_address"], $data["second_line_address"], $data["city"], $data["eir_code"]);

            return $mainController->registerServiceProvider($serviceFormModel);
        }
    }
}


try{
    $formController = FormController::formController();
    echo selectExecution($_GET["executionType"], $formController);


}catch(Exception $e){
    echo false;
}