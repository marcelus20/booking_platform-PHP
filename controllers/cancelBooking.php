<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 28/11/18
 * Time: 10:30
 */

session_start();
include "../models/private/pdo/dsn.php";

$data = json_decode(file_get_contents('php://input'), true);

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("DELETE FROM booking WHERE s_id = :s_id AND c_id = :c_id AND time_stamp = :time_stamp ;");
    $stmt->bindValue(":s_id", $data["s_id"]);
    $stmt->bindValue(":c_id", $data["c_id"]);
    $stmt->bindValue(":time_stamp", $data["time_stamp"]);
    $stmt->execute();


    $stmt2 = $conn->prepare("UPDATE booking_slots SET availability = TRUE WHERE s_id = :s_id AND timestamp = :time_stamp ;");
    $stmt2->bindValue(":s_id", $data["s_id"]);
    $stmt2->bindValue(":time_stamp", $data["time_stamp"]);


    $stmt2->execute();
    echo "SUCCESS";





}catch (PDOException $e){
    echo false;
}