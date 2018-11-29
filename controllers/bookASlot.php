<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 27/11/18
 * Time: 20:32
 */

session_start();

include "../models/private/pdo/dsn.php";


$data = json_decode(file_get_contents('php://input'), true);


try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("UPDATE booking_slots SET availability = FALSE WHERE timestamp = :tmstp AND s_id = :s_id");


    $stmt->bindValue(":tmstp", $data["timestamp"]);
    $stmt->bindValue(":s_id", $data["s_id"]);
    $stmt->execute();

    $stmt2 = $conn->prepare("INSERT INTO booking VALUES (:tmsp, :s_id, :c_id, :status, :review)");
    $stmt2->bindValue(":tmsp", $data["timestamp"]);
    $stmt2->bindValue(":s_id", $data["s_id"]);
    $stmt2->bindValue(":c_id", $_SESSION["id"]);
    $stmt2->bindValue(":status", $data["booking_status"]);
    $stmt2->bindValue(":review", $data["review"]);

    $stmt2->execute();

    $stmt3 = $conn->prepare("SELECT * FROM service_provider WHERE s_id = :s_id");
    $stmt3->bindValue(":s_id", $data["s_id"]);

    $stmt3->execute();

    echo json_encode($stmt3->fetchAll());

}catch (PDOException $e){
    echo false;
}