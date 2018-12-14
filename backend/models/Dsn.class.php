<?php


/**
 * Class Dsn
 * Holds the necessary information to perform a connection to the database.
 *
 *AbstractController uses this class to to initialise the PDO attribute.
 */

class Dsn{
    /**
     * @var string attributes
     */
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
        $this->server = "localhost"; // mysql is hosted in localhost
        $this->username = "root";// root is the user to login to mysql server
        $this->password = ""; // no password is required
        $this->dbName = "booking_platform"; // name of the database
        $this->dsn = "mysql:host=$this->server;dbname=$this->dbName"; // mounting parameter of the PDO
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