<!doctype html>
<html lang="en">
<head>
    <title>Booking Platform</title>
    <meta charset="utf8">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- Optional theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
    <script src="/booking_platform/views/public/js/common.js"></script>
    <script src="/booking_platform/views/public/js/dashboardServiceHandler.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>

</head>
<body>

<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <div class="navbar-header">

            <a class="navbar-brand" href="#">Hello, <?php echo $_SESSION["email"];?></a>
        </div>
        <ul class="nav navbar-nav">
            <li class="active"><a href="#" id="home">Home</a></li>
            <!--                <li><a href="#">Look for barbers</a></li>-->
            <li><a href="#" id="insert-slots">Insert Slots</a></li>
            <li><a href="#" id="view-customers-list">View Customers List</a></li>
            <!--                <li><a href="#">make a review</a></li>-->
            <!--                <li><a href="#">make a complaint about barber</a></li>-->
        </ul>
<!--        <form class="navbar-form navbar-left">-->
<!--            <div class="form-group">-->
<!--                <input type="text" class="form-control" placeholder="Search your customers" id="searchEngine">-->
<!--            </div>-->
<!--            <!--                <button type="submit" class="btn btn-default">Submit</button>-->-->
<!--        </form>-->
        <ul class="nav navbar-nav navbar-right">
            <li><a href="http://localhost/booking_platform/controllers/logout.php"><span class="glyphicon glyphicon-log-out"></span> Logout</a></li>
        </ul>
    </div>
</nav>



