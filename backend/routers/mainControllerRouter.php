<?php

include_once "../models/LoginModel.class.php";
include_once "../controllers/MainController.class.php";
session_start();


/**
 * This router will handle ALL HTTP requests performed by the frontend JS and asks the backend
 * MainController to look for an information in DB.
 * @param $executionType -> URL string retrieved from POST/GET request
 * @param MainController $mainController -> controller that will manage the router
 * @return bool|false|mixed|string
 */
function selectExecution($executionType, MainController $mainController){
    switch ($executionType){
        /**
         * If URL query string is "login", trigger the login method form MainController class
         */
        case "login": {
            $data = json_decode(file_get_contents('php://input'), true); // getting data sent by POST from JS
            return $mainController->login(new LoginModel($data["email"], strtoupper(md5($data["password"]))));// trigger function
        }
        /**
         * if URL query string is "logout", trigger the logout() method from mainController
         * (destroy the session)
         */
        case "logout": return $mainController->logout();
        /**
         * if URL query string is "getUserData" trigger the getUserData() method from MainController and return
         * a JSON back to JS
         */
        case "getUserData": {
            header('Content-Type: application/json');
            return json_encode($mainController->getUserData());// sends the SessionModel class serialised into JSON
        }
        /**
         * If URL query string is "checkLogin", trigger the method checkLogin from MainController class
         */
        case "checkLogin": {
            return $mainController->checkLogin();
        }
    }
}

/**
 * it is going to initialise the singleton mainController and print its return back to AJAX as response of the request
 * the return of the selectExecution(a, b) function
 */
try{
    $mainController = MainController::mainController();
    echo selectExecution($_GET["executionType"], $mainController);


}catch(Exception $e){
    echo false;
}





