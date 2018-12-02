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

class ServiceProviderController extends AbstractController {

    private static $_serviceProviderController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct();
    }

    public static function customerController(){
        if(!isset(self::$_serviceProviderController)){
            self::$_serviceProviderController = new ServiceProviderController();
        }
        return self::$_serviceProviderController;
    }

    public function getCustomerList($s_id){
        if (!isset($_SESSION["userSession"])){
            return false;
        }else{
            return $this->connectPDO(function($conn) use($s_id) {
                $stmt = $conn->prepare("SELECT DISTINCT c.*  FROM customers c JOIN booking b ON c.c_id = b.c_id WHERE b.s_id = :s_id ORDER BY time_stamp DESC;");
                $stmt->bindValue(":s_id", $s_id);
                $stmt->execute();


                $customers = [];
                foreach ($stmt->fetchAll() as $row){
                    $stmt2 = $conn->prepare("SELECT * FROM booking WHERE c_id = :c_id AND s_id = :s_id;");
                    $stmt2->bindValue(":c_id", $row["c_id"]);
                    $stmt2->bindValue(":s_id", $s_id);
                    $stmt2->execute();

                    $bookingSlots = [];
                    foreach ($stmt2->fetchAll() as $row2){
                        $bookingSlot = new BookingSlot(
                            $row2["time_stamp"], $row2["s_id"], false,
                            new Booking($row2["booking_status"], $row2["review"])
                        );

                        array_push($bookingSlots, $bookingSlot);
                    }
                    $customer = new Customer($row["c_id"], $row["first_name"], $row["last_name"], $bookingSlots);
                    array_push($customers, $customer);
                }
                return $customers;
            });
        }
    }

    public function cancelBooking(BookingSlot $bookingSlot, $c_id){
        return $this->connectPDO(function($conn) use($bookingSlot, $c_id){
            try{
                $stmt = $conn->prepare("DELETE FROM booking WHERE s_id = :s_id AND c_id = :c_id AND time_stamp = :time_stamp ;");
                $stmt->bindValue(":s_id", $bookingSlot->getSId());
                $stmt->bindValue(":c_id", $c_id);
                $stmt->bindValue(":time_stamp", $bookingSlot->getTimestamp());
                $stmt->execute();
                $stmt2 = $conn->prepare("UPDATE booking_slots SET availability = TRUE WHERE s_id = :s_id AND timestamp = :time_stamp ;");
                $stmt2->bindValue(":s_id", $bookingSlot->getSId());
                $stmt2->bindValue(":time_stamp", $bookingSlot->getTimestamp());
                $stmt2->execute();
                return true;
            }catch (PDOException $e){
                return false;
            }
        });
    }

    public function updateBooking($timestamp, $s_id, $c_id, $bookingStatus){
        return $this->connectPDO(function($conn) use($timestamp, $s_id, $c_id, $bookingStatus){
            try{
                $stmt = $conn->prepare("UPDATE booking SET booking_status = :status WHERE time_stamp = :time_stamp AND s_id = :s_id AND c_id = :c_id ;");
                $stmt->bindValue(":status", $bookingStatus);
                $stmt->bindValue(":time_stamp", $timestamp);
                $stmt->bindValue(":s_id", $s_id);
                $stmt->bindValue(":c_id", $c_id);
                $stmt->execute();
                return true;
            }catch (PDOException $e){
                return false;
            }
        });
    }


}
