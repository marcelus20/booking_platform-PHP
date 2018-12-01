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


class MainController extends AbstractController {

    private static $_mainController;


    /**
     * MainController constructor
     */
    public function __construct(){
        parent::__construct();
    }

    public static function mainController(){
        if(!isset(self::$_mainController)){
            self::$_mainController = new MainController();
        }
        return self::$_mainController;
    }

    public function login(LoginModel $loginModel){
        return $this->connectPDO(function($conn) use($loginModel){
            $st = $conn->prepare("SELECT * FROM users WHERE email = :email AND password = :password");

            $st->bindValue(":email", $loginModel->getEmail(), PDO::PARAM_STR);
            $st->bindValue(":password", $loginModel->getPassword(), PDO::PARAM_STR);
            $st->execute();

            if($st->rowCount() > 0){
                foreach ($st->fetchAll() as $row) {
                    $_SESSION["userSession"] = serialize(new SessionModel(
                        $row["id"], $row["user_type"], $row["email"]
                    ));
                }
                return true;
            }else{
                return false;
            }
        });
    }

    public function logout(){
        try{
            session_destroy();
            $this->disconnectPDO();
            return true;
        }catch (Exception $e){
            return false;
        }
    }

    public function checkLogin(){
        return isset($_SESSION["userSession"]);
    }

    public function getUserData(){
        return unserialize($_SESSION["userSession"]);
    }






}