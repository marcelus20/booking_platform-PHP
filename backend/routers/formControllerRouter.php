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

/**
 * This router will handle ALL HTTP requests performed by the frontend JS and asks the backend
 * formController to look for an information in DB.
 * @param $executionType -> URL query string retrieved from POST/GET request
 * @param FormController $mainController -> the controller that will manage the router
 * @return mixed
 */
function selectExecution($executionType, FormController $mainController){
    switch ($executionType){
        /**
         * if URL query string is "registerCustomer", the registerCustomer() method from formRepository will trigger
         * and save the data sent from AJAX to DB.
         */
        case "registerCustomer": {
            $data = json_decode(file_get_contents('php://input'), true); // data sent from JS
            /**
             * mapping data to customerFormModel instance
             */
            $customerFormModel = new CustomerFormModel($data["email"], strtoupper(md5($data["password"])), strtoupper(md5($data["confirmPassword"])),
                $data["phone"], $data["first_name"], $data["last_name"]);
            return $mainController->registerCustomer($customerFormModel);// triggering the function
        }
        /**
         * If the URL query string is "registerServiceProvider", the method registerServiceProvider from formController
         * will trigger and save the service sent by AJAX to DB
         */
        case "registerServiceProvider":{
            $data = json_decode(file_get_contents('php://input'), true);// retrieving data set from JS
            /**
             * Mapping data to ServiceFormModel instance
             */
            $serviceFormModel = new ServiceForm($data["email"], strtoupper(md5($data["password"])),
                strtoupper(md5($data["confirm_password"])),$data["phone"], $data["company_full_name"],
                $data["first_line_address"], $data["second_line_address"], $data["city"], $data["eir_code"]);

            return $mainController->registerServiceProvider($serviceFormModel);// trigger method
        }
    }
}

/**
 * it will initialise the formController singleton and print the return selectExecution(a,b) as a response to
 * AJAX
 */
try{
    $formController = FormController::formController();
    echo selectExecution($_GET["executionType"], $formController);


}catch(Exception $e){
    echo false;
}