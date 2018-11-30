<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 30/11/18
 * Time: 09:16
 */
session_start();
include "../models/private/pdo/dsn.php";

try{

    $conn = new PDO($dsn, $username, $password, $options);
    $stmt = $conn->prepare("SELECT DISTINCT c.c_id, c.first_name, c.last_name  FROM customers c JOIN booking b ON c.c_id = b.c_id WHERE b.s_id = :s_id;");
    $stmt->bindValue(":s_id", $_SESSION["id"]);
    $stmt->execute();

    $result = $stmt->fetchAll();

    $resultToSend = array();
    foreach ($result as $row){
        $stmt2 = $conn->prepare("SELECT * FROM booking WHERE c_id = :c_id AND s_id = :s_id;");
        $stmt2->bindValue(":c_id", $row["c_id"]);
        $stmt2->bindValue(":s_id", $_SESSION["id"]);

        $stmt2->execute();

        $row["listOfBookings"] = $stmt2->fetchAll();
        array_push($resultToSend, $row);
    }

    echo json_encode($resultToSend);

}catch (PDOException $e){
    echo $e->getMessage();
}