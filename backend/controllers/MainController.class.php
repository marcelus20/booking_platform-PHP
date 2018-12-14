<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 16:42
 */

include_once "../models/LoginModel.class.php";
include_once "AbstractController.class.php";
include_once "../models/SessionModel.class.php";

/**
 * Class MainController
 * This singleton will look after the proccess before the login. When user enter
 * credentials, this class will be loaded and handle operation such as performing the login, checking the login,
 * logging out and all.
 * Its parent class is Abstract Controller, therefore it has the attribute that connects with DATABASE.
 */
class MainController extends AbstractController {

    /**
     * @var null unique instance
     */
    private static $_mainController = null;


    /**
     * MainController constructor
     */
    public function __construct(){// calling parent constructor
        parent::__construct();
    }

    /**
     * instance initializer
     * @return MainController|null
     */
    public static function mainController(){ // if instance is null, initialise it and return
        if(!isset(self::$_mainController)){
            self::$_mainController = new MainController();
        }
        return self::$_mainController; // return instance
    }

    /**
     * initialises a session with the user if credentials are found in the DB
     * @param LoginModel $loginModel -> with credentials information encapsulated (email, password)
     * @return mixed true if credentials are found and session stabilished or false if credentials not found
     */
    public function login(LoginModel $loginModel){
        return $this->connectPDO(function($conn) use($loginModel){// closure gets loginModel external variable
            $st = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password"); // query

            $st->bindValue(":email", $loginModel->getEmail(), PDO::PARAM_STR);//biding email
            $st->bindValue(":password", $loginModel->getPassword(), PDO::PARAM_STR);// biding password
            $st->execute();// executing query

            if($st->rowCount() > 0){ // if there is results
                foreach ($st->fetchAll() as $row) { // loop through the results
                    /**
                     * SessionModel constructor gets 3 paramenters : new SessionModel(a,b,c);
                     * populating _SESSION[userSession] with the newly created SessionModel
                     * In other words, session stabilished
                     */
                    $_SESSION["userSession"] = serialize(new SessionModel( //opening sessionModel constructor
                        $row["id"], $row["user_type"], $row["email"]
                    ));
                }
                return true; // if everything goes right
            }else{
                return false;// if no retults found
            }
        });
    }

    /**
     * destroy session and kills connection with PDO
     * @return bool
     */
    public function logout(){
        try{
            session_destroy();
            $this->disconnectPDO();
            return true;
        }catch (Exception $e){
            return false;
        }
    }

    /**
     * checks if _SESSION[userSession] is null or not. if null, user is not logged in, if not null, user is logged in
     * @return bool
     */
    public function checkLogin(){
        return isset($_SESSION["userSession"]);
    }

    /**
     * @return mixed
     * This function converts the _SESSION[userSerrion] back to SessionModel object.
     */
    public function getUserData(){
        return unserialize($_SESSION["userSession"]);
    }






}