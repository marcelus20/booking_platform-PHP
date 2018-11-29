<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 29/11/18
 * Time: 22:31
 */
session_start();
var_dump($_SESSION);
if($_SESSION["user_type"] == "CUSTOMER"){
    header("Location: /booking_platform/views/public/dashboard-c.php");
}elseif ($_SESSION["user_type"] == "SERVICE_PROVIDER"){
    header("Location: /booking_platform/views/public/dashboard-s.php");
}