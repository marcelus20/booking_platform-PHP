<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 17:08
 */

include_once "../models/Dsn.class.php";

/**
 * Class AbstractController
 * All of the controllers will inherit from this class and get the connection with the database.
 * This class has the dsn attribute which holds all of the DB credentials like, the place
 * where the db is hosted along with the userNme and password (check the Dsn class).
 */
abstract class AbstractController{
    private $dsn; // declaring dsn
    private static $pdo; // declaring pdo

    /**
     * AbstractController constructor.
     */
    public function __construct(){
        $this->dsn = new Dsn(); // class Dsn holds all credentials needed to initialise pdo.
        self::$pdo = null; // the pdo connection itself. It will be initially set to null
    }


    /**
     * When the children controllers want to perform a connection , the calback (annonymous function)
     * will be called after the return of PDO initialised.
     *
     * As this is static, if PDO is null, it will initialise with PDO  constructor, else, it will just return PDO
     *
     * Once returned, controllers will be able to perform queries executions.
     * @param callable $callback -> the annonymous function.
     * @return mixed
     */
    protected function connectPDO(callable $callback){
        if (!isset(self::$pdo)){ // if pdo attribute is null
            self::$pdo = new PDO(// initialise calling pdo constructor
                $this->dsn->getDsn(), $this->dsn->getUsername(),
                $this->dsn->getPassword(), $this->dsn->getOptions()
            );
        }
        return $callback(self::$pdo);// returning the anonymous function (closure or lambda) body.
    }

    /**
     * this method is just for closing the attribute pdo, which is an instance of PDO
     */
    protected function disconnectPDO(){
        if (isset(self::$pdo)){//if pdo is not null, close it!
            self::$pdo->close();
        }
    }
}