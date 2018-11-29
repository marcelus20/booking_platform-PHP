<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 29/11/18
 * Time: 22:26
 */
session_start();

if($_SESSION["user_type"] == "ADMIN"){
    header("Location: /booking_platform/views/public/dashboard-a.php");
}elseif ($_SESSION["user_type"] == "SERVICE_PROVIDER"){
    header("Location: /booking_platform/views/public/dashboard-s.php");
}elseif ($_SESSION["user_type"] == "CUSTOMER"){
    header("Location: /booking_platform/views/public/dashboard-c.php");
}