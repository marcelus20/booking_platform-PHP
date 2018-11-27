<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 27/11/18
 * Time: 19:32
 */

include "../models/private/pdo/dsn.php";


$data = json_decode(file_get_contents('php://input'), true);

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("SELECT * FROM booking_slots b WHERE b.s_id = :id AND b.availability = TRUE");


    $stmt->bindValue(":id", $data["s_id"]);
    $stmt->execute();

    echo json_encode($stmt->fetchAll());

}catch (PDOException $e){
    echo false;
}