<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 03/12/18
 * Time: 12:18
 */

include_once "../controllers/FormController.class.php";
include_once "../models/CustomerFormModel.class.php";

function selectExecution($executionType, FormController $mainController){
    switch ($executionType){
        case "registerCustomer": {
            $data = json_decode(file_get_contents('php://input'), true);
            $customerFormModel = new CustomerFormModel($data["email"], md5($data["password"]), md5($data["confirmPassword"]),
                $data["phone"], $data["first_name"], $data["last_name"]);
            return $mainController->registerCustomer($customerFormModel, $customerFormModel);
        }
    }
}


try{
    $formController = FormController::formController();
    echo selectExecution($_GET["executionType"], $formController);


}catch(Exception $e){
    echo false;
}