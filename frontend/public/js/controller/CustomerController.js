let _customerController = null;

/**
 * CustomerController Class
 *This class will handle the admin user's action and send requests to the backend structure using the so called AJAX
 * Asynchronous Javascript AND XML to the PHP routers backend class.
 */

class CustomerController{


    /**
     * Singleton Instance initialise
     * @returns {*} the instance itself
     */
    static customerController (){
        if(_customerController == null){
            _customerController = new CustomerController();
        }

        return _customerController;
    }

    /**
     * consturtor: initialises 4 main global attributes.
     */
    constructor(){
        this.serviceProviders = []; // for the service provider table
        this.listOfBookings = []; // list of booking for the bookings view page
        this.listOfServiceProvidersBookedWith = []; // for the complaints page
        //the php router responseble to handle the HTTP requests
        this.CUSTOMER_ROUTER_URL = "/booking_platform/backend/routers/customerControllerRouter.php?executionType=";


        /**
         * in the window object, the word this refers to the window object, not this class. so I am calling
         * this from this class self, and every tim I need to use this keyword inside a window object, I will be calling
         * self instead.
         * @type {CustomerController}
         */
        const self = this;


        /**
         * gives each row of an HTML table tag a onclick listener
         * The action triggered is to switch to show or do not show line details (true or false)
         * @param id
         */
        window.addRowAListener = (id)=>{
            self.serviceProviders = self.serviceProviders.map(([serviceProvider, flag])=>{
                if(parseInt(serviceProvider.s_id ) === id){
                    return [serviceProvider, true];// show details of service provider
                }else{
                    return [serviceProvider, false];// do not show details of service provier
                }
            });
            //gets the the right barber in the list of service providers by filtering by id.
            const [[barber]] = self.serviceProviders.filter(([serviceProvider, flag])=>parseInt(serviceProvider.s_id )=== id);
            fetch(self.CUSTOMER_ROUTER_URL+"searchBookingSlots", { // sends A POST request
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(barber)//<- service provider to be sent over to the server
            }).then(response=>response.json())
                .then(json=>{ // gets response.
                    self.serviceProviders = self.serviceProviders.map(([serviceProvider, flag])=>{
                        if(parseInt(serviceProvider.s_id)=== id){
                            /**
                             *populate the bookingSlots attribute of the service provider with
                             * data (bookings) obtained from the server
                             */

                            return[serviceProvider.withBookingSlots(json), flag];
                        }else{
                            return [serviceProvider, flag];
                        }
                    });
                    /**
                     * redraw/re-render update to HTML
                     */
                    select("barberSearchBody").innerHTML = self.fetchToHTML(self.serviceProviders);

                });

        };

        /**
         * this function switches details of the bookings slots to show or not show according to the click
         * listener on the table line in HTML
         * @param barberId
         * @param timestamp
         */
        window.addColapsedListAnEventListener = (barberId, timestamp) => {
            self.listOfBookings = self.listOfBookings.map(([barber, flag])=>{
                if(parseInt(barber.s_id ) === barberId && barber.bookingSlots[0].timestamp === timestamp ){
                    return [barber, true]; // show barber details
                }else{
                    return [barber, false]; // do not show barber details
                }
            });

            /**
             * re-render/redraw update to HTML
             * @type {*|string}
             */
            select("displayBookingsList").innerHTML = self.displayBookings();

        };

        /**
         * this function sends a POST request to PHP router with the new BookingSlot that the customer just booked
         * and updates the HTML with a successful message if php returns success or failure message.
         * @param id -> id of the service provider
         * @param timestamp -> timestamp of the slot booked.
         *
         * It will firstly retrive from the list of serviceProviders by filtering by the id, the right service provider.
         * Then it will get the list of booking slots from that service provider and filter it by the timestamp.
         *
         * Once the bookSlot object has been obainted, it is good to be sent as POST request.
         * @returns {Promise<string | never>}
         */
        window.book = (id, timestamp) => {
            const [[barber]] = self.serviceProviders.filter(([serviceProvider, flag])=>parseInt(serviceProvider.s_id )=== id);
            const [bookingSlot] = barber.bookingSlots.filter(booking_slot=>parseInt(booking_slot.s_id )=== id && booking_slot.timestamp === timestamp);
            return fetch(self.CUSTOMER_ROUTER_URL+"bookSlot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(bookingSlot.withBooking(new Booking("PENDENT", "NO_REVIEW_ADDED")))//<- sending booking
            }).then(response=>response.text())
                .then(text=>{
                    if (parseInt(text) === 1){ // if success, alert success

                        select("barberSearchBody").innerHTML = "";
                        setAnElementClassToInvisible("searchBarberResult");
                        alertUpdate(`<h1>You have just booked with ${barber.company_full_name}</h1>`, "success");
                        self.retrieveBookings();
                    } else{ // if not success, alert not sccess
                        alertUpdate(`<h1>Something went wrong</h1>`, "danger");
                    }
                });
        };


        /**
         * This method gets a booking slot from the listOFBookings array and sends a POST request to PHP router to cancel
         * the slots in the database with the same details as the slot sent by POST.
         * @param barberId
         */
        window.cancelBooking =  (barberId) =>{
            // retrieving bookingslots by the service provider ID by filtering the array
            const [[{bookingSlots:[bookingSlot]}]] = this.listOfBookings.filter(([{s_id}])=>parseInt(s_id) === barberId);
            fetch(self.CUSTOMER_ROUTER_URL+"cancelBooking",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(bookingSlot)//<-sending the slot to be cancelled over to the server.
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){//if success
                        alertUpdate("<h1>Booking deleted successfully!</h1>", "success");
                        self.retrieveBookings();
                    }else{// if it failed
                        alertUpdate("<h1>Something went wrong :((((</h1>", "danger");
                    }

                });
        };

        /**
         * updates a booking slots review attribute and sends it over to the PHP router
         * @param barberId
         */
        window.updateReview = (barberId) => {

            const combo = select("reviewSelect"); // gets the html select tag

            if(combo.value !== ""){ // if select tag has no blank option, retrieve from the array the proper booking slot
                const [[{bookingSlots:[bookingSlot]}]] = self.listOfBookings.filter(([barber])=>parseInt(barber.s_id) === barberId);

                bookingSlot.booking.review = combo.value; // populate the revire attribute with the value in the html select tag
                fetch(self.CUSTOMER_ROUTER_URL+"updateReview", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(bookingSlot) // sends it over by POST request
                }).then(response=>response.text())
                    .then(text=>{
                        if(text === "1"){// if successfull
                            alertUpdate("<h1>Review updated successfuly successfully!</h1>", "success");
                            self.retrieveBookings();
                        }else{//if not successfull
                            alertUpdate("<h1>Something went wrong :((((</h1>", "danger");
                        }

                    });

            }else{//if it is blank, let user now that he hasn't chosen any option in the combo.
                alertUpdate("<h1>This is not a valid entry!</h1>", "danger");
            }


        };

        /**
         * This switches the hidden HTML details about a complaint table row.
         * true stands for show details, false stands for not showing detaisl
         * @param barberId
         */
        window.toggleCustomerComplaintForm = (barberId) =>{
            self.listOfServiceProvidersBookedWith = self
                .listOfServiceProvidersBookedWith.map(([service, flag])=>{
                    if(service.s_id == barberId){
                        return [service, true]; // show information about the service
                    }else{
                        return [service, false]; // do not show information about the service
                    }
                });
            fetchListOfProvidersBookedWith(); // re-draw update in html
        };


        /**
         * sends the complaint object passed as parameter to the PHP server router.
         * @param complaint
         */
        window.sendComplaintToServer = (complaint) => {
            fetch(self.CUSTOMER_ROUTER_URL+"insertComplaint",{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                    body: JSON.stringify(complaint)//<- data to be sent over by POST request
                })
                .then(response=>response.text())
                .then(text=>{
                    if(text == 1){// if success
                        alertUpdate("Your complaint has been sent. Our administrators will handle it soon", "success");
                        setTimeout(()=>{
                            goToHome();
                        }, 2000);
                    }else{//if failure
                        alertUpdate("Something went wrong", "danger");
                        console.log(complaint);
                    }
                });
        };

        /**
         * This method is triggered after the user has pressed the button to send the new complaint to the system.
         * @param barber_id <- the service provider about whom the customer is making complaint
         */
        window.submitComplaint = (barber_id) => {
            const [[customerComplaintModel]] = self.listOfServiceProvidersBookedWith
                .filter(([result, flag])=>result.s_id == barber_id);
            //after retrieved the complaintModel, maps it to Complaint object, before sending it to server
            const complaint = new Complaint("",
                customerComplaintModel.s_id,
                "", customerComplaintModel.company_full_name,
                "", 'PENDENT' ,select("complaintTextArea").value);

            /**
             * if text about complaint is not blank, send it to the server
             */
            if(complaint.complaint.trim().length > 0){
                //SEND
                sendComplaintToServer(complaint);

            }else{// tell user he needs to type something in the textarea tag otherwise.
                alertUpdate("You have not typed anything", "danger");
            }

        };

        /**
         * Draws to HTML the data contained in the listOfServiceProviderBookedWith global array
         */
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

        /**
         * sends A GET request to PHP router server and gets a list of barbers that the user logged in bookeed with
         * in a JSON format.
         */
        window.retrieveBarbersListFromServer = () => {
            fetch(self.CUSTOMER_ROUTER_URL+"selectBarbersBooked")// SENDS GET REQUEST
                .then(response=>response.json())
                .then(json=>{ // JSON RESPONSE
                    setAnElementToInvisible(select("searchBarberResult"));// make invisible
                    setAnElementToInvisible(select("instructions"));// make invisible
                    /**
                     * populate array of listOfServiceProviderBookedWIth
                     * @type {Uint8Array | BigInt64Array | *[][] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
                     */
                    self.listOfServiceProvidersBookedWith = json.map(result=>[result, false]);
                    //draws results in the HTML
                    fetchListOfProvidersBookedWith();
                });
        }

    }// here ends the contructor.


    /**
     * This function adds into the html details about the slots that a service provider shown in an HTML table has.
     * If it has booking slots, then toggle the list of slots,
     * if not, alerts a message saying that the barber has no available slots.
     * @param barber -> for the information to be shown
     * @returns {string}
     */
    drawCollapsedBarber(barber){
        if(barber.bookingSlots.length > 0){
            //if list of booking slots are not empty
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
            //if list is empty
            return `
            <div class="alert alert-info" role="alert">
                <h1>Oh, snap!</h1>
                The provider ${barber.company_full_name} has no available slots at the moment.
            </div>`;
        }
    };

    /**
     * This function draws to HTML list of services provider table, the list of services providers retrieved from the server
     * @param serviceProviders
     * @returns {*}
     */
    fetchToHTML (serviceProviders)  {
        setAnElementToVisible(select("instructions"));// make invisible
        setAnElementToInvisible(select("makeComplaintArea")); // make this div invisible
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

    /**
     * It sends an HTTP POST request with the barberSearchModel object (full name attribute) and gets from the server
     * a list of services providers with that pattern in the name.
     * Eg: if user types letter "a" in the search engine, it will get all barbers that have "a" in the name.
     * @param barberSearchModel
     * @returns {Promise<Response | never>}
     */
    searchBarber (barberSearchModel){
        return fetch(this.CUSTOMER_ROUTER_URL+"searchBarbers", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(barberSearchModel)//<-obj to be sent by POST
        })
            .then(response=>response.json())
            .then(json=>{ //after acquiring response
                // populate list of serviceProviders
                this.serviceProviders = json.map(sp=>[serviceProvider(sp), false]);
                //draw in the HTML the list of service providers accordingly
                select("barberSearchBody").innerHTML = this.fetchToHTML(this.serviceProviders);
            });
    };


    /**
     * This method will redirect customer to complaint page by making complaint area visible and
     * retrieving complaints form server
     */
    makeAComplaint(){
        setAnElementToVisible(select("makeComplaintArea"));
        retrieveBarbersListFromServer();
    }


    /**
     * This method sends a GET request to PHP router and gets the response and draw the bookings obtained by the reqquest
     */
    retrieveBookings () {

        fetch(this.CUSTOMER_ROUTER_URL+"getAllBookings")
            .then(response=>response.json())
            .then(json=>json.map(booking=>[booking, false]))
            .then(json=> {
                this.listOfBookings = json; // populating list of bookings global array
                setAnElementClassToVisible("displayBookingsDiv");// making visible
                setAnElementToInvisible(select("instructions"));// making invisible
                setAnElementToInvisible(select("customerHome"));// making invisible
                setAnElementToInvisible(select("makeComplaintArea"));// making invisible
                setAnElementToInvisible(select("searchBarberResult"));// making invisible
                select("displayBookingsList").innerHTML = this.displayBookings();// rendering to HTML
            });
    };


    /**
     * Draws the list of bookings to HTML according to what is in the listOFBookings global array.
     * @returns {string}
     */
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

