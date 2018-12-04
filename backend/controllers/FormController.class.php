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

class FormController extends AbstractController {
    private static $_formController = null;

    public function __construct(){
        parent::__construct();
    }

    public static function formController(){
        if(!isset(self::$_formController)){
            self::$_formController = new FormController();
        }
        return self::$_formController;
    }

    public function registerCustomer(CustomerFormModel $newCustomer){
        return $this->connectPDO(function($conn) use($newCustomer){
            $todayDate = date('Y-m-d');
            $idOfNewUser = "";

            try{
                $st = $conn->prepare("INSERT INTO users (user_type, email, password, date_created)
    VALUES (:user_type, :user_email, :password, '$todayDate')");
                $st->bindValue(":user_type", 'CUSTOMER', PDO::PARAM_STR);
                $st->bindValue(":user_email", $newCustomer->getEmail()."", PDO::PARAM_STR);
                $st->bindValue(":password", $newCustomer->getPassword()."", PDO::PARAM_STR);
    //
                $st->execute();

                $idOfNewUser = "";
                $st2 = $conn->prepare("SELECT id FROM users WHERE email = :email");
                $st2->bindValue(":email", $newCustomer->getEmail());
                $st2->execute();

                foreach ($st2->fetchAll() as $row){
                    $idOfNewUser = $row['id'];
                }

                $st3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");
                $st3->bindValue(":id", "$idOfNewUser", PDO::PARAM_STR);
                $st3->bindValue(":phone", "{$newCustomer->getPhone()}", PDO::PARAM_STR);
                $st3->execute();

                $st4 = $conn-> prepare("INSERT INTO customers (c_id, first_name, last_name)
    VALUES (:id, :firstName, :lastName )");
                $st4->bindValue(":id", $idOfNewUser, PDO::PARAM_STR);
                $st4->bindValue(":firstName", $newCustomer->getFirstName(), PDO::PARAM_STR);
                $st4->bindValue(":lastName", $newCustomer->getLastName(), PDO::PARAM_STR);
                $st4->execute();

                echo true;
            }catch (Exception $e){
                echo false;
            }
        });
    }

    public function registerServiceProvider(ServiceForm $serviceFormModel){
        return $this->connectPDO(function($conn) use($serviceFormModel){
            $today = date("Y-m-d");
            try{
//                var_dump($serviceFormModel);
                $stmt = $conn->prepare("INSERT INTO users (user_type, email, password, date_created) 
VALUES (:user_type, :email, :password, :date_created)");
                $stmt->bindValue(":user_type", "SERVICE_PROVIDER");
                $stmt->bindValue(":email", $serviceFormModel->getEmail());
                $stmt->bindValue(":password", $serviceFormModel->getPassword());
                $stmt->bindValue("date_created", $today);

                $stmt->execute();

                $stmt2 = $conn->prepare("SELECT id FROM users WHERE email = :email");
                $stmt2->bindValue(":email", $serviceFormModel->getEmail());
                $stmt2->execute();

                $idOfUser ="";
                foreach ($stmt2->fetchAll() as $row){
                    $idOfUser = $row["id"];
                }

                $stmt3 = $conn->prepare("INSERT INTO phone_list (id, phone) VALUES (:id, :phone)");
                $stmt3->bindValue(":id", $idOfUser);
                $stmt3->bindValue(":phone", $serviceFormModel->getPhone());
                $stmt3->execute();

                $stmt4 = $conn->prepare("INSERT INTO service_provider VALUES (:id, :companyName, :approvedStatus)");
                $stmt4->bindValue(":id", $idOfUser);
                $stmt4->bindValue(":companyName", $serviceFormModel->getCompanyName());
                $stmt4->bindValue(":approvedStatus", "PENDENT");
                $stmt4->execute();

                $stmt5 = $conn->prepare("INSERT INTO location VALUES(:id, :eirCode, :secondLineAddress, :firstLineAddress, :city)");
                $stmt5->bindValue(":id", $idOfUser);
                $stmt5->bindValue(":eirCode", $serviceFormModel->getEirCode());
                $stmt5->bindValue(":secondLineAddress", $serviceFormModel->getSecondLineAddress());
                $stmt5->bindValue(":firstLineAddress", $serviceFormModel->getFirstLineAddress());
                $stmt5->bindValue(":city", $serviceFormModel->getCity());

                $stmt5->execute();


                echo true;
            }catch (PDOException $e){
                echo $e->getMessage();
                echo false;
            }
        });
    }

}