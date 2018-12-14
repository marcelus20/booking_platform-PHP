<?php



include_once "../controllers/AdminController.class.php";
include_once "../models/AdminFormModel.class.php";
include_once "../models/entityRepresentation/ServiceProvider.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";

session_start();

/**
 * This router will handle ALL HTTP requests performed by the frontend JS admin controller and asks the backend
 * adminController to look for an information in DB.
 * @param $executionType -> will come in the URL in the query URL part
 * @param AdminController $adminController the controller that will handle the router
 * @return false|mixed|string|true
 */

function selectExecution($executionType, AdminController $adminController){
    switch ($executionType) {
        /**
         * case query string of the url is "getAllLogs", will trigger the function getAllLogs in adminController
         */
        case "getAllLogs":{
            return json_encode($adminController->getAllLogs());
        }
        /**
         * case queryString of URL is "registerAdmin", it will return registerAdmin(a) function in adminController
         */
        case "registerAdmin": {
            $data = json_decode(file_get_contents('php://input'), true);
            $adminFormModel = new AdminFormModel($data["email"], strtoupper(md5($data["password"])), strtoupper(md5($data["confirmPassword"])));
            return $adminController->registerAdmin($adminFormModel);
        }
        /**
         * case URL query string is "getPEndentServices" it will triger the JSON format of the fmethod
         * getPendentServices in adminController class
         */
        case "getPendentServices":{
            return json_encode($adminController->getPendentServices());
        }
        /**
         * case URL query string is "approve" it will trigger the function updateServiceStatus in adminController
         */
        case "approve":{
            $data = json_decode(file_get_contents('php://input'), true);
            /**
             * the data retrieved from frontEnd, needs to be mapped to a serviceProvider entity class.
             */
            $serviceProvider = new ServiceProvider($data["s_id"], $data["company_full_name"], $data["approved_status"],
                new Location($data["location"]["s_id"], $data["location"]["eir_code"], $data["location"]["second_line_address"],
                   $data["location"]["first_line_address"] , $data["location"]["city"]), []);
            return $adminController->updateServiceStatus($executionType, $serviceProvider);
        }
        /**
         * case URL query string is "reprove", it will also trigger the function updateServiceStatus from adminController instance.
         *
         */
        case "reprove":{
            $data = json_decode(file_get_contents('php://input'), true);
            /**
             * maping data retrieved from frontEnd by POST to serviceProvider entity instance
             */
            $serviceProvider = new ServiceProvider($data["s_id"], $data["company_full_name"], $data["approved_status"],
                new Location($data["location"]["s_id"], $data["location"]["eir_code"], $data["location"]["second_line_address"],
                    $data["location"]["first_line_address"] , $data["location"]["city"]), []);
            return $adminController->updateServiceStatus($executionType, $serviceProvider);
        }
        /**
         * if URL query string is "getAllComplaints", return the JSON format of getAllComplaints() method in
         * adminController class
         */
        case "getAllComplaints":{
            return json_encode($adminController->getAllComplaints());
        }

        /**
         * if URL query string is "updateComplaintStatus", trigger the function updateAComplaintStatus(a)
         * in adminController
         */
        case "updateComplaintStatus":{
            $data = json_decode(file_get_contents('php://input'), true);
            /**
             * mapping data retrieved from sent from frontEnd by POST to new Complaint() object
             */
            $complaint = new Complaint(
                $data["complaint_ID"], $data["s_id"], $data["c_id"], $data["serviceName"], $data["customerName"],
                $data["complaint_status"], $data["complaint"]
            );
            return $adminController->updateAComplaintStatus($complaint);
        }
    }
}


try{
    /**
     * initialise singleton
     */
    $adminController = AdminController::adminController();
    /**
     * responds to the backend, the text returned by this function selectedExecution(a, b);
     */
    echo selectExecution($_GET["executionType"], $adminController);
}catch(Exception $e){
    echo false;// return false if something goes wrong
}
