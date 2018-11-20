<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 10:58
 */

include "pdo/dsn.php";
include "passwordHasher.php";
include "../private/models/CustomerFormModel.class.php";

$todayDate = date('Y-m-d');
$idOfNewUser = "";

$data = json_decode(file_get_contents('php://input'), true);

$formModel = new FormModel($data["email"],$data["password"], $data["confirmPass"],$data["phone"], $data["firstName"],$data["lastName"]);
try{
    $conn = new PDO($dsn, $username, $password, $options);
    $st = $conn->prepare("INSERT INTO users (user_type, email, password, date_created)
VALUES (:user_type, :user_email, :password, '$todayDate')");
    $st->bindValue(":user_type", 'CUSTOMER', PDO::PARAM_STR);
    $st->bindValue(":user_email", $formModel->getEmail()."", PDO::PARAM_STR);
    $st->bindValue(":password", $formModel->getPassword()."", PDO::PARAM_STR);
//
    $st->execute();

    $idOfNewUser = "";
    $st2 = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $st2->bindValue(":email", $formModel->getEmail());
    $st2->execute();

    foreach ($st2->fetchAll() as $row){
        $idOfNewUser = $row['id'];
    }

    $st3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");
    $st3->bindValue(":id", "$idOfNewUser", PDO::PARAM_STR);
    $st3->bindValue(":phone", "{$formModel->getPhone()}", PDO::PARAM_STR);
    $st3->execute();

    $st4 = $conn-> prepare("INSERT INTO customers (c_id, first_name, last_name)
VALUES (:id, :firstName, :lastName )");
    $st4->bindValue(":id", $idOfNewUser, PDO::PARAM_STR);
    $st4->bindValue(":firstName", $formModel->getFirstName(), PDO::PARAM_STR);
    $st4->bindValue(":lastName", $formModel->getLastName(), PDO::PARAM_STR);
    $st4->execute();

    echo true;

}catch (Exception $e){
    echo false;
}


