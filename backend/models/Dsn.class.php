<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 16:52
 */



class Dsn{
    private $server ;
    private $username;
    private $password;
    private $dbName;
    private $dsn;
    private $options;

    /**
     * Dsn constructor.
     */
    public function __construct(){
        $this->server = "localhost";
        $this->username = "root";
        $this->password = "";
        $this->dbName = "booking_platform";
        $this->dsn = "mysql:host=$this->server;dbname=$this->dbName";
        $this->options    = array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        );
    }

    /**
     * @return string
     */
    public function getUsername(){
        return $this->username;
    }

    /**
     * @return string
     */
    public function getPassword(){
        return $this->password;
    }

    /**
     * @return string
     */
    public function getDsn(){
        return $this->dsn;
    }

    /**
     * @return array
     */
    public function getOptions(){
        return $this->options;
    }
}