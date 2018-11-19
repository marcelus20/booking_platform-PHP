<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 09:27
 */

include ("passwordHasher.php");
include("pdo/dsn.php");

$email = $_POST["email-input"];
$pass = passwordHasher($_POST["password-input"]);

try{
    $conn = new PDO($dsn, $username, $password, $options);

    $conn->exec("SELECT * FROM users WHERE email = '$email' AND password = '$pass'");


}catch (PDOException $e){
    echo $e->getMessage();
}

