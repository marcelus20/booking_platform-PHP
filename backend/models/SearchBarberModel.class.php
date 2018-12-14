<?php

/**
 * Class SearchBarberModel
 * maps the input of the frontend searchBarber engine to the fulName attribute of this class.
 *
 * customerController uses ask database to return a Barber with the fullName passed.
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