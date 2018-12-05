let _adminController = null;

class AdminController{

    static adminController(){
        if(_adminController == null){
            _adminController= new AdminController();
        }

        return _adminController;
    }


    constructor() {
        this.ROUTING_URL = "/booking_platform/backend/routers/adminControllerRouter.php?executionType=";

        const self = this;
        window.retrieveLogsFromServer = () => {
            fetch(self.ROUTING_URL+"getAllLogs")
                .fetch(response=>response.json())
                .fetch(json=>{
                    console.log(json)
                });
        }
    }

    goToActivitiesTab(){
        alert("activities");
    }

    goToAComplaintTab(){
        alert("complaints")
    }




    goToAnotherAdminTab(){
        const createAdminDiv = select("createAdmin");
        setAnElementToVisible(createAdminDiv);
        retrieveLogsFromServer();
    }
}