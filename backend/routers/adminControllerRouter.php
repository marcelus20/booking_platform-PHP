<?php
/**
 * Created by PhpStorm.
 * User: felipe
 * Date: 05/12/18
 * Time: 04:12
 */


include_once "../controllers/AdminController.class.php";
include_once "../models/AdminFormModel.class.php";
include_once "../models/entityRepresentation/ServiceProvider.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";
include_once "../models/entityRepresentation/Complaint.class.php";

session_start();


function selectExecution($executionType, AdminController $adminController){
    switch ($executionType) {
        case "getAllLogs":{
            return json_encode($adminController->getAllLogs());
        }
        case "registerAdmin": {
            $data = json_decode(file_get_contents('php://input'), true);
            $adminFormModel = new AdminFormModel($data["email"], strtoupper(md5($data["password"])), strtoupper(md5($data["confirmPassword"])));
            return $adminController->registerAdmin($adminFormModel);
        }case "getPendentServices":{
            return json_encode($adminController->getPendentServices());
        }
        case "approve":{
            $data = json_decode(file_get_contents('php://input'), true);
            $serviceProvider = new ServiceProvider($data["s_id"], $data["company_full_name"], $data["approved_status"],
                new Location($data["location"]["s_id"], $data["location"]["eir_code"], $data["location"]["second_line_address"],
                   $data["location"]["first_line_address"] , $data["location"]["city"]), []);
            return $adminController->updateServiceStatus($executionType, $serviceProvider);
        }
        case "reprove":{
            $data = json_decode(file_get_contents('php://input'), true);
            $serviceProvider = new ServiceProvider($data["s_id"], $data["company_full_name"], $data["approved_status"],
                new Location($data["location"]["s_id"], $data["location"]["eir_code"], $data["location"]["second_line_address"],
                    $data["location"]["first_line_address"] , $data["location"]["city"]), []);
            return $adminController->updateServiceStatus($executionType, $serviceProvider);
        }
        case "getAllComplaints":{
            return json_encode($adminController->getAllComplaints());
        }
        case "updateComplaintStatus":{
            $data = json_decode(file_get_contents('php://input'), true);
            $complaint = new Complaint(
                $data["complaint_ID"], $data["s_id"], $data["c_id"], $data["serviceName"], $data["customerName"],
                $data["complaint_status"], $data["complaint"]
            );
            return $adminController->updateAComplaintStatus($complaint);
        }
    }
}


try{
    $adminController = AdminController::adminController();
    echo selectExecution($_GET["executionType"], $adminController);
}catch(Exception $e){
    echo false;
}
