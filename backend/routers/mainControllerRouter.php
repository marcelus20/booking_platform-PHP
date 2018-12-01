<?php

include_once "../models/LoginModel.class.php";
include_once "../controllers/MainController.class.php";
session_start();



function selectExecution($executionType, MainController $mainController){
    switch ($executionType){
        case "login": {
            $data = json_decode(file_get_contents('php://input'), true);
            return $mainController->login(new LoginModel($data["email"], md5($data["password"])));
        }
        case "logout": return $mainController->logout();
        case "getUserData": {
            header('Content-Type: application/json');
            return json_encode($mainController->getUserData());
        }
        case "checkLogin": {
            return $mainController->checkLogin();
        }
    }
}


try{
    $mainController = MainController::mainController();
    echo selectExecution($_GET["executionType"], $mainController);


}catch(Exception $e){
    echo false;
}





