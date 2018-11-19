
<?php
$server = "localhost";
$username = "root";
$password = "";
$dbName = "booking_platform";
$dsn = "mysql:host=$server;dbname=$dbName";

$options    = array(
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
);

?>