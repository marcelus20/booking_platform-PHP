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

        const renderToView = (data) => {
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
            //     "<ul class list-group>"+
            // data.reduce((acc, logObject)=>acc + `<li class="list-inline">
            //                 <ul class="list-inline">
            //                     <li class="list-inline-item">${logObject.logId}</li>
            //                     <li class="list-inline-item">${logObject.id}</li>
            //                     <li class="list-inline-item">${logObject.activity_log}</li>
            //                 </ul>
            //             </li>`
            // , "") + "</ul>";

        };

        window.retrieveLogsFromServer = () => {
            fetch(self.ROUTING_URL+"getAllLogs")
                .then(response=>response.json())
                .then(json=>{
                    renderToView(json);
                });
        }
    }



    goToActivitiesTab(){
        const createAdminDiv = select("activity");
        setAnElementToVisible(createAdminDiv);
        retrieveLogsFromServer();
    }

    goToAComplaintTab(){
        alert("complaints")
    }




    goToAnotherAdminTab(){
        alert("another admin")
    }
}