<?php

include_once "../models/LoginModel.class.php";
include_once "../controllers/MainController.class.php";
session_start();

try{
    $mainController = new MainController();
    $executionType = $_GET["executionType"];
    switch ($executionType){
        case "login": {
            $data = json_decode(file_get_contents('php://input'), true);
            echo $mainController->login(new LoginModel($data["email"], md5($data["password"])));
        }
        case "logout": echo $mainController->logout();
    }

}catch(Exception $e){
    echo false;
}





