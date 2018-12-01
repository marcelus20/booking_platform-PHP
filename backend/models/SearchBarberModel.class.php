<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 21:16
 */

class SearchBarberModel{
    private $fullName;

    /**
     * SearchBarberModel constructor.
     */
    public function __construct($name){
        $this->fullName = $name;
    }

    /**
     * @return mixed
     */
    public function getFullName(){
        return $this->fullName;
    }

}