<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 29/11/18
 * Time: 22:32
 */
session_start();
if($_SESSION["user_type"] == "CUSTOMER"){
    header("Location: /booking_platform/views/public/dashboard-c.php");
}elseif ($_SESSION["user_type"] == "ADMIN"){
    header("Location: /booking_platform/views/public/dashboard-a.php");
}