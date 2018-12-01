<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 17:18
 */

include "../templates/header.php";
?>


<div class="formclass">
    <div class="card">

        <h1 class="card-header">Service Provider Signup Form</h1>


        <form id = "service-form">
            <div class="form-group">
                <label for="email">Email address</label>
                <input type="email" class="form-control" name="email-input" id="email" aria-describedby="email" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" name="password-input" id="password" placeholder="Password">
            </div>

            <div class="form-group">
                <label for="confirm-password">Confirm Password</label>
                <input type="text" class="form-control" name="confirm-password-input" id="confirm-password"
                       aria-describedby="confirm-password" placeholder="Enter password again">
            </div>

            <div class="form-group">
                <label for="phone">Phone</label>
                <input type="text" class="form-control" name="phone-input" id="phone"
                       aria-describedby="phone" placeholder="phone">
            </div>

            <div class="form-group">git
                <label for="company-name">Company Name</label>
                <input type="text" class="form-control" name="company-name-input" id="company-name"
                       aria-describedby="first-name" placeholder="first-name">
            </div>

            <div class="form-group">
                <label for="first-line-address">First Line Address</label>
                <input type="text" class="form-control" name="last-name-input" id="first-line-address"
                       aria-describedby="first-line-address" placeholder="first line address">
            </div>

            <div class="form-group">
                <label for="second-line-address">Second Line Address</label>
                <input type="text" class="form-control" name="second-line-address" id="second-line-address"
                       aria-describedby="second-line-address" placeholder="second-line-address">
            </div>

            <div class="form-group">
                <label for="city">City</label>
                <input type="text" class="form-control" name="city" id="city"
                       aria-describedby="city" placeholder="city">
            </div>

            <div class="form-group">
                <label for="eir-code">City</label>
                <input type="text" class="form-control" name="eir-code" id="eir-code"
                       aria-describedby="eir-code" placeholder="eir-code">
            </div>

            <div id = "alert"></div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>

    <script src="../js/service-subscription-request-handler.js"></script>

<?php include "../templates/footer.php" ?>