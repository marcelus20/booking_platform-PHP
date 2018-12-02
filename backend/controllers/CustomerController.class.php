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

class CustomerController extends AbstractController {

    private static $_customerController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct();
    }

    public static function customerController(){
        if(!isset(self::$_customerController)){
            self::$_customerController = new CustomerController();
        }
        return self::$_customerController;
    }


    public function searchBarbers(SearchBarberModel $searchBarberModel){
        if (!isset($_SESSION["userSession"])){
            return false;
        }else{
            return $this->connectPDO(function($conn) use($searchBarberModel){
                $st = $conn->prepare("SELECT * FROM service_provider s JOIN location l 
ON l.s_id = s.s_id WHERE s.company_full_name LIKE :fullName;");
                $st->bindValue(":fullName", "%".$searchBarberModel->getFullName()."%", PDO::PARAM_STR);
                $st->execute();
                if($st->rowCount() > 0){
                    $serviceProviders = [];
                    foreach ($st->fetchAll() as $row) {
                        $location = new Location(
                            $row["s_id"], $row["eir_code"], $row["second_line_address"],
                            $row["first_line_address"], $row["city"]
                        );
                        $serviceProvider = new ServiceProvider(
                            $row["s_id"], $row["company_full_name"], $row["approved_status"], $location
                        );
                        array_push($serviceProviders, $serviceProvider);
                    }
                    return $serviceProviders;
                }else{
                    return [];
                }
            });
        }
    }

    public function searchBookingSlots ($id) {
        if (!isset($_SESSION["userSession"])){
            return false;
        }else{
            return $this->connectPDO(function($conn) use($id){
                $st = $conn->prepare("SELECT * FROM booking_slots b WHERE b.s_id = :id AND b.availability = TRUE");
                $st->bindValue(":id", $id);
                $st->execute();
                if($st->rowCount() > 0){
                    $bookingSlots = [];
                    foreach ($st->fetchAll() as $row) {
                        $bookingSlot = new BookingSlot(
                            $row["timestamp"], $row["s_id"], $row["availability"]
                        );
                        array_push($bookingSlots, $bookingSlot);
                    }
                    return $bookingSlots;
                }else{
                    return [];
                }
            });
        }
    }

    public function bookSlot (BookingSlot $bookingSlot) {
        if (!isset($_SESSION["userSession"])){
            return false;
        }else{
            $session = unserialize($_SESSION["userSession"]);
            return $this->connectPDO(function($conn) use($bookingSlot, $session){
                $c_id = $session->getUserId();

                $stmt = $conn->prepare("UPDATE booking_slots SET availability = FALSE WHERE timestamp = :tmstp AND s_id = :s_id");


                $stmt->bindValue(":tmstp", $bookingSlot->getTimestamp());
                $stmt->bindValue(":s_id", $bookingSlot->getSId());
                $stmt->execute();

                $stmt2 = $conn->prepare("INSERT INTO booking VALUES (:tmsp, :s_id, :c_id, :status, :review)");
                $stmt2->bindValue(":tmsp", $bookingSlot->getTimestamp());
                $stmt2->bindValue(":s_id", $bookingSlot->getSId());
                $stmt2->bindValue(":c_id", $c_id);
                $stmt2->bindValue(":status", $bookingSlot->getBooking()->getBookingStatus());
                $stmt2->bindValue(":review", $bookingSlot->getBooking()->getReview());

                $stmt2->execute();

                return true;
            });
        }
    }

    public function getAllBookings () {
        if (!isset($_SESSION["userSession"])){
            return false;
        }else{
            $session = unserialize($_SESSION["userSession"]);
            return $this->connectPDO(function($conn) use($session){
                $stmt = $conn->prepare("SELECT b.* FROM booking b JOIN service_provider s ON  b.s_id = s.s_id JOIN location l on l.s_id = s.s_id WHERE b.c_id = :id ;");
                $stmt->bindValue(":id", $session->getUserId());
                $stmt->execute();

                if($stmt->rowCount() > 0){
                    $bookingSlots = [];
                    foreach ($stmt->fetchAll() as $row) {
                        $bookingSlot = new BookingSlot(
                            $row["time_stamp"], $row["s_id"], false, new Booking(
                                $row["booking_status"], $row["review"]
                            )
                        );
                        array_push($bookingSlots, $bookingSlot);
                    }
                    return $bookingSlots;
                }else{
                    return [];
                }
            });
        }
    }

}