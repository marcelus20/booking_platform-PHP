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
include "templates/dashboardHeader.php";

var_dump($_SESSION);
?>






<?php include "templates/footer.php" ?>