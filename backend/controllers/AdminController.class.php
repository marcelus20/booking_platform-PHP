<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:15
 */

include_once "AbstractController.class.php";
include_once "../models/entityRepresentation/Log.class.php";
include_once "../models/entityRepresentation/ServiceProvider.class.php";

/**
 * Class AdminController
 * Due to the fact it extends AbstractController, it has the attribute pdo.
 * The method connectPDO gets an anonymous function that gets the "self::pdo" as parameter, which we are naming here
 * $conn variable.
 *
 * This is a singleton class cause it just one instance is enough to handle many admins requests.
 */
class AdminController extends AbstractController {

    /**
     * The single instance
     * @var null
     */
    private static $_adminController = null;

    /**
     * CustomerController constructor.
     */
    public function __construct(){
        parent::__construct(); // calling constructor of AbstractController
    }

    /**
     * this function returns the AdminController instance, which is the _adminController static attribute
     * @return AdminController|
     */
    public static function adminController(){
        if(!isset(self::$_adminController)){// if null, initialise it
            self::$_adminController = new AdminController();
        }
        return self::$_adminController; // return instance
    }


    /**
     * From this point, it is where this controller class will respond to the VIEW part of the backend
     * structure, the so called ROUTERS. Routers will be making use of these functions, and these functions
     * will return somethind to ROUTERS.
     *
     * If the the queries executed are INSERT or UPDATE queries, the return is either true or false (1 or 0)
     * If true, data has been inserted or updated in database whereas for the SELECT queries,
     * The return is the serialised version of the model class requested.
     * EG: if request is a list of services providers, services providers will be serialisable
     * in order to send the JSON format back to front end.
     */

    /**
     * This function will return the list of the content in the table logs in database
     * @return Logs
     */
    public function getAllLogs () {
        return $this->connectPDO(function ($conn){
            $stmt = $conn->prepare("SELECT * FROM logs l JOIN users u ON l.id = u.id ORDER BY log_id DESC LIMIT 50;");
            $stmt->execute();
            $logs = [];//initialise empty array

            foreach ($stmt->fetchAll() as $row){ // lop through results.
                //if results are found, map it to the Log model object
                array_push($logs, new Log($row["log_id"], $row["email"], $row["activity_log"])) ;
            }
            return $logs;//return the list of logs
        });
    }

    /**
     * This function is for addning a new Admin in the system.
     * The object $adminFormModel has all the necessary information about the new Admin
     * to insert data into the DATABASE
     *
     * @param AdminFormModel $adminFormModel
     * @return true/false -> successful insertion or fail
     */
    public function registerAdmin(AdminFormModel $adminFormModel){
        //$callable($conn) is a closure, so variables from outside this function should be passed by
        //use(), which in this case is the $adminFormModel
        return $this->connectPDO(function ($conn) use ($adminFormModel){
            try{
                $today = date("Y-m-d"); // initialising today date
                $stmt= $conn->prepare("INSERT INTO users (user_type, email, password, date_created) 
                                        VALUES ('ADMIN', :email, :password, :dateToday)");
                $stmt->bindValue(":email", $adminFormModel->getEmail());//binding email
                $stmt->bindValue(":password", $adminFormModel->getPassword()); // biding password
                $stmt->bindValue(":dateToday", $today); // biding date

                $stmt->execute();// executing query

                return true;// successfull
            }catch (PDOException $e){
                return false;// fail
            }
        });
    }

    /**
     * Returns a list of pendent service providers.
     * To be used by admins that want to change the status of pendents service providers
     * @return mixed -> list of servicesProviders
     */
    public function getPendentServices(){
        return $this->connectPDO(function ($conn){
            try{
                $stmt= $conn->prepare("SELECT * FROM service_provider s
                                        JOIN location l ON s.s_id = l.s_id
                                        WHERE approved_status = 'PENDENT';");
                $stmt->execute(); // executing query above
                $serviceProviders = [];

                /**
                 * looping through the results.
                 * THe array of serviceproviders will be filled for each line found in the result set
                 */
                foreach ($stmt->fetchAll() as $row){
                    //opening ServiceProvider constructor
                    $serviceProvider = new ServiceProvider(
                        $row["s_id"], $row["company_full_name"], $row["approved_status"],
                        //opening Location contructor
                        new Location(
                            $row["s_id"], $row["eir_code"], $row["second_line_address"], $row["first_line_address"],
                            $row["city"]
                        ),[]
                    );
                    //appending serviceProvider in serviceProviders array
                    array_push($serviceProviders, $serviceProvider);
                }
                return $serviceProviders;// returning serviceProviders array
            }catch (PDOException $e){
                return false; // did not work
            }
        });
    }

    /**
     *updates in the database the column "approved_status" of the service provider table.
     *
     * @param $executionType -> The url routing used to trigger this function "approve or reject"
     * @param ServiceProvider $serviceProvider - the object with already updated approved_status
     * @return mixed
     */
    public function updateServiceStatus($executionType, ServiceProvider $serviceProvider){
        //closure anonymous function using externals parameters ($executionType, $serviceProvider)
        return $this->connectPDO(function ($conn) use ($executionType, $serviceProvider){
            try{
                if($executionType == "approve"){ // if approved, set to approve
                    $stmt= $conn->prepare("UPDATE service_provider SET approved_status = :status 
                        WHERE s_id = :s_id;");
                    $stmt->bindValue(":status", $serviceProvider->getApprovedStatus());//binding status
                    $stmt->bindValue(":s_id", $serviceProvider->getSId()); // biding service id
                    $stmt->execute();
                    return true; // succesful
                }else{ // if not, set to rejected
                    $stmt= $conn->prepare("UPDATE service_provider SET approved_status = 'REJECTED' 
                        WHERE s_id = :s_id;");
                    $stmt->bindValue(":s_id", $serviceProvider->getSId());// biding service id
                    $stmt->execute();
                    return true; // successful
                }
            }catch (PDOException $e){
                return false; // somethind went wrong with the PDO
            }
        });
    }

    /**
     * returns the list of Complaints retrieved from the table complaints in the database.
     * foreach complaint found in the result set, it will be mapped to Complaint php class, then
     * appended to the array of complaints and then the return of the array will be carried out.
     * @return mixed -> the array of complaints
     */
    public function getAllComplaints(){
        return $this->connectPDO(function ($conn){// lambda body
            $stmt= $conn->prepare("SELECT c.complaint_ID, c.s_id, c.c_id, s.company_full_name, cu.first_name, c.complaint_status, c.complaint
                                  FROM complaints c 
                                      JOIN service_provider s
                                          ON s.s_id = c.s_id
                                      JOIN customers cu
                                          ON cu.c_id = c.c_id;");
            $stmt->execute();// executing query above
            $complaints = [];// initialising complaints with an empty array
            foreach ($stmt->fetchAll() as $row) { //for each row in the result set
                array_push($complaints, new Complaint(//Complaint constructor opened.
                    $row["complaint_ID"], $row["s_id"], $row["c_id"], $row["company_full_name"], $row["first_name"], $row["complaint_status"]
                    , $row["complaint"]
                ));
            }
            return $complaints;//return the array of complaints

        });
    }

    /**
     * This method updates a record in the table complaints in the database. It takes the complaint object as
     * a parameter, and it gets all of its complaint attributte to recorde in the database.
     * the complaint object should be previously updated before passing it as parameter.
     * @param Complaint $complaint - the complaint object with the necessary data to record in the database.
     * @return mixed
     */
    public function updateAComplaintStatus(Complaint $complaint){
        return $this->connectPDO(function ($conn) use ($complaint){
            try{
                //query
                $stmt= $conn->prepare("UPDATE complaints SET complaint_status = :status 
                                                    WHERE s_id = :s_id AND 
                                                          c_id = :c_id AND 
                                                          complaint_ID = :id;");
                $stmt->bindValue(":status", $complaint->getComplaintStatus());//biding status
                $stmt->bindValue(":s_id", $complaint->getSId());//biding s_id
                $stmt->bindValue(":c_id", $complaint->getCId());//biding c_id
                $stmt->bindValue(":id", $complaint->getComplaintID());// biding id
                $stmt->execute();
                return true;
            }catch (PDOException $e){
                return false;
            }
        });
    }

}