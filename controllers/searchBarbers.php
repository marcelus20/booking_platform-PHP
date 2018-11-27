<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 22/11/18
 * Time: 09:16
 */

include "../models/private/pdo/dsn.php";


$data = json_decode(file_get_contents('php://input'));

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $stmt = $conn->prepare("SELECT * FROM service_provider s JOIN location l 
ON l.s_id = s.s_id WHERE s.company_full_name LIKE :fullName;");

    $stmt->bindValue(":fullName", "%".$data->fullName."%");
    $stmt->execute();

    echo json_encode($stmt->fetchAll());

}catch (PDOException $e){
    echo false;
}