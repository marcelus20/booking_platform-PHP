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
        return $this->connectPDO(function($conn) use($searchBarberModel){
            $st = $conn->prepare("SELECT * FROM service_provider s JOIN location l 
ON l.s_id = s.s_id WHERE s.company_full_name LIKE :fullName;");

            $st->bindValue(":fullName", "%".$searchBarberModel->getFullName()."%", PDO::PARAM_STR);
            $st->execute();

            if($st->rowCount() > 0){
                $serviceProviders = [];
                foreach ($st->fetchAll() as $row) {
                    $serviceProvider = new ServiceProvider(
                        $row["s_id"], $row["company_full_name"], $row["approved_status"]
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