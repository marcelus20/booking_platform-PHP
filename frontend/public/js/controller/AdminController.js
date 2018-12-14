let _adminController = null;

/**
 * AdminController class.
 *
 * This class will handle the admin user's action and send requests to the backend structure using the so called AJAX
 * Asynchronous Javascript AND XML to the PHP routers backend class.
 */
class AdminController{

    /**
     * Singleton Instance initialise
     * @returns {*} the instance itself
     */
    static adminController(){
        if(_adminController == null){// if null, initialise it
            _adminController= new AdminController();
        }

        return _adminController; // return instance
    }

    /**
     * construtor will handle all the attributes and windows functions
     */
    constructor() {
        this.ROUTING_URL = "/booking_platform/backend/routers/adminControllerRouter.php?executionType=";

        this.listOfServicesProviders = [];
        this.listOfComplaints = [];

        /**
         * in the window object, the word this refers to the window object, not this class. so I am calling
         * this from this class self, and every tim I need to use this keyword inside a window object, I will be calling
         * self instead.
         * @type {AdminController}
         */
        const self = this;

        /**
         * fetch to HTML the data passed as paramenter
         * @param data
         */
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

        /**
         * Sends an HTTP GET request to adminControllerRouter in PHP backend scripts and gets the JSON as response
         * from the server
         */
        window.retrieveLogsFromServer = () => {
            fetch(self.ROUTING_URL+"getAllLogs")
                .then(response=>response.json())
                .then(json=>{// JSON is the response
                    renderActiviityLogToView(json);// call the renderActivity method
                });
        };

        /**
         * change the flag (show=true, not show=false) in order to show the extra HTML content in table view.
         * @param serviceId
         */
        window.toggleService = (serviceId) => {
            const listOfServices = [...self.listOfServicesProviders];
            self.listOfServicesProviders = listOfServices.map(([s,flag])=>{// looping through the tuples
                if(s.s_id == serviceId){ // if match with parameter, return true
                    flag = true;
                }else{
                    flag = false;
                }
                return [s, flag];
            });
            //redraw HTML with the change in the state (listOfServicesProviders)
            renderServicesToView();
        };


        /**
         * Sends a POST request with the data about the new serviceProvider instance with the new Status to PHP
         * router file, gets the reponse from server and alerts user whether the update was succesfull or not.
         * @param routingUrl
         * @param serviceProvider
         */

        window.updateBarberStatus = (routingUrl, [[serviceProvider]]) => {
            if(routingUrl === "approve"){// if GET URL QUERY STRING IS "approve"
                serviceProvider.approved_status = 'APPROVED'; // set object attribute to approve
            }
            fetch(self.ROUTING_URL+routingUrl,{// SENDS THE HTTP POST REQUEST TO ROUTER SERVER
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(serviceProvider)// DATA TO SEND OVER TO PHP ROUTER
            }).then(response=>response.text())
                .then(text=>{
                    if(text == 1){ // IF SUCESSFULL
                        if(routingUrl === "approve"){
                            alertDiv(`<h1 class="display-1">
                                You have successfully approved ${serviceProvider.company_full_name}
                            </h1> `, "success",4000 , select("pendentServices"));
                        }else{
                            alertDiv(`<h1 class="display-1">
                                You have reproved ${serviceProvider.company_full_name}
                            </h1> `, "info", 4000, select("pendentServices"));
                        }
                    }else{// IF NOT SUCESSFULL
                        console.log(text);
                        alertDiv(`<h1 class="display-1">
                                Something went terribly wrong, this page will update in 10 seconds
                            </h1> `, "warning", 4000, select("pendentServices"));
                    }
                    //WAIT 4 SECONDS TO RELOAD PAGE
                    setTimeout(()=>{
                        self.goToPendentServicesPage();
                    }, 4000);
                })
        };

        /**
         * calls function updateBarberStatus(a, b) with the "approve" passed as parameter with along with the filtered
         * serviceprovider in the list of Services Providers
         * @param service_id -> used to filter service provider in the list
         */
        window.approve = (service_id) =>{
            updateBarberStatus("approve", self.listOfServicesProviders.filter(([service]) =>service
                .s_id ==service_id));
        };

        /**
         * calls function updateBarberStatus(a, b) with the "repprove" string passed as parameter along with the filtered
         * serviceprovider in the list of Services Providers
         * @param service_id
         */
        window.reprove = (service_id) =>{
            updateBarberStatus("reprove", self.listOfServicesProviders.filter(([service])=>service
                .s_id ==service_id));
        };


        /**
         * This function fetch to HTML the list of service providers in table FORMAT
         * using the data populated in the listOfServicesProviders array
         */
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

        /**
         * it sends an GET request to PHP router and gets a JSON data from server.
         */
        window.retrievePendentServiceProviders = () =>{
            fetch(self.ROUTING_URL+"getPendentServices") // AJAX GET request
                .then(response=>response.json())
                .then(json=>{
                    if(json.length == 0){// if array is empty
                        alertDiv("<h3 class='display-3'>You are all caught up! There are no Pendent Service Providers</h3>",
                            "info", 0, select("pendentServices"))
                    }else{// if there is result, update list of servicesProviders and call method that will fetch it to HTML
                        self.listOfServicesProviders = json.map(services=>[services, false]);
                        renderServicesToView();
                    }
                });
        };


        /**
         * it will switch the flag to SHOW or not SHOW the complaints details from the listOFComplents global array.
         * @param complaint_ID
         */
        window.toggleComplaintOptions = (complaint_ID) => {
            self.listOfComplaints = self.listOfComplaints.map(([complaint, flag])=>{
                if (complaint.complaint_ID == complaint_ID){// if matches with parameter
                    return [complaint, true];// show complaint
                }else{
                    return [complaint, false]; // do not show complaint
                }
            });
            //after the update, redraw/re-render it in HTML with the new state
            drawComplaintTable();
        };

        /**
         * it sends a complaint through POST method to PHP router and gets the response from server
         * whether this was success or not and UPDATE the HTML with an alert.
         * @param complaint
         */
        window.sendToServer = (complaint) => {
            fetch(self.ROUTING_URL+"updateComplaintStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(complaint)// <- complaint to be sent by POST
            }).then(response=>response.text())
                .then(text=>{
                    if(text == 1){// if successfull
                        alertUpdate("You have successfully updated status!", "success", 2000);
                        setTimeout(()=>{
                            this.goToAComplaintTab();
                        }, 2000)
                    }else{// if not successfull
                        alertUpdate("Something went terribly wrong!", "danger", 2000);
                    }
                })
        };

        /**
         * it updates the status of the complaint object and sends it over to sendToServer(complaint) method.
         * @param complaintID -> used to filter the complaint to be updated from listOfComplaints array
         */
        window.updateComplaintStatus = (complaintID) => {
            const status = select("selectComplaint").value; // getting from HTML select tag
            //filtering the array of listOfocmplaints with the complaint with the ID passed taken as parameter
            const [[complaint]] = self.listOfComplaints.filter(([comp, flag])=> comp.complaint_ID == complaintID);
            complaint.complaint_status = status; // update with the new status
            sendToServer(complaint); // call senToServer () method
        };

        /**
         * draw in HTML the list of complaint stored in the array of listOfComplaints []
         */
        window.drawComplaintTable = () => {
            //options in the select tag
            const complaintStatus = ["PENDENT", "PROCESSING", "FINISHED"];
            const tableBody = select("complaintTableBody");
            if(self.listOfComplaints.length != 0){
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
            }else{
                alertUpdate("<h1 class='display-1'>You are all caught up! no complaints has been added yet!</h1>", "info", 0);
            }

        };

        /**
         * it sends a GET request to PHP url router and gets the list of complaints by response and populate the array of
         * complaints with the results and then draws to HTML
         */
        window.retrieveComplaintsData = () => {
            fetch(self.ROUTING_URL+"getAllComplaints") // sending over GET REQUEST to router
                .then(response=>response.json())// gets reponse from PHP server
                .then(json=>{
                    /**
                     * maps json array to a tuple of complaints and false (do not show complaint form)
                     * @type {Uint8Array | BigInt64Array | *[][] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
                     */
                    self.listOfComplaints = json.map(complaint=>[complaint,false]);
                    drawComplaintTable()// draw the table of complaints in HTML
                });
        };
    }


    /**
     * after user clicks on the tab activities, this function is triggered.
     * redirects to the logs page
     */
    goToActivitiesTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        setAnElementToInvisible(createAdminArea);// make invisible in html
        setAnElementToInvisible(complaintArea);//make invisible in html
        setAnElementToVisible(viewActivity);//make visible in html
        retrieveLogsFromServer(); // call function that retrives logs
    }


    /**
     * After admin clicks on pendent services tab, this function is triggered
     * redirects to pendent services list page
     */
    goToPendentServicesPage(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);// make invisible in html
        setAnElementToInvisible(viewActivity);// make invisible in html
        setAnElementToInvisible(complaintArea);// make invisible in html
        setAnElementToInvisible(createAdminArea);// make invisible in html
        setAnElementToVisible(pendentServices);// make visible in html
        retrievePendentServiceProviders();// call the function that will prepare the data
    }


    /**
     * After admin clicks on the complaint tab, this function is triggered
     * redirects complaints list page
     */
    goToAComplaintTab(){
        console.log("admin");
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);// make invisible in html
        setAnElementToInvisible(createAdminArea);// make invisible in html
        setAnElementToInvisible(viewActivity);// make invisible in html
        setAnElementToVisible(complaintArea);// make visible in html
        retrieveComplaintsData(); // call retriveComplaintsData function
    }




    goToAnotherAdminTab(){
        const viewActivity = select("activity");
        const createAdminArea = select("createAdmin");
        const complaintArea = select("complaintArea");
        const pendentServices = select("pendentServices");
        setAnElementToInvisible(pendentServices);// make invisible in html
        setAnElementToInvisible(viewActivity);// make invisible in html
        setAnElementToInvisible(complaintArea);// make invisible in html
        setAnElementToVisible(createAdminArea);// make visible in html

    }

    /**
     * This method sends an POST request to PHP router with the new user Admin information, and gets a response
     * from the server whether it was successfull or not and alerts the HTML with the result
     * @param newAdmin
     */
    registerNewAdmin(newAdmin){
        fetch(this.ROUTING_URL+"registerAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(newAdmin)//<- admin to be sent by POST
        }).then(response=>response.text())
            .then(text=>{
                console.log(text);
                if(text==1){// if successsfull
                    alertUpdate(`<h1 class="display-1">You have sccessfully registered admin ${newAdmin.email}! You will be redirected to home in 10 seconds</h1>`, "success", 10000);
                    setTimeout(()=>window.location.replace("/booking_platform/dashboard.html"), 10000);
                }else{// if not successfull
                    alertUpdate(`<h1 class="display-1">Something went wrong. This new Admin email ${newAdmin.email} might have already recorded into the db or db is offline</h1>`, "danger", 6000);
                }
            });
    }
}