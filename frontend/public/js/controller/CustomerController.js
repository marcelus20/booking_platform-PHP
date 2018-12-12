let _customerController = null;



class CustomerController{

    constructor(){
        this.serviceProviders = [];
        this.listOfBookings = [];
        this.listOfServiceProvidersBookedWith = [];
        this.CUSTOMER_ROUTER_URL = "/booking_platform/backend/routers/customerControllerRouter.php?executionType=";


        const self = this;
        window.addRowAListener = (id)=>{
            self.serviceProviders = self.serviceProviders.map(([serviceProvider, flag])=>{
                if(parseInt(serviceProvider.s_id ) === id){
                    return [serviceProvider, true];
                }else{
                    return [serviceProvider, false];
                }
            });

            const [[barber]] = self.serviceProviders.filter(([serviceProvider, flag])=>parseInt(serviceProvider.s_id )=== id);
            fetch(self.CUSTOMER_ROUTER_URL+"searchBookingSlots", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(barber)
            }).then(response=>response.json())
                .then(json=>{
                    self.serviceProviders = self.serviceProviders.map(([serviceProvider, flag])=>{
                        if(parseInt(serviceProvider.s_id)=== id){
                            return[serviceProvider.withBookingSlots(json), flag];
                        }else{
                            return [serviceProvider, flag];
                        }
                    });
                    // row.innerHTML = "";
                    select("barberSearchBody").innerHTML = self.fetchToHTML(self.serviceProviders);
                    // console.log(self.fetchToHTML(self.serviceProviders));

                });

        };

        window.addColapsedListAnEventListener = (barberId, timestamp) => {
            self.listOfBookings = self.listOfBookings.map(([barber, flag])=>{
                if(parseInt(barber.s_id ) === barberId && barber.bookingSlots[0].timestamp === timestamp ){
                    return [barber, true];
                }else{
                    return [barber, false];
                }
            });

            select("displayBookingsList").innerHTML = self.displayBookings();

        };

        window.book = (id, timestamp) => {
            const [[barber]] = self.serviceProviders.filter(([serviceProvider, flag])=>parseInt(serviceProvider.s_id )=== id);
            const [bookingSlot] = barber.bookingSlots.filter(booking_slot=>parseInt(booking_slot.s_id )=== id && booking_slot.timestamp === timestamp);
            return fetch(self.CUSTOMER_ROUTER_URL+"bookSlot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(bookingSlot.withBooking(new Booking("PENDENT", "NO_REVIEW_ADDED")))
            }).then(response=>response.text())
                .then(text=>{
                    if (parseInt(text) === 1){

                        select("barberSearchBody").innerHTML = "";
                        setAnElementClassToInvisible("searchBarberResult");
                        alertUpdate(`<h1>You have just booked with ${barber.company_full_name}</h1>`, "success");
                        self.retrieveBookings();
                    } else{
                        alertUpdate(`<h1>Something went wrong</h1>`, "danger");
                    }
                });
        };

        window.cancelBooking =  (barberId) =>{

            const [[{bookingSlots:[bookingSlot]}]] = this.listOfBookings.filter(([{s_id}])=>parseInt(s_id) === barberId);
            fetch(self.CUSTOMER_ROUTER_URL+"cancelBooking",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(bookingSlot)
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){
                        alertUpdate("<h1>Booking deleted successfully!</h1>", "success");
                        self.retrieveBookings();
                    }else{
                        alertUpdate("<h1>Something went wrong :((((</h1>", "danger");
                    }

                });
        };

        window.updateReview = (barberId) => {

            const combo = select("reviewSelect");

            if(combo.value !== ""){
                const [[{bookingSlots:[bookingSlot]}]] = self.listOfBookings.filter(([barber])=>parseInt(barber.s_id) === barberId);

                bookingSlot.booking.review = combo.value;
                fetch(self.CUSTOMER_ROUTER_URL+"updateReview", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(bookingSlot)
                }).then(response=>response.text())
                    .then(text=>{
                        if(text === "1"){
                            alertUpdate("<h1>Review updated successfuly successfully!</h1>", "success");
                            self.retrieveBookings();
                        }else{
                            alertUpdate("<h1>Something went wrong :((((</h1>", "danger");
                        }

                    });

            }else{
                alertUpdate("<h1>This is not a valid entry!</h1>", "danger");
            }


        };

        window.toggleCustomerComplaintForm = (barberId) =>{
            self.listOfServiceProvidersBookedWith = self
                .listOfServiceProvidersBookedWith.map(([service, flag])=>{
                    if(service.s_id == barberId){
                        return [service, true];
                    }else{
                        return [service, false];
                    }
                });
            fetchListOfProvidersBookedWith();
        };


        window.sendComplaintToServer = (complaint) => {
            fetch(self.CUSTOMER_ROUTER_URL+"insertComplaint",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(complaint)
                })
                .then(response=>response.text())
                .then(text=>{
                    if(text == 1){
                        alertUpdate("Your complaint has been sent. Our administrators will handle it soon", "success");
                        setTimeout(()=>{
                            goToHome();
                        }, 2000);
                    }else{
                        alertUpdate("Something went wrong", "danger");
                    }
                });
        };

        window.submitComplaint = (barber_id) => {
            const [[customerComplaintModel]] = self.listOfServiceProvidersBookedWith
                .filter(([result, flag])=>result.s_id == barber_id);

            const complaint = new Complaint("",
                customerComplaintModel.s_id,
                "",
                customerComplaintModel.company_full_name,
                "", select("complaintTextArea").value);

            if(complaint.complaint.trim().length > 0){
                //SEND
                sendComplaintToServer(complaint);

            }else{
                alertUpdate("You have not typed anything", "danger");
            }

        };

        window.fetchListOfProvidersBookedWith = () => {
            const tableBody = select("makeAcomplaintTableBody");
            tableBody.innerHTML = self.listOfServiceProvidersBookedWith
                .reduce((acc, [result, flag])=>acc+`
                    <tr class="clickable" onclick="toggleCustomerComplaintForm(${result.s_id})">
                        <td>${result.company_full_name}</td>
                        <td>${result.times_booked}</td>
                    </tr>
                    ${flag?`
                        <tr>
                            <td>
                                <h4 class="display-4">Tell us what happened</h4>
                                <textarea name="" id="complaintTextArea" rows="3" class="form-control"></textarea>
                            </td>
                            <td>
                                <button type="button" class="btn btn-warning" 
                                onclick="submitComplaint(${result.s_id})">Submit Complaint</button>
                            </td>
                        </tr>
                    `:""}
                `, "");
        };

        window.retrieveBarbersListFromServer = () => {
            fetch(self.CUSTOMER_ROUTER_URL+"selectBarbersBooked")
                .then(response=>response.json())
                .then(json=>{
                    setAnElementToInvisible(select("searchBarberResult"));
                    setAnElementToInvisible(select("instructions"));
                    self.listOfServiceProvidersBookedWith = json.map(result=>[result, false]);
                    fetchListOfProvidersBookedWith();
                });
        }

    }

    static customerController (){
        if(_customerController == null){
            _customerController = new CustomerController();
        }

        return _customerController;
    }

    drawCollapsedBarber(barber){
        if(barber.bookingSlots.length > 0){
            return `
                <h1 class="display-1">Booking Slots with the Service ${barber.company_full_name}</h1>
                <ul class="list-group">
                    ${
                barber.bookingSlots.reduce(((acc, item)=>acc +
                `
                    <li class="list-group-item">${item.timestamp}
                        <button type="button" class="btn btn-primary" onclick="book(${item.s_id}, '${item.timestamp}')">Book this slot</button>
                    </li>
                `
                ), "")
                }    
                </ul>
            `;

        }else{
            return `
            <div class="alert alert-info" role="alert">
                <h1>Oh, snap!</h1>
                The provider ${barber.company_full_name} has no available slots at the moment.
            </div>`;
        }
    };

    fetchToHTML (serviceProviders)  {
        setAnElementToVisible(select("instructions"));
        setAnElementToInvisible(select("makeComplaintArea"));
        return serviceProviders.reduce(((acc, [barber, flag])=>acc+`
            <tr onclick="addRowAListener(${barber.s_id})" class="clickable">
                <td><strong>${barber.company_full_name}</strong></td>
                <td>${barber.location.city}</td>    
            </tr>    
            ${flag?`
            <tr>
                <td colspan="2" id="slo ts${barber.s_id}">${this.drawCollapsedBarber(barber)}</td>
            </tr>`:""}`), "");
    };

    searchBarber (barberSearchModel){
        return fetch(this.CUSTOMER_ROUTER_URL+"searchBarbers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(barberSearchModel)
        })
            .then(response=>response.json())
            .then(json=>{
                this.serviceProviders = json.map(sp=>[serviceProvider(sp), false]);
                select("barberSearchBody").innerHTML = this.fetchToHTML(this.serviceProviders);
            });
    };




    makeAComplaint(){
        setAnElementToVisible(select("makeComplaintArea"));
        retrieveBarbersListFromServer();

    }


    retrieveBookings () {

        fetch(this.CUSTOMER_ROUTER_URL+"getAllBookings")
            .then(response=>response.json())
            .then(json=>json.map(booking=>[booking, false]))
            .then(json=> {
                this.listOfBookings = json;
                setAnElementClassToVisible("displayBookingsDiv");
                setAnElementToInvisible(select("instructions"));
                setAnElementToInvisible(select("customerHome"));
                setAnElementToInvisible(select("makeComplaintArea"));
                setAnElementToInvisible(select("searchBarberResult"));
                select("displayBookingsList").innerHTML = this.displayBookings();
            });
    };


    displayBookings (){
        if(this.listOfBookings.length > 0){
            return `
                <h1 class="display-1">List of Bookings</h1>
                <h2 class="display-2">please, click on one of the table rows to display more options</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date and time</th>
                            <th>Barber / Hairdresser</th>
                            <th>Address line 1</th>
                            <th>Address line 2</th>
                            <th>City</th>
                            <th>Booking Status</th>
                            <th>Review</th>
                        </tr>
                    </thead>
                    <tbody>
                           
            `+this.listOfBookings.reduce((acc,[{s_id, company_full_name,
                location, bookingSlots:[bookingSlot_]}, flag])=>acc+
                `
                    <tr class="clickable" onclick="addColapsedListAnEventListener(${s_id}, '${bookingSlot_.timestamp}')">
                        <td>${bookingSlot_.timestamp}</td>
                        <td>${company_full_name}</td>
                        <td>${location.first_line_address}</td>
                        <td>${location.second_line_address}</td>
                        <td>${location.city}</td>
                        <td>${bookingSlot_.booking.booking_status}</td>
                        <td>${bookingSlot_.booking.review}</td>
                    </tr>
                    ${flag?
                    `<tr><td colspan="7">${showColapsedBooking(s_id, bookingSlot_.booking.booking_status)}</td></tr>`
                    :""}
                `, "")+`</tbody></table>`;
        }else {
            return "<div class=\"alert alert-info\" role=\"alert\"><h2>You have no bookings at the moment to display</h2></div>";
        }

    };




}

