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
//include "templates/header.php";
include "templates/dashboardHeader.php";?>

    <link rel="stylesheet" href="css/style.css">

<div></div>
<div class="resultSet">
    <div id="table">

    </div>
</div>









<?php include "templates/footer.php" ?>