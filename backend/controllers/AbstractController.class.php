<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 17:08
 */

include_once "../models/Dsn.class.php";

abstract class AbstractController{
    private $dsn;
    private static $pdo;

    /**
     * AbstractController constructor.
     */
    public function __construct(){
        $this->dsn = new Dsn();
        self::$pdo = null;
    }


    protected function connectPDO(callable $callback){
        if (!isset(self::$pdo)){
            self::$pdo = new PDO(
                $this->dsn->getDsn(), $this->dsn->getUsername(),
                $this->dsn->getPassword(), $this->dsn->getOptions()
            );

        }
        return $callback(self::$pdo);
    }

    protected function disconnectPDO(){
        self::$pdo->close();
    }
}