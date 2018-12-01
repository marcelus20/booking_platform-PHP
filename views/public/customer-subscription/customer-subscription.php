<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 19/11/18
 * Time: 10:42
 */

include "../templates/header.php";

?>


<div class="formclass">
    <div class="card">

        <h1 class="card-header">Customer sign up form</h1>


        <form id="customer-subscription">
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

            <div class="form-group">
                <label for="first-name">First Name</label>
                <input type="text" class="form-control" name="first-name-input" id="first-name"
                       aria-describedby="first-name" placeholder="first-name">
            </div>

            <div class="form-group">
                <label for="last-name">Last Name</label>
                <input type="text" class="form-control" name="last-name-input" id="last-name"
                       aria-describedby="last-name" placeholder="last-name">
            </div>

            <div id="alert">

            </div>

            <button type="submit" class="btn btn-primary">Submit</button>
        </form>
    </div>
</div>


<script src="../js/customer-subscription-request-handler.js"></script>
<?php
include "../templates/footer.php";
?>


