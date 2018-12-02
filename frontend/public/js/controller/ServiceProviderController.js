let _serviceProviderController = null;


class ServiceProviderController{

    static serviceProviderController (){
        if(_serviceProviderController == null){
            _serviceProviderController = new ServiceProviderController();
        }

        return _serviceProviderController;
    }


    constructor() {
        this.ROUTING_URL = "http://localhost/booking_platform/backend/routers/serviceProviderRouter.php?executionType=";
        this.listOfCustomers = [];

        const self = this;




        window.addListenerToListItem = (id) => {
            self.listOfCustomers = self.listOfCustomers.map(([c, flag]) => {
                if(parseInt(c.c_id)=== id){
                    return [c,true];
                }else{
                    return [c, false];
                }
            });
            select("customerListView").innerHTML = self.showCustomersResult();
        };

        window.cancelBookingFromCustomerList = (c_id, s_id, timestamp) => {
            fetch(this.ROUTING_URL+"cancelBooking", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body:JSON.stringify({c_id: c_id, s_id: s_id, timestamp:timestamp})
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){
                        alertUpdate("<h1 class='display-1'>You have successfully deleted the booking!</h1>", "success");
                        setTimeout((()=>{
                            self.getListOfCustomers();
                        }), 2000)
                    }else{
                        alertUpdate("<h1 class='display-1'>Something went wrong :((((( sad!</h1>", "danger")
                    }

                })
        };

        window.updateBookingStatus = (c_id, s_id, timestamp) => {
            const b_status = document.querySelector("#change-status").value;
            fetch(this.ROUTING_URL + "updateBooking", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body:JSON.stringify({c_id: c_id, s_id: s_id, timestamp:timestamp, booking_status: b_status} )
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){
                        console.log(text);
                        alertUpdate(`<h1 class='display-1'>
                             You have successfully changed the booking status to ${b_status}!
                         </h1>`, "success");
                        setTimeout((()=>{
                            self.getListOfCustomers();
                        }), 2000)
                    }else{
                        alertUpdate("<h1 class='display-1'>Something went wrong :((((( sad!</h1>", "danger")
                    }
                })
        };

    }

    goToCustomerListPage(){
        this.getListOfCustomers();
    }

    getListOfCustomers () {

        fetch(this.ROUTING_URL+"getCustomersList")
            .then(response=>response.json())
            .then(json=>json.map(c=>[customer(c), false])).then(json=>{
                this.listOfCustomers = json;
                console.log(this.listOfCustomers);
                const customerListDiv = select("customerListView");
                setAnElementClassToVisible("customerListContainer");
                customerListDiv.innerHTML = this.showCustomersResult();
            });
    };

    showCustomersResult (){

        if(this.listOfCustomers.length === 0){//IF IT HAS NO RESULTS TO DISPLAY
            alertUpdate("<h2> You have no customer yet to display, have you inserted booking slots yet?</h3>", "info");
            return "";
        }else{
            return `
                <h3 class="display-3">Click on the row of the list below to see booking details</h3>
                <div class="list-group">
                ${
                this.listOfCustomers.reduce((acc, [customer, flag])=>acc +`
                 <a href="#" class="list-group-item list-group-item-action" id="customer${customer.c_id}" 
                 onclick="addListenerToListItem(${customer.c_id})">
                    <ul class="list-inline">
                        <li>${customer.first_name}</li>
                        <li>${customer.last_name}</li>
                    </ul>
                 </a>
                 <a class="list-group-item list-group-item-action" id="collapsed${customer.c_id}">
                    ${flag?this.collapseCustomer(customer):""}
                 </a>
                `, "")}
                </div>
            `;
        }
    };

    collapseCustomer (customer) {

        console.log(this.listOfCustomers);

        const bookingStatusArray = ["CONFIRMED", "COMPLETE", "PENDENT", "USER_DID_NOT_ARRIVE"];
        return customer.bookingSlots.reduce((acc, slot, i)=>acc + `
                <h5 class="display-5">#${i+1}º</h5>
                    <table class="table">
                        <thead class="thead-dark">
                            <tr>
                                <th scope="col">Date And Time</th>
                                <th scope="col">Status</th>
                                <th scope="col">Review</th>
                            </tr>
                            <tr>
                                <td>${slot.timestamp}</td>
                                <td>${slot.booking.booking_status}</td>
                                <td>${slot.booking.review}</td>
                                <td rowspan="2">
                                    <form>
                                        PS: bookings with the COMPLETE <br>status can't be cancelled or changed status!<br>
                                        <button type="button" class="btn btn-danger" ${
                                slot.booking.booking_status === "COMPLETE" ? "disabled = \"true\"":""
                                } onclick="cancelBookingFromCustomerList(${customer.c_id}, ${slot.s_id}, '${slot.timestamp}')" >Cancel Appointment</button>
                                      
                                    </form>
                                    <div class="form-group">
                                        <label for="changeStatus">Set booking status to:</label>
                                        <select class="form-control" id="change-status" ${
                                slot.booking.booking_status === "COMPLETE" ? "disabled = \"true\"":""
                                } onchange="updateBookingStatus(${customer.c_id}, ${slot.s_id}, '${slot.timestamp}')">
                                            <option value="" selected disabled hidden>Select here an option</option>
                                            ${bookingStatusArray.map(status=>`<option>${status}</option>`).reduce((acc, next)=>acc+next)}
                                        </select>
                                     </div>
                                </td>
                            </tr>
                        </thead>
                    </table>
                    <hr>
        `, "");
    };



}