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

        const renderActiviityLogToView = (data) => {
            const createAdminDiv = select("activity");
            console.log(data);
            createAdminDiv.innerHTML += `
            <ul class="list-group">
                ${data.map(logObject=>`
                <li class="list-group-item">
                    <ul class="list-inline">
                        <li class="list-inline-item">${logObject.logId}</li>
                        <li class="list-inline-item">${logObject.id}</li>
                        <li class="list-inline-item">${logObject.activity_log}</li>
                    </ul>
                </li>`).reduce((acc, item)=>acc+item, "")}
            </ul>
            `
        };

        window.retrieveLogsFromServer = () => {
            fetch(self.ROUTING_URL+"getAllLogs")
                .then(response=>response.json())
                .then(json=>{
                    renderActiviityLogToView(json);
                });
        }
    }



    goToActivitiesTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        setAnElementToInvisible(createAdminArea);
        setAnElementToInvisible(complaintArea);
        setAnElementToVisible(viewActivity);
        retrieveLogsFromServer();
    }

    goToAComplaintTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        setAnElementToInvisible(createAdminArea);
        setAnElementToInvisible(viewActivity);
        setAnElementToVisible(complaintArea);
    }




    goToAnotherAdminTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");

        setAnElementToInvisible(viewActivity);
        setAnElementToInvisible(complaintArea);
        setAnElementToVisible(createAdminArea);

    }

    registerNewAdmin(newAdmin){
        fetch(this.ROUTING_URL+"registerAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(newAdmin)
        }).then(response=>response.text())
            .then(text=>{
                console.log(text);
                if(text==1){
                    alertUpdate(`<h1 class="display-1">You have sccessfully registered admin ${newAdmin.email}! You will be redirected to home in 10 seconds</h1>`, "success", 10000);
                    setTimeout(()=>window.location.replace("/booking_platform/dashboard.html"), 10000);
                }else{
                    alertUpdate(`<h1 class="display-1">Something went wrong. This new Admin email ${newAdmin.email} might have already recorded into the db or db is offline</h1>`, "danger", 6000);
                }
            });
    }
}