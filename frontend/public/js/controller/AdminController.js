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

        this.listOfServicesProviders = [];
        this.listOfComplaints = [];


        const self = this;

        const renderActiviityLogToView = (data) => {
            const activityDiv = select("activity");
            console.log(data);
            activityDiv.innerHTML += `
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
        };

        window.toggleService = (serviceId) => {
            const listOfServices = [...self.listOfServicesProviders];
            self.listOfServicesProviders = listOfServices.map(([s,flag])=>{
                if(s.s_id == serviceId){
                    flag = true;
                }else{
                    flag = false;
                }
                return [s, flag];
            });
            console.log(self.listOfServicesProviders);
            renderServicesToView();
        };



        window.updateBarberStatus = (routingUrl, [[serviceProvider]]) => {
            if(routingUrl === "approve"){
                serviceProvider.approved_status = 'APPROVED';
            }
            console.log(routingUrl, serviceProvider);
            fetch(self.ROUTING_URL+routingUrl,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(serviceProvider)
            }).then(response=>response.text())
                .then(text=>{
                    if(text == 1){
                        if(routingUrl === "approve"){
                            alertDiv(`<h1 class="display-1">
                                You have successfully approved ${serviceProvider.company_full_name}
                            </h1> `, "success",4000 , select("pendentServices"));
                        }else{
                            alertDiv(`<h1 class="display-1">
                                You have reproved ${serviceProvider.company_full_name}
                            </h1> `, "info", 4000, select("pendentServices"));
                        }
                    }else{
                        console.log(text);
                        alertDiv(`<h1 class="display-1">
                                Something went terribly wrong, this page will update in 10 seconds
                            </h1> `, "warning", 4000, select("pendentServices"));
                    }

                    setTimeout(()=>{
                        self.goToPendentServicesPage();
                    }, 4000);
                })
        };

        window.approve = (service_id) =>{
            updateBarberStatus("approve", self.listOfServicesProviders.filter(([service]) =>service
                .s_id ==service_id));
        };

        window.reprove = (service_id) =>{
            updateBarberStatus("reprove", self.listOfServicesProviders.filter(([service])=>service
                .s_id ==service_id));
        };


        window.renderServicesToView = () => {
            const pendentList = select("pendentServices");
            pendentList.innerHTML = `
            <h1 class="display-1">Pendent Service Providers</h1>
            <h3 class="display-1">click on one of the rows to toggle options</h3>
            <ul class="list-group">
                ${self.listOfServicesProviders.map(([service, flag])=>`
                <li class="list-group-item" onclick="toggleService(${service.s_id})">
                    <ul class="list-inline">
                        <li class="list-inline-item">${service.company_full_name}</li>
                        <li class="list-inline-item">${service.approved_status}</li>
                        <!--<li class="list-inline-item">${service.activity_log}</li>-->
                    </ul>
                </li>
                ${flag?`<li class="list-group-item" id="${service.s_id}">
                    <h2 class="display-2">${service.company_full_name} details:</h2>
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Address First Line</th>
                                <th>Address Second Line</th>
                                <th>City</th>
                                <th>Eir Code</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${service.location.first_line_address}</td>
                                <td>${service.location.second_line_address}</td>
                                <td>${service.location.city}</td>
                                <td>${service.location.eir_code}</td>
                            </tr>   
                            <tr>
                                <td colspan="2"><button class="btn btn-success" onclick="approve(${service.s_id})">Approve</button></td>
                                <td colspan="2"><button class="btn btn-danger" onclick="reprove(${service.s_id})">Reject!</button></td>
                            </tr>                      
                        </tbody>
                    </table>
                </li>`:""}
                
                `).reduce((acc, item)=>acc+item, "")}
            </ul>
            `;
        };

        window.retrievePendentServiceProviders = () =>{
            fetch(self.ROUTING_URL+"getPendentServices")
                .then(response=>response.json())
                .then(json=>{
                    if(json.length == 0){
                        alertDiv("<h3 class='display-3'>You are all caught up! There are no Pendent Service Providers</h3>",
                            "info", 0, select("pendentServices"))
                    }else{
                        self.listOfServicesProviders = json.map(services=>[services, false]);
                        renderServicesToView();
                    }
                });
        };


        window.toggleComplaintOptions = (complaint_ID) => {
            self.listOfComplaints = self.listOfComplaints.map(([complaint, flag])=>{
                if (complaint.complaint_ID == complaint_ID){
                    return [complaint, true];
                }else{
                    return [complaint, false];
                }
            })
            console.log(self.listOfComplaints);
            drawComplaintTable();
        };

        window.sendToServer = (complaint) => {
            fetch(self.ROUTING_URL+"updateComplaintStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(complaint)
            }).then(response=>response.text())
                .then(text=>{
                    if(text == 1){
                        alertUpdate("You have successfully updated status!", "success", 2000);
                        setTimeout(()=>{
                            this.goToAComplaintTab();
                        }, 2000)
                    }else{
                        alertUpdate("Something went terribly wrong!", "danger", 2000);
                    }
                })
        };

        window.updateComplaintStatus = (complaintID) => {
            const status = select("selectComplaint").value;
            const [[complaint]] = self.listOfComplaints.filter(([comp, flag])=> comp.complaint_ID == complaintID);
            complaint.complaint_status = status;
            sendToServer(complaint);
        };

        window.drawComplaintTable = () => {
            const complaintStatus = ["PENDENT", "PROCESSING", "FINISHED"];
            const tableBody = select("complaintTableBody");
            tableBody.innerHTML = self.listOfComplaints.reduce((acc, [complaint, flag])=>acc+`
                <tr class="clickable" onclick="toggleComplaintOptions(${complaint.complaint_ID})">
                    <td>${complaint.complaint_ID}</td>
                    <td>${complaint.serviceName}</td>
                    <td>${complaint.customerName}</td>
                    <td>${complaint.complaint_status}</td>
                    <td>${complaint.complaint}</td>
                </tr>
                ${flag?`<tr>
                            <td><h2 class="display-2">${complaint.complaint_ID}</h2></td>
                            <td><h4 class="display-4">Change Status</h4></td>
                            <td colspan="3"><select id="selectComplaint" class="form-control">${complaintStatus.reduce((acc, item)=>acc+`
                                        <option value="${item}">${item}</option>
                                    `, "")}</select>
                            </td>
                            <td>
                                <button class="btn btn-success" 
                                onclick="updateComplaintStatus(${complaint.complaint_ID}
                                , ${self.selectedComplaint})">Update Complaint Status</button>
                            </td>
                            
                        </tr>`:""}
            `, "");
        };

        window.retrieveComplaintsData = () => {
            fetch(self.ROUTING_URL+"getAllComplaints")
                .then(response=>response.json())
                .then(json=>{
                    self.listOfComplaints = json.map(complaint=>[complaint,false]);
                    drawComplaintTable()
                });
        };
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




    goToPendentServicesPage(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);
        setAnElementToInvisible(viewActivity);
        setAnElementToInvisible(complaintArea);
        setAnElementToInvisible(createAdminArea);
        setAnElementToVisible(pendentServices);
        retrievePendentServiceProviders();
    }



    goToAComplaintTab(){
        console.log("admin");
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);
        setAnElementToInvisible(createAdminArea);
        setAnElementToInvisible(viewActivity);
        setAnElementToVisible(complaintArea);
        retrieveComplaintsData();
    }




    goToAnotherAdminTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);
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