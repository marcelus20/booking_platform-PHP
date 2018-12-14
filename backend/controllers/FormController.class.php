<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 03/12/18
 * Time: 12:19
 */

include_once "AbstractController.class.php";
include_once "../models/CustomerFormModel.class.php";
include_once "../models/ServiceForm.class.php";

/**
 * Class FormController
 * It handles the sign up entry forms for new customers or new Services providers.
 * For the new Admin, the AdminController class does the trick.
 * It is also a singleton that responds to the routers requests
 * It extends Abstract Controller, therefore it has the parent::PDO attribute for
 * databse connection
 */
class FormController extends AbstractController {
    /**
     * @var null - unique instance of this class, initially null, it will initialise when class loads
     */
    private static $_formController = null;

    public function __construct(){
        parent::__construct();// parent constructor calling
    }

    public static function formController(){//singleton initialiser
        if(!isset(self::$_formController)){//if instance is null, initialise with constructor
            self::$_formController = new FormController();
        }
        return self::$_formController;// return instance
    }

    /**
     * This method handles the CustomerForm entry.
     * The class CustomerFormModel has all necessary information for recording customer
     * in the databse.
     * It will firstly save information in the users table, then go to customers table,
     * after that records the phone.
     * @param CustomerFormModel $newCustomer
     * @return mixed
     */
    public function registerCustomer(CustomerFormModel $newCustomer){
        return $this->connectPDO(function($conn) use($newCustomer){//closure gets external  $newCustomer
            $todayDate = date('Y-m-d'); // retrieving today date
            $idOfNewUser = ""; //this id will be populated later on after new customer gets its new id from DB

            try{
                //query
                $st = $conn->prepare("INSERT INTO users (user_type, email, password, date_created)
                                      VALUES (:user_type, :user_email, :password, '$todayDate')");
                $st->bindValue(":user_type", 'CUSTOMER', PDO::PARAM_STR);//biding user type
                $st->bindValue(":user_email", $newCustomer->getEmail()."", PDO::PARAM_STR);// biding email
                $st->bindValue(":password", $newCustomer->getPassword()."", PDO::PARAM_STR);// biding password
    //
                $st->execute();// executing query

                /**
                 * The operation bellow is for retrieving the id of the user just inserted in the DB
                 */
                $idOfNewUser = "";
                $st2 = $conn->prepare("SELECT id FROM users WHERE email = :email"); // query
                $st2->bindValue(":email", $newCustomer->getEmail());//biding email
                $st2->execute();//executing query

                foreach ($st2->fetchAll() as $row){//looping through the results
                    $idOfNewUser = $row['id']; // populating idOfUser with the id in the result set
                }

                /**
                 * this query is regarding recording the phone into phone_list table
                 */
                $st3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");//query
                $st3->bindValue(":id", "$idOfNewUser", PDO::PARAM_STR);//biding id
                $st3->bindValue(":phone", "{$newCustomer->getPhone()}", PDO::PARAM_STR);// biding phone
                $st3->execute(); // executing query

                /**
                 * this query is regarding recording the new user to customer table
                 */
                $st4 = $conn-> prepare("INSERT INTO customers (c_id, first_name, last_name)
                                        VALUES (:id, :firstName, :lastName )");// query
                $st4->bindValue(":id", $idOfNewUser, PDO::PARAM_STR);//biding id
                $st4->bindValue(":firstName", $newCustomer->getFirstName(), PDO::PARAM_STR);//biding first name
                $st4->bindValue(":lastName", $newCustomer->getLastName(), PDO::PARAM_STR); //biding last name
                $st4->execute();

                echo true;// if everything goes right
            }catch (Exception $e){
                echo false; // if exception is thrown during the proccess
            }
        });
    }

    /**
     * this function register the new Service Provider to table users, table service_provider and phone_list
     * in the database.
     * The ServiceForm object has all necessary information to record this new user
     * @param ServiceForm $serviceFormModel - encapsulated object
     * @return mixed
     */
    public function registerServiceProvider(ServiceForm $serviceFormModel){
        return $this->connectPDO(function($conn) use($serviceFormModel){
            $today = date("Y-m-d"); // getting today date
            try{
//                var_dump($serviceFormModel);
                /**
                 * Query regarding insertion into users table
                 */
                $stmt = $conn->prepare("INSERT INTO users (user_type, email, password, date_created) 
                                        VALUES (:user_type, :email, :password, :date_created)");
                $stmt->bindValue(":user_type", "SERVICE_PROVIDER");// biding user_type
                $stmt->bindValue(":email", $serviceFormModel->getEmail());// biding email
                $stmt->bindValue(":password", $serviceFormModel->getPassword()); // biding password
                $stmt->bindValue("date_created", $today);// biding date_created
                $stmt->execute(); // executing query

                /**
                 * query for getting the newly generated id of the just registared user.
                 */
                $stmt2 = $conn->prepare("SELECT id FROM users WHERE email = :email"); // query
                $stmt2->bindValue(":email", $serviceFormModel->getEmail()); // biding email
                $stmt2->execute();// executing query

                $idOfUser ="";
                foreach ($stmt2->fetchAll() as $row){ // looping through the result set
                    $idOfUser = $row["id"];//populating idOfUser variable
                }

                /**
                 * After retrieving idOFUser, now the table phone_list and service_provider can
                 * receive records.
                 * Next query is for the phone_list
                 */
                $stmt3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");//query
                $stmt3->bindValue(":id", $idOfUser);// biding id
                $stmt3->bindValue(":phone", $serviceFormModel->getPhone());// biding phone
                $stmt3->execute();//executing query

                /**
                 * The following query is regarding the insertion into service_provider table
                 */
                $stmt4 = $conn->prepare("INSERT INTO service_provider VALUES (:id, :companyName, :approvedStatus)");//query
                $stmt4->bindValue(":id", $idOfUser); // biding id
                $stmt4->bindValue(":companyName", $serviceFormModel->getCompanyName());// biding company full name
                $stmt4->bindValue(":approvedStatus", "PENDENT"); // biding approved status
                $stmt4->execute();// executing

                /**
                 * This query is for inserting into the location table the details of the newly
                 * registered service provider.
                 */
                $stmt5 = $conn->prepare("INSERT INTO location VALUES(:id, :eirCode, :secondLineAddress, :firstLineAddress, :city)");//query
                $stmt5->bindValue(":id", $idOfUser);//biding id
                $stmt5->bindValue(":eirCode", $serviceFormModel->getEirCode());//biding eircode
                $stmt5->bindValue(":secondLineAddress", $serviceFormModel->getSecondLineAddress());// biding second line address
                $stmt5->bindValue(":firstLineAddress", $serviceFormModel->getFirstLineAddress());// biding first line address
                $stmt5->bindValue(":city", $serviceFormModel->getCity()); // biding city

                $stmt5->execute(); // executing query


                echo true; // if everything goes right
            }catch (PDOException $e){
                echo $e->getMessage();
                echo false; // if exception is thrown during the proccess
            }
        });
    }

}