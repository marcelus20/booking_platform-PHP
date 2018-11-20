<?php
/**
 * Created by Felipe Mantovani 2017192
 * Date: 19/11/18
 * Time: 09:25
 */

?>

<?php include "public/templates/header.php" ?>

<link rel="stylesheet" href="css/style.css">

    <h1 class="title">Welcome to the Barbers/Hairdresser Booking Platform System</h1>

<div class="formclass" id="loginform">
    <div class="card">
        <h1 class="card-header">Log in</h1>
        <form>
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" id="email" name="email-input" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password-input" id="password" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>


<script type="text/javascript" src="js/login.js"></script>

<?php include("public/templates/footer.php") ?>