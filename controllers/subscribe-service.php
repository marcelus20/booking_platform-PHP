<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 20/11/18
 * Time: 13:57
 */

include "../models/private/formsModel/ServiceForm.class.php";
include "../models/private/pdo/dsn.php";
include "passwordHasher.php";

$data = json_decode(file_get_contents('php://input'), true);
$serviceForm = new ServiceForm($data["email"], $data["password"], $data["confirmPassword"],
    $data["phone"], $data["companyName"], $data["firstLineAddress"], $data["secondLineAddress"], $data["city"], $data["eirCode"]);
$today = date("Y-m-d");


try{
    $conn = new PDO($dsn, $username, $password, $options);
    $stmt = $conn->prepare("INSERT INTO users (user_type, email, password, date_created) 
VALUES (:user_type, :email, :password, :date_created)");
    $stmt->bindValue(":user_type", "SERVICE_PROVIDER");
    $stmt->bindValue(":email", $serviceForm->getEmail());
    $stmt->bindValue(":password", passwordHasher($serviceForm->getPassword()));
    $stmt->bindValue("date_created", $today);

    $stmt->execute();

    $stmt2 = $conn->prepare("SELECT id FROM users WHERE email = :email");
    $stmt2->bindValue(":email", $serviceForm->getEmail());
    $stmt2->execute();

    $idOfUser ="";
    foreach ($stmt2->fetchAll() as $row){
        $idOfUser = $row["id"];
    }

    $stmt3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");
    $stmt3->bindValue(":id", $idOfUser);
    $stmt3->bindValue(":phone", $serviceForm->getPhone());
    $stmt3->execute();

    $stmt4 = $conn->prepare("INSERT INTO service_provider VALUES (:id, :companyName, :approvedStatus)");
    $stmt4->bindValue(":id", $idOfUser);
    $stmt4->bindValue(":companyName", $serviceForm->getCompanyName());
    $stmt4->bindValue(":approvedStatus", "PENDENT");
    $stmt4->execute();

    $stmt5 = $conn->prepare("INSERT INTO location VALUES(:id, :eirCode, :secondLineAddress, :firstLineAddress, :city)");
    $stmt5->bindValue(":id", $idOfUser);
    $stmt5->bindValue(":eirCode", $serviceForm->getEirCode());
    $stmt5->bindValue(":secondLineAddress", $serviceForm->getSecondLineAddress());
    $stmt5->bindValue(":firstLineAddress", $serviceForm->getFirstLineAddress());
    $stmt5->bindValue(":city", $serviceForm->getCity());

    $stmt5->execute();


    echo true;
}catch (PDOException $e){
    echo $e->getMessage();
    echo false;
}