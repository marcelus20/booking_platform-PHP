<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 01/12/18
 * Time: 19:22
 */

abstract class AbstractModel{
    protected function toJSON(){
        return get_object_vars($this);
    }
}