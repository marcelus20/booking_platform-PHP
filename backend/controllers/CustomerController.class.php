<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 21:10
 */

include_once "../models/SearchBarberModel.class.php";
include_once "../models/entityRepresentation/ServiceProvider.class.php";
include_once "AbstractController.class.php";
include_once "../models/entityRepresentation/BookingSlot.class.php";
include_once "../models/SessionModel.class.php";
include_once "../models/entityRepresentation/Booking.class.php";
include_once "../models/ComplaintCustomerModel.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";


/**
 * Class CustomerController
 * This class is a singleton that will act ua upon the routers (views) requests came from a customer user.
 * This is the manager just for customers. All the methods bellow are the ones that a customer would
 * be able to do while logged in in system.
 *
 * Because it extends Abstract Controller, this class has the parent::PDO attribute, therefore, connection with
 * the database automatically
 */
class CustomerController extends AbstractController {

    //attribute instance of this class (singleton)
    private static $_customerController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct();// calling Abstract Controller constructor
    }

    public static function customerController(){
        if(!isset(self::$_customerController)){// if null, initialise instance
            self::$_customerController = new CustomerController();
        }
        return self::$_customerController;// return instance
    }


    /**
     * This function looks for service providers in the databaser and returns a list of it,
     * with the relevant information for customers choose or skip it.
     * @param SearchBarberModel $searchBarberModel -- a class to represent the front end form
     * where user typed the name in order for the results to pop up
     * @return bool|mixed an array of serviceProviders, empty of filled up.
     * Boolean return will only apply if user sends this request without being logged in.
     * As backend and front end is separate, front end sends a HTTP request using ajax, the problem with the
     * it is that HTTP is STATELESS, so a way of verifying it is buy checking the session.
     * If user is logged in look for the list of service providers, if not, do nothing,
     */
    public function searchBarbers(SearchBarberModel $searchBarberModel){
        if (!isset($_SESSION["userSession"])){
            return false;// do nothing if not logged in
        }else{
            return $this->connectPDO(function($conn) use($searchBarberModel){//Closure
                $st = $conn->prepare("SELECT * FROM service_provider s JOIN location l 
ON l.s_id = s.s_id WHERE s.company_full_name LIKE :fullName;");//query
                $st->bindValue(":fullName", "%".$searchBarberModel->getFullName()."%", PDO::PARAM_STR);// biding fullname
                $st->execute(); // executing query
                if($st->rowCount() > 0){// if there is results
                    $serviceProviders = [];// initialise empty arrays
                    foreach ($st->fetchAll() as $row) {// loop through the result set
                        /**
                         * location object constructor has 5 parameters, new Location(a,b,c,d,e);
                         */
                        $location = new Location(//oppening constructor of Location object
                            $row["s_id"], $row["eir_code"], $row["second_line_address"],
                            $row["first_line_address"], $row["city"]
                        );
                        /**
                         * opening constructor of service provider, which as 4 parameters
                         * new ServiceProvider(a,b,c,d)
                         */
                        $serviceProvider = new ServiceProvider(
                            $row["s_id"], $row["company_full_name"], $row["approved_status"], $location
                        );
                        //appending the service provider into the array of services providers
                        array_push($serviceProviders, $serviceProvider);
                    }
                    return $serviceProviders; // returning array
                }else{
                    return [];// returning an empty array
                }
            });
        }
    }


    /**
     * This method looks for bookingSlots in the DB that are available and returns the list of these slots
     * for the customer to see and pick the one that suits him best
     * @param $id -> the id of the service provider that owns those slots
     * @return bool|mixed false if user is not logged in, list of slots if user is logged in and
     * chosen barber has slots.
     */
    public function searchBookingSlots ($id) {
        if (!isset($_SESSION["userSession"])){//if not logged in, do nothing
            return false;
        }else{
            return $this->connectPDO(function($conn) use($id){//closure
                //query
                $st = $conn->prepare("SELECT * FROM booking_slots b WHERE b.s_id = :id AND b.availability = TRUE");
                $st->bindValue(":id", $id); // biding id of service provider
                $st->execute();// executing query
                if($st->rowCount() > 0){// if there is any result
                    $bookingSlots = []; // initialise booking slots list
                    foreach ($st->fetchAll() as $row) {// looping through the result set
                        /**
                         * openning constructor of BookingSlot, constructor gets 3 parameters (a, b, c)
                         */
                        $bookingSlot = new BookingSlot(
                            $row["timestamp"], $row["s_id"], $row["availability"]
                        );
                        //appending bookingSlot to the array of bookingSlots.
                        array_push($bookingSlots, $bookingSlot);
                    }
                    //return array of bookings slots
                    return $bookingSlots;
                }else{
                    return [];// return empty array if no results were found
                }
            });
        }
    }

    /**
     *
     * This function will get a new Slot object passed as parameter and record it to the
     * bookingSlots table in the database.
     * The bookingSlot object in the parameter has all necessary information for recording a booking.
     *
     * @param BookingSlot $bookingSlot-> with necessary information to record to DB
     * @return bool|mixed false if user is not logged in or true if the insertion query worked.
     */
    public function bookSlot (BookingSlot $bookingSlot) {
        if (!isset($_SESSION["userSession"])){// if not logged in, return false
            return false;
        }else{
            /*
             *  constructing session[usersession] back to UserSession object,
             * This way we can get information from customer logged in
             */
            $session = unserialize($_SESSION["userSession"]);
            return $this->connectPDO(function($conn) use($bookingSlot, $session){
                $c_id = $session->getUserId();// passing session id to c_id variable
                //query
                $stmt = $conn->prepare("UPDATE booking_slots SET availability = FALSE WHERE timestamp = :tmstp AND s_id = :s_id");
                $stmt->bindValue(":tmstp", $bookingSlot->getTimestamp());//binding timestamp
                $stmt->bindValue(":s_id", $bookingSlot->getSId());// biding s_id
                $stmt->execute();//executing first query.

                /**
                 * When a booking is inserted to database, the booking slot related to that booking
                 * should be updated to not available, cause it is not available anymore.
                 * therefore, here is a second query for carrying out this operation
                 */

                $stmt2 = $conn->prepare("INSERT INTO booking VALUES (:tmsp, :s_id, :c_id, :status, :review)");
                $stmt2->bindValue(":tmsp", $bookingSlot->getTimestamp());//binding timestamp
                $stmt2->bindValue(":s_id", $bookingSlot->getSId());//binding s_id
                $stmt2->bindValue(":c_id", $c_id); // binding c_id
                $stmt2->bindValue(":status", $bookingSlot->getBooking()->getBookingStatus());// biding status
                $stmt2->bindValue(":review", $bookingSlot->getBooking()->getReview());//biding booking

                $stmt2->execute();//executing second query

                return true;//return 1 if everything goes fine!
            });
        }
    }

    /**
     * this function gets all bookings that the logged in customer booked so far and returns the list
     * back to views.
     * @return bool|mixed - false if user is not logged in. list of bookings if logged in.
     */
    public function getAllBookings () {
        if (!isset($_SESSION["userSession"])){ // if not logged in, return false
            return false;
        }else{
            /**
             * constructing session[usersession] back to SessionModel
             */
            $session = unserialize($_SESSION["userSession"]);
            return $this->connectPDO(function($conn) use($session){//closure receiving $session
                $stmt = $conn->prepare("SELECT s.*, b.* , l.* 
                    FROM service_provider s 
                        JOIN booking b  ON  b.s_id = s.s_id
                        JOIN location l on l.s_id = s.s_id
                    WHERE b.c_id = :id ;"); // query
                $stmt->bindValue(":id", $session->getUserId());// binding user id
                $stmt->execute(); // executing query

                if($stmt->rowCount() > 0){ // if there is results
                    $serviceProviders = []; //initialising empty array
                    // TODO:  IN THE FUTURE, TO DECREASE THE AMOUNT OF DATA

                    /**
                     * looping through the result set
                     */
                    foreach ($stmt->fetchAll() as $row) {
                        /**
                         * Opening ServiceProvider constructor: gets 5 parameters:
                         * new ServiceProvider(a,b,c,location, booking). location turns out to be a complex object and
                         * it gets 5 parameters, therefore: new Location(a,b,c,d,e).
                         * BookingSlots is also a complex object and its constructor gets 4 parameters:
                         * new BookingSlots(a, b, c, booking) : Booking happens to be a complex object and gets
                         * 2 parameters its constructor: new Booking(a, b)
                         * So, summarizing, many objects are being encapsulated in the others, resulting
                         * in a Service provider that has Location, Booking Slot and Booking.
                         * Everything to be transformed in JSON later on.
                         */
                        $serviceProvider = new ServiceProvider(//openning service provider constructor
                            $row["s_id"], $row["company_full_name"], $row["approved_status"], new Location(//openning Location constructor
                                $row["s_id"], $row["eir_code"], $row["second_line_address"],
                                $row["first_line_address"], $row["city"]
                            ), array(new BookingSlot(//openning bookingSlots constructor
                                $row["time_stamp"], $row["s_id"], false,
                                new Booking(//openning booking constructor
                                    $row["booking_status"], $row["review"])
                            ))
                        );
                        //appending service provider in the array of service providers
                        array_push($serviceProviders, $serviceProvider);
                    }
                    return $serviceProviders;// returning the list of services providers
                }else{
                    return []; // returning an empty array
                }
            });
        }
    }

    /**
     * it gets information of an already recorded booking in db and cancels it. (delete)
     * it gets the booking slots and user id as parameter.
     * @param BookingSlot $bookingSlot
     * @param $userId
     * @return mixed - return true if it has been deleted, false if PDOExcetion is thrown
     */
    public function cancelBooking(BookingSlot $bookingSlot, $userId){
        return $this->connectPDO(function($conn) use($bookingSlot, $userId){ // closure gets bookingSlot and userID
            try{
                $stmt = $conn->prepare("DELETE FROM booking
                                        WHERE s_id = :s_id 
                                            AND c_id = :c_id 
                                            AND time_stamp = :time_stamp ;");// query
                $stmt->bindValue(":s_id", $bookingSlot->getSId());// biding s_id
                $stmt->bindValue(":c_id", $userId); // //biding c_id
                $stmt->bindValue(":time_stamp", $bookingSlot->getTimestamp()); // biding timestamp
                $stmt->execute();// executing query
                /***
                 * When a booking is deleted from DB, its correspondent slot goes back to available again,
                 * so below is the second query responsible to make it available again.
                 */
                $stmt2 = $conn->prepare("UPDATE booking_slots 
                                            SET availability = TRUE 
                                         WHERE s_id = :s_id 
                                            AND timestamp = :time_stamp ;");//openning second query
                $stmt2->bindValue(":s_id", $bookingSlot->getSId()); // biding secondID
                $stmt2->bindValue(":time_stamp", $bookingSlot->getTimestamp()); //biding timestamp
                $stmt2->execute();// executing query
                return true;// return true if everything goes fine
            }catch (PDOException $e){
                return false;// return false if Exception is thrown
            }


        });
    }

    /**
     * This function updates the column "review" of a booking in the table booking in DB.
     * it gets a bookingSlot as a parameter, with all necessary information to find the booking
     * to be updated.
     * @param BookingSlot $bookingSlot object with all needed information
     * @param $c_id id of the user
     * @return mixed true if it updates, false if exception is thrown
     */
    public function updateReview(BookingSlot $bookingSlot, $c_id){
        return $this->connectPDO(function($conn) use($bookingSlot, $c_id){ // closure uses external parameters
            try{
                //query
                $stmt = $conn->prepare("UPDATE booking SET review = :review WHERE time_stamp = :time_stamp AND s_id = :s_id AND c_id = :c_id ;");
                $stmt->bindValue(":review", $bookingSlot->getBooking()->getReview());//biding review
                $stmt->bindValue(":time_stamp", $bookingSlot->getTimestamp());// biding timestamp
                $stmt->bindValue(":s_id", $bookingSlot->getSId());// biding s_id
                $stmt->bindValue(":c_id", $c_id);//biding c_id
                $stmt->execute();//executing query
                return true;// return true if everything goes right
            }catch (PDOException $e){
                return false; // false if exception is thrown
            }
        });
    }

    /**
     * This function lists the barbers that the logged in customer has booked with so far and the
     * number of bookings the customer have ever had with each barber, for instance,
     * if John has booked with Maria ten times, and Michal 5 times, this function will return:
     *
     * Barber         |         times_booked
     * _____________________________________
     * Maria          |              10     |
     * _______________|_____________________|
     * Michael        |              5      |
     * _______________|_____________________|
     *
     *
     * @param $c_id
     * @return mixed
     */
    public function getServicesBooked($c_id){
        return $this->connectPDO(function ($conn)use ($c_id){
            $stmt = $conn->prepare("SELECT s.s_id, s.company_full_name, 
                                        (SELECT COUNT(*) FROM booking boo 
                                              JOIN customers cu
                                                    ON cu.c_id = boo.c_id
                                              WHERE cu.c_id = c.c_id
                                                  AND boo.s_id = s.s_id 
                                              )'times_booked' 
                                    FROM service_provider s 
                                          JOIN booking b
                                              ON s.s_id = b.s_id
                                          JOIN customers c
                                              ON c.c_id = b.c_id
                                          WHERE c.c_id = :id
                                    GROUP BY s.company_full_name; "); // query
            $stmt->bindValue(":id", $c_id);//biding c_id
            $stmt->execute();//executin query
            $complaintCustomerModels = [];// initialising array
            foreach ($stmt->fetchAll() as $row){ // looping through the result set.
                /**
                 * appending new CompaintCustomerModel(a,b,c) to the array
                 */
                array_push($complaintCustomerModels, new ComplaintCustomerModel(
                    $row["s_id"], $row["company_full_name"], $row["times_booked"]
                ) );
            }
            return $complaintCustomerModels; // returning complaintCustomerModels
        });
    }

    /**
     * This method records a complaint to the DB.
     * @param Complaint $complaint -> with all necessary information for recording complaint in db
     * @return mixed true if goes right, false it exception is thrown
     */
    public function addComplaint(Complaint $complaint){
        return $this->connectPDO(function ($conn) use($complaint){// closure takes external complaint variable
            try{
                //opening query
                $stmt = $conn->prepare("INSERT INTO complaints (s_id, c_id, complaint_status ,complaint)
                                    VALUES (:s_id, :c_id, :complaint_status, :complaint);");
                $stmt->bindValue(":s_id",$complaint->getSId());//biding s_id
                $stmt->bindValue(":c_id",$complaint->getCId());//biding c_id
                $stmt->bindValue(":complaint_status", $complaint->getComplaintStatus());// biding complaint_status
                $stmt->bindValue(":complaint",$complaint->getComplaint()); // biding the text about the complaint
                $stmt->execute(); // executing query
                return true;//if complait was recorded
            }catch (PDOException $e){
                return false;// if exeception is throuwn
            }
        });
    }


}