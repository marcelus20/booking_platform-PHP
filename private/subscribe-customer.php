<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 10:58
 */

include "pdo/dsn.php";
include "passwordHasher.php";

$newEmail = $_POST['email-input'];
$newPassword = passwordHasher($_POST['password-input']);
$newPhone = $_POST['phone-input'];
$firstName = $_POST['first-name-input'];
$lastName = $_POST['last-name-input'];
$todayDate = date('Y-m-d');

$idOfNewUser = "";

//echo "$newPassword $todayDate";

try{
    $conn = new PDO($dsn, $username, $password, $options);
    $conn->exec("INSERT INTO users (user_type, email, password, date_created)
 VALUES ('CUSTOMER', '$newEmail', '$newPassword', '$todayDate')");

    $idOfNewUser = $conn->exec("SELECT id FROM users WHERE email = '$newEmail'"
        , array(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, false));


    if($idOfNewUser){
        $conn-> exec("INSERT INTO phone_list (id, phone) VALUES ('$idOfNewUser','$newPhone')");

        $conn-> exec("INSERT INTO customers (c_id, first_name, last_name");
    }

}catch (Exception $e){
    echo $e->getMessage();
}
