<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 30/11/18
 * Time: 23:23
 */
session_start();
include "../models/private/pdo/dsn.php";

$data = json_decode(file_get_contents('php://input'), true);
var_dump($data);

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("UPDATE booking SET booking_status = :status WHERE time_stamp = :time_stamp AND s_id = :s_id AND c_id = :c_id ;");
    $stmt->bindValue(":status", $data["booking_status"]);
    $stmt->bindValue(":time_stamp", $data["time_stamp"]);
    $stmt->bindValue(":s_id", $data["s_id"]);
    $stmt->bindValue(":c_id", $data["c_id"]);


    $stmt->execute();

    echo "SUCCESS";






}catch (PDOException $e){
    echo false;
}