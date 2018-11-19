
<?
    function passwordHasher($str){
        return strtoupper(md5($str));
    }
?>