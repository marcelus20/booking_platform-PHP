<?php
session_start();
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 17:05
 */

if($_SESSION["id"] == null){
    header("location: http://localhost/booking_platform/");
}

if($_SESSION["user_type"] == "ADMIN"){
    header("Location: /booking_platform/views/public/dashboard-a.php");
}elseif ($_SESSION["user_type"] == "SERVICE_PROVIDER"){
    header("Location: /booking_platform/views/public/dashboard-s.php");
}
//include "templates/header.php";
include "templates/dashboardHeader.php";?>

    <link rel="stylesheet" href="css/style.css">

<div id="alertUpdate"></div>
<div class="resultSet">
    <div id="table">

    </div>
</div>









<?php include "templates/footer.php" ?>