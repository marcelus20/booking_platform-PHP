<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 02/12/18
 * Time: 18:48
 */

include_once "AbstractController.class.php";
include_once "../models/entityRepresentation/Customer.class.php";
include_once "../models/entityRepresentation/BookingSlot.class.php";

/**
 * Class ServiceProviderController
 * This singleton manages the router requests for services providers logged in.
 * Its parent class is AbstractController which gives it the access to database and the inherited method
 * this->connectPDO(callable $closureAnonymousFunction) to perform operations in the database.
 */
class ServiceProviderController extends AbstractController {

    /**
     * @var null unique instance of the class
     */
    private static $_serviceProviderController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct();
        /**
         * deleting from DB all slots availables that have not been booked until now.
         */
        $this->clearOldSlots();
        /**
         * seting all pendent/confirmed bookings older than now to COMPLETE status.
         */
        $this->setOldBookingsToComplete();
    }

    /**
     * Deletes from the tabe bookingSlots in the DB all available slots that have not been booked until now
     * this function is called every time this singleton loads (called in the constructor)
     * @return mixed
     */
    private function clearOldSlots(){
        return $this->connectPDO(function($conn){//lambda
            $st = $conn->prepare("DELETE FROM booking_slots WHERE timestamp < NOW() AND availability = true");//query
            $st->execute();//executing query
            /*
             * the reason of returning empty string is because the server does not need to communicate frontend about this
             * operation. this is totally confidential and it is entirely of the server side regards.
             */
            return "";
        });

    }

    /**
     * It looks for all booking status PENDENT or CONFIRMED that are older than now and set them to 'COMPLETE' status
     * this function is called every time this singleton loads (called in the constructor)
     * @return mixed
     */
    private function setOldBookingsToComplete(){
        return $this->connectPDO(function($conn){//lambda
            $st = $conn->prepare("UPDATE booking 
                                      SET booking_status = 'COMPLETE' 
                                  WHERE time_stamp < NOW()
                                      AND (booking_status = 'CONFIRMED'
                                      OR booking_status = 'PENDENT');");// query
            $st->execute();//executing query
            /**
             * for the same reason with the method above,
             * the reason of returning empty string is because the server does not need to communicate frontend about this
             * operation. this is totally confidential and it is entirely of the server side regards.
             */
            return "";
        });
    }

    /**
     * singleton initializer
     * @return null|ServiceProviderController
     */

    public static function serviceProviderController(){
        if(!isset(self::$_serviceProviderController)){ //if instance is null, initialise it
            self::$_serviceProviderController = new ServiceProviderController();
        }
        return self::$_serviceProviderController; // return instance
    }

    /**
     * gets a list of customers that booked with the logged in service provider and returns the list.
     * @param $s_id -> the id of the logged in service provider
     * @return bool|mixed -> false if service is not logged in, list of customers if service is logged in
     */
    public function getCustomerList($s_id){
        if (!isset($_SESSION["userSession"])){// if not logged in, return false straight away
            return false;
        }else{
            return $this->connectPDO(function($conn) use($s_id) { //closure gets external s_id
                $stmt = $conn->prepare("SELECT DISTINCT c.*  FROM customers c 
                                        JOIN booking b 
                                            ON c.c_id = b.c_id 
                                        WHERE b.s_id = :s_id 
                                        ORDER BY time_stamp DESC;"); // query
                $stmt->bindValue(":s_id", $s_id);// biding s_id
                $stmt->execute();// executing query

                $customers = [];// initialising array of customers empty
                foreach ($stmt->fetchAll() as $row){// loping through the results found
                    /**
                     * for each customers, we need to retrieve all bookings this customer had with this service provider,
                     * after that we populate the list of Bookings in the Customer object and then we append customer
                     * in the array of Customers
                     */
                    $stmt2 = $conn->prepare("SELECT * FROM booking WHERE c_id = :c_id AND s_id = :s_id;");// second query
                    $stmt2->bindValue(":c_id", $row["c_id"]);// biding c_id
                    $stmt2->bindValue(":s_id", $s_id);// biding s_id
                    $stmt2->execute();// executinf query

                    $bookingSlots = []; // initialising the empty array of bookingSlots
                    foreach ($stmt2->fetchAll() as $row2){// for each result of this second query
                        /**
                         * BookingSlot object gets 5 parameters in its constructor: new BookingSlot(a,b,c, booking)
                         * Booking, on the other hand, gets 2 parameters in its constructor: new Booking(a,b)
                         */
                        $bookingSlot = new BookingSlot( // openning bookingSlot constructor
                            $row2["time_stamp"], $row2["s_id"], false,
                            new Booking($row2["booking_status"], $row2["review"])
                        );

                        /**
                         * appending each bookingSlots to the array of bookingSlots
                         */
                        array_push($bookingSlots, $bookingSlot);
                    }
                    //instantiating new Customer in $customer
                    $customer = new Customer($row["c_id"], $row["first_name"], $row["last_name"], $bookingSlots);
                    /**
                     * appending $customer in $customers (appending object in the array)
                     */
                    array_push($customers, $customer);
                }
                return $customers; // return the array of customers
            });
        }
    }


    /**
     *
     * This function cancels a booking  recorded in the booking table in the DB.
     * The bookingSlot parameter has all necessary information of the record in the database to be deleted
     * THe c_id is the id of the customer which is part of the booking entity compose key.
     * @param BookingSlot $bookingSlot
     * @param $c_id
     * @return mixed - true if deleted, false if PDOException is thrown
     */
    public function cancelBooking(BookingSlot $bookingSlot, $c_id){
        return $this->connectPDO(function($conn) use($bookingSlot, $c_id){ // closure gets bookingSlots and c_id
            try{
                $stmt = $conn->prepare("DELETE FROM booking 
                                        WHERE s_id = :s_id 
                                            AND c_id = :c_id 
                                            AND time_stamp = :time_stamp ;"); // query
                $stmt->bindValue(":s_id", $bookingSlot->getSId()); // biding s_id
                $stmt->bindValue(":c_id", $c_id); // biding c_id
                $stmt->bindValue(":time_stamp", $bookingSlot->getTimestamp()); // binding timestamp
                $stmt->execute();//executing qery

                /**
                 * similarly with customerController, when a booking record is deleted from DB, the slot
                 * correspondent to that booking is made available. So bellow is the query for making available.
                 */
                $stmt2 = $conn->prepare("UPDATE booking_slots 
                                             SET availability = TRUE 
                                         WHERE s_id = :s_id 
                                             AND timestamp = :time_stamp ;");// query
                $stmt2->bindValue(":s_id", $bookingSlot->getSId());// biding s_id
                $stmt2->bindValue(":time_stamp", $bookingSlot->getTimestamp());// binding timestamp
                $stmt2->execute(); // executing
                return true;// returning true if all went well
            }catch (PDOException $e){
                return false; // return false if PDOException is thrown
            }
        });
    }

    /**
     * Function updates the column booking_status in the DB to the status passed as parameter
     * these three first parameter are part of the record compose key
     * @param $timestamp - part of the key
     * @param $s_id - part of the key
     * @param $c_id - part of the key
     * @param $bookingStatus - the new status to be changed
     * @return mixed
     */
    public function updateBooking($timestamp, $s_id, $c_id, $bookingStatus){
        return $this->connectPDO(function($conn) use($timestamp, $s_id, $c_id, $bookingStatus){
            try{
                $stmt = $conn->prepare("UPDATE booking 
                                            SET booking_status = :status 
                                        WHERE time_stamp = :time_stamp 
                                            AND s_id = :s_id
                                            AND c_id = :c_id ;"); //query
                $stmt->bindValue(":status", $bookingStatus);// biding status
                $stmt->bindValue(":time_stamp", $timestamp);// biding timestamp
                $stmt->bindValue(":s_id", $s_id); // biding s_id
                $stmt->bindValue(":c_id", $c_id); // biding c_id
                $stmt->execute();// executing query
                return true; // return true if update is successful
            }catch (PDOException $e){
                return false;// return false if update is not successful
            }
        });
    }

    /**
     *
     * looks for available slots with a specific date and returns the list of booking slots for that date, no matter its
     * availability attribute
     * @param $date
     * @param $s_id
     * @return mixed return the list of bookingSlots in JSON format.
     */
    public function searchSlotsWithDate($date, $s_id){
        return $this->connectPDO(function($conn) use($date, $s_id){// closure gets date and s_id variables
            try{
                $stmt = $conn->prepare("SELECT * FROM booking_slots 
                                        WHERE s_id = :s_id 
                                            AND timestamp LIKE :timestamp;"); // query
                $stmt->bindValue(":s_id", $s_id);// s_id
                $stmt->bindValue(":timestamp", $date."%"); // timestamp
                $stmt->execute(); // executing

                $bookingSlots = []; // array of bookingSlots

                foreach ($stmt->fetchAll() as $row){ // looping through the result set
                    /**
                     * BookingSlot constructor gets 5 parameter : new BookingSlot(a,b,c,d,e).
                     * This case, the last parameter is null cause it maps to the correspondent booking, which
                     * turns out to be irrelevant in this context.
                     */
                    $bookingSlot = new BookingSlot($row["timestamp"], $row["s_id"], $row["availability"], null);
                    array_push($bookingSlots, $bookingSlot); // append newly instatiated bookingSlot to the array of Booking slots
                }
                return json_encode($bookingSlots); // returned the JSON format of the object
            }catch (PDOException $e){
                return false; // return false if PDO Exception is thrown
            }
        });
    }

    /**
     * Inserts new slots to bookingSlots table in the DB.
     * The default value for availability is true every time a slot is recorded to the DB.
     * @param $dates -- the array of dates where the slot will be inserted
     * @param $s_id -- part of the KEY: ID of the service provider logged in
     * @return mixed
     */
    public function insertSlots($dates, $s_id){
        return $this->connectPDO(function ($conn) use($dates, $s_id){ // closure takes the key parts
            try{
                foreach ($dates as $date){ // looping through dates array
                    /**
                     * instantiate booking slot object
                     */
                    $bookingSlot = new BookingSlot($date["date"], $s_id, TRUE, null);
                    $stmt = $conn->prepare("INSERT INTO booking_slots VALUES (:timestamp, :s_id, :availability);");// preapre query
                    $stmt->bindValue(":timestamp", $bookingSlot->getTimestamp()); // bind timestamp
                    $stmt->bindValue(":s_id", $bookingSlot->getSId()); // bind s_id
                    $stmt->bindValue(":availability", $bookingSlot->getAvailability()); // bind availability
                    $stmt->execute(); // execute query
                }

                return true; // return true if everything goes fine
            }catch(PDOException $e){return false;} // if throws PDO Exception
        });
    }

    /**
     * This function checks if the service provider is 'PENDENT' status.
     * It looks for the service_provider table and look at the "approved_status" column.
     * @param $s_id
     * @return mixed
     */
    public function checkIfIsPendent($s_id){
        return $this->connectPDO(function ($conn) use($s_id){ // closure takes s_id
            try{
                $stmt = $conn->prepare("SELECT approved_status FROM service_provider WHERE s_id = :s_id;"); // query
                $stmt->bindValue(":s_id", $s_id); //  binds s_id
                $stmt->execute();//execute
                $status = "";
                foreach ($stmt->fetchAll() as $row){ // lopping through the result set
                    $status = $row["approved_status"]; // populate the status variable.
                }
                if($status == "PENDENT"){ // if status is PENDENT, then return true
                    return true;
                }else{ // IF NOT PENDENT, RETURN FALSE
                    return false;
                }
            }catch(PDOException $e){return false;}//return false if EXception is thrown.
        });
    }


}
