<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 09:27
 */
session_start();

include("passwordHasher.php");
include("../models/private/pdo/dsn.php");
include "../models/private/formsModel/LoginModel.php";
include "../models/SessionModel.class.php";


$data = json_decode(file_get_contents('php://input'), true);

//var_dump($data);



$loginModel = new LoginModel($data["email"], passwordHasher($data["password"]));


try{
    $conn = new PDO($dsn, $username, $password, $options);

    $st = $conn->prepare("SELECT id, user_type FROM users WHERE email = :email AND password = :password");

    $st->bindValue(":email", $loginModel->getEmail(), PDO::PARAM_STR);
    $st->bindValue(":password", $loginModel->getPassword(), PDO::PARAM_STR);

    $st->execute();

    $sessionModel = new SessionModel();
    if($st->rowCount() > 0){
        foreach ($st->fetchAll() as $row) {

            $sessionModel->setUserId($row["id"]);
            $sessionModel->setUsertype($row["user_type"]);
        }
        $_SESSION["id"] = $sessionModel->getUserId();
        $_SESSION["usert_type"] = $sessionModel->getUsertype();
        header("location: "."http://localhost/booking_platform/views/public/dashboard.php");
        exit();
    }else{
        echo "credentials not correct, please, try again!";
    }

    echo true;


}catch (PDOException $e){
    echo $e->getMessage();
    echo false;
}

