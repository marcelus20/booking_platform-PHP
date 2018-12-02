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


}
