<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 09:27
 */

include ("passwordHasher.php");
include("pdo/dsn.php");
include "../private/models/LoginModel.php";


$data = json_decode(file_get_contents('php://input'), true);

//var_dump($data);



$loginModel = new LoginModel($data["email"], passwordHasher($data["password"]));


try{
    $conn = new PDO($dsn, $username, $password, $options);

    $st = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");

    $st->bindValue(":email", $loginModel->getEmail(), PDO::PARAM_STR);
    $st->bindValue(":password", $loginModel->getPassword(), PDO::PARAM_STR);

    $st->execute();



    echo true;


}catch (PDOException $e){
    echo $e->getMessage();
    echo false;
}

