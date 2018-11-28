<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 28/11/18
 * Time: 09:01
 */
session_start();
include "../models/private/pdo/dsn.php";

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("SELECT * FROM booking b JOIN service_provider s ON  b.s_id = s.s_id JOIN location l on l.s_id = s.s_id WHERE b.c_id = :id ;");


    $stmt->bindValue(":id", $_SESSION["id"]);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());

}catch (PDOException $e){
    echo false;
}