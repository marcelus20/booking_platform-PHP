/**
 * singleton instance
 * @type {null}
 * @private
 */
let _serviceProviderController = null;


/**
 * ServiceProviderController Class
 *This class will handle the admin user's action and send requests to the backend structure using the so called AJAX
 * Asynchronous Javascript AND XML to the PHP routers backend class.
 */
class ServiceProviderController{

    /**
     * instance initializer
     * @returns {null}
     */
    static serviceProviderController (){
        if(_serviceProviderController == null){// if null, initialise it!
            _serviceProviderController = new ServiceProviderController();
        }

        return _serviceProviderController; // return single instance
    }


    /**
     * CONSTRUCTOR
     */
    constructor() {
        /**
         * ROUTING URL TO BE SENDING REQUESTS
         * @type {string}
         */
        this.ROUTING_URL = "/booking_platform/backend/routers/serviceProviderRouter.php?executionType=";
        /**
         * list of customers that this serviceProvider has served or will serve.
         * @type {Array}
         */
        this.listOfCustomers = [];
        /**
         * List of slots that this service enters to the system
         * @type {Array}
         */
        this.slotsArray = [];


        /**
         * in the window object, the word this refers to the window object, not this class. so I am calling
         * this from this class self, and every tim I need to use this keyword inside a window object, I will be calling
         * self instead.
         * @type {CustomerController}
         */
        const self = this;


        /**
         * Switches bettwen show or not show details about the bookings in a customer list
         * @param id <- the customer ID
         */
        window.addListenerToListItem = (id) => {
            self.listOfCustomers = self.listOfCustomers.map(([c, flag]) => {
                if(parseInt(c.c_id)=== id){
                    return [c,true]; // show bookings of customer
                }else{
                    return [c, false]; // do not show bookings of customer
                }
            });
            //re-draw it to HTML
            select("customerListView").innerHTML = self.showCustomersResult();
        };

        /**
         * this method sends POST request to PHP router server with the booking information it needs to cancel
         * @param c_id
         * @param s_id
         * @param timestamp
         */
        window.cancelBookingFromCustomerList = (c_id, s_id, timestamp) => {
            fetch(this.ROUTING_URL+"cancelBooking", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body:JSON.stringify({c_id: c_id, s_id: s_id, timestamp:timestamp}) //<-details of the bookings to cancel
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){ //if success
                        alertUpdate("<h1 class='display-1'>You have successfully deleted the booking!</h1>", "success");
                        setTimeout((()=>{
                            self.getListOfCustomers(); // reloads page after 2 seconds
                        }), 2000)
                    }else{// if failure
                        alertUpdate("<h1 class='display-1'>Something went wrong :((((( sad!</h1>", "danger")
                    }

                })
        };


        /**
         * This function sends a POST request to PHP router server to update a status of a booking.
         * @param c_id
         * @param s_id
         * @param timestamp
         */
        window.updateBookingStatus = (c_id, s_id, timestamp) => {
            const b_status = document.querySelector("#change-status").value;
            fetch(this.ROUTING_URL + "updateBooking", {
                method:"POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body:JSON.stringify({c_id: c_id, s_id: s_id, timestamp:timestamp, booking_status: b_status} )//<-detauls of the booking to be sent over
            }).then(response=>response.text())
                .then(text=>{
                    if(text === "1"){ // if successful
                        console.log(text);
                        alertUpdate(`<h1 class='display-1'>
                             You have successfully changed the booking status to ${b_status}!
                         </h1>`, "success");
                        setTimeout((()=>{
                            self.getListOfCustomers(); // reloads page after 2 seconds
                        }), 2000)
                    }else{//if failure
                        alertUpdate("<h1 class='display-1'>Something went wrong :((((( sad!</h1>", "danger")
                    }
                })
        };

        /**
         *  This function is for making the buttons with the times that are allowed to be created.
         *  The parameter notAllowedTimes, is the array of times that the buttons cannot be created.
         *
         *  For EG: if in the database, there is a slot for 11/11/2018 at 08:00, the time 08:00
         *  is a not allowed time to create button. This will avoid service provider inserting 2 slots
         *  with the same date and time.
         *  therefore, the creating of the button slots array will skip the 8 o'clock time and go to the next
         *  which is 8:30 and so on.
         *
         * @param notAllowedTimes <- array of times that are not allowed to generate slot
         * @param dateString <- date for the creation of slots
         */
        window.fillUpSlotsArray = (notAllowedTimes, dateString) => {

            let time = "08:00"; // start time: 8:00
            let dateAndTime = new Date(dateString + " " + time); // createing datetime object from strinng concatenation
            let slotArray = []; // empty array of buttons


            /**
             * a total of 24 slots can be inserted per day, so generate 24 buttons - the length of the allowed times.
             */
            for(let i = 0; i < 24; i++) {
                dateAndTime = new Date(dateAndTime.getTime() + 1800000); // add 30 minutes to previeous time
                //IF THE ARRAY OF NOT ALLOWED TIMES CONTAINS NEW TIME GENERATED FROM DATE AND TIME
                //DO NOT PUSH IT TO SLOT ARRAY.
                if (!notAllowedTimes.includes(getTimeFromDate(dateAndTime))){
                    slotArray.push(getTimeFromDate(dateAndTime));
                }
            }

            /**
             * populate the global slotsArray variable, which is the array of buttons slots.
             * @type {*[][]}
             */
            this.slotsArray = [...slotArray.map(timeSlot=>[timeSlot, false])];

            //after slots array is populated, draw it to HTML
            this.drawBadges();
        };

        /**
         * this function turnsa clicked button slot to available, by changing its flag so that it apperars on the
         * right side container
         * @param slotIndex
         */
        window.makeAvailable = (slotIndex) => {
            const timeSlots = [...this.slotsArray];
            timeSlots[slotIndex][1] = !timeSlots[slotIndex][1]; // change the flag of the tuple
            this.slotsArray = [...timeSlots];
            //re-draw with the changes.
            this.drawBadges();
        };

        /**
         * The button for submiting the slots will be kept hidden until at least one slot is made available
         * @returns {*}
         */
        window.switchButtonDisplay = () => {
            const insertSlotsButton = select("submitSlots");
            if(this.slotsArray.filter(([timeSlot, flag])=>flag).length > 0){
                /**
                 * if filter returns with the true flag returns some result, make it visible
                 */
                insertSlotsButton.classList.remove("invisible")
            }else{
                /**
                 * if it returns 0 result, then make it invisible.
                 */
                insertSlotsButton.classList.add("invisible");
            }
            return insertSlotsButton;
        };

        /**
         * this method will send the array of the slots the service provider made available.
         * it will trigger when he hits the button to send slots.
         *
         * It gets from the slots array, those that have a true flag (has made available).
         * @param dateString
         */
        window.sendSlots = (dateString) => {
            /**
             * array of slots with true flag
             * @type {{date: string}[]}
             */
            const slotsToSend = this.slotsArray.filter(([timeSlot, flag])=>flag)
                .map(([timeSlot, flag])=>dateString+" "+timeSlot)
                .map(timestamp=>[{date: timestamp}]).map(arr=>arr[0]);


            fetch(this.ROUTING_URL+"sendSlots",{
                method:"POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body:JSON.stringify(slotsToSend)//<-sending slots to PHP server
            }).then(response=>response.text()).then(text=>{
                if(text == 1){ // if successful
                    alertUpdate(
                        "<h1>" +
                        "You have successfully inserted the slots, now a customer will be able to see " +
                        `and choose one of them for the date ${dateString}, within 10 seconds you will be 
                         redirected to Home</h1>`, "success", 10000
                    );
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");// redirects to home after 10 seconds
                    }, 10000)
                }else{// if failure, alert user
                    alertUpdate("something went wrong :((", "danger");
                }
            }).catch(e=>console.log(e));
        }
    };


    /**
     * this function draws the buttons contained in the slotsArray global array.
     * the container in the left will contain all bookingSlots that are not available, whereas the container
     * in the left (slot_available) will draw only the slots with true flags
     */
    drawBadges (){
        /**
         * container in the left hand side
         * @type {T | string}
         */
        select ("slot_not_available").innerHTML = this.slotsArray.reduce((acc, [slotTime, flag], i)=>acc +
            `<button class="btn btn-primary" ${flag?"disabled":""} onclick="makeAvailable(${i})">${slotTime}</button>`
        , "");

        /**
         * container in the right hand side
         * @type {T | string}
         */
        select("slot_available").innerHTML = this.slotsArray.reduce((acc, [slotTime, flag], i)=>acc +
            `<button class="btn btn-success ${!flag?"invisible":""}" ${!flag?"disabled":""} onclick="makeAvailable(${i})">${slotTime}</button>`, "");
        switchButtonDisplay();
    }


    /**
     * This function will check if there is any time in the dateString that should be not allowed to create slot.
     *
     * It will be considered a not allowed time the time that:
     *
     *  - it is in the range between 08:00 and 20:00 with the intervals of 30 minutes that has been found in the
     *  booking slots table.
     *
     *  if a not allowed time is found, it will push it to notAllowedTimes array.
     *
     *  This check is done by making an HTTP POST request to the PHP for slots with the dateString.
     * @param dateString
     */
    populateSlotsArray(dateString){
        //BEFORE DRAWING BADGES, IT IS NEEDED TO CHECK IN THE DATABASE IF THERE IS TIMES ALREADY INSERTED TO DB FOR THAT DATE
        //IF SO, THE BADGES WITH THESE TIMES WILL NOT DRAW

        //SENDING REQUEST TO BACKEND SERVER TO LOOK FOR NOT ALLOWED TIMES FOR THAT DATE STRING IN THE DATABASE:

        fetch(this.ROUTING_URL+"lookForSlotsWithDate",{
            method:"POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body:JSON.stringify({date: dateString})//<- date object, for looking for slots with this date
        }).then(response=>response.json()).then(json=>{
            /**
             * if JSON returns something, means that there are not allowed times for that date.
             * @type {Uint8Array | BigInt64Array | any[] | Float64Array | Int8Array | Float32Array | Int32Array | Uint32Array | Uint8ClampedArray | BigUint64Array | Int16Array | Uint16Array}
             */
            const notAllowedTimes = json.map(slots=>getTimeFromDateString(slots.timestamp));
            console.log(notAllowedTimes);
            /**
             * fill up the global with all times except not allowed times
             */
            fillUpSlotsArray(notAllowedTimes, dateString);

            /**
             * adding event listener to the submit slots button
             */
            select("submitSlots").addEventListener("click", ()=>{
                sendSlots(dateString);
            });
        }).catch(e=>console.log(e));

    }


    /**
     * This function redirects user to slots insertion page
     */
    goToSlotsInsertionPage(){
         const slotDiv = select("slots_page");
         setAnElementClassToVisible("slots_page"); // making slot page invisible
         const datePicker = confDatePicker(); // creating the datepicker component
         datePicker.addEventListener("change", ()=>{ // giving datepicker a listener (on change listener)
             select("slot-instruction").classList.remove("invisible");// making visible the left container
             select("slot-box").classList.remove("invisible"); // mking visible the right container
             this.populateSlotsArray(datePicker.value); // populating the the slotsArray global array with
             // the buttons times for the chosen date
         })
    }

    /**
     * redirects customer to the list of customers page
     */
    goToCustomerListPage(){
        this.getListOfCustomers();//calling function that will retrieve list of customers with server
    }


    /**
     * This function sends an HTTP POST request to PHP router server and gets the response and call function that
     * will draw an HTML table with the customer list
     */
    getListOfCustomers () {
        fetch(this.ROUTING_URL+"getCustomersList")
            .then(response=>response.json())
            .then(json=>json.map(c=>[customer(c), false])).then(json=>{
                this.listOfCustomers = json; // assigning json response to list of customer global array.
                const customerListDiv = select("customerListView");
                setAnElementClassToVisible("customerListContainer");//making div visible
                customerListDiv.innerHTML = this.showCustomersResult(); // drawing html table element
            });
    };

    /**
     * Draws an HTML unordered list of customers according to the content of listOfCustomer global array.
     * @returns {string}
     */
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


    /**
     * gives a listener to the list item line to toggle more options on managing the booking with each customer.
     * It gives an option to cancel an appointment or changing the booking status from PENDENT to CONFIRMED, OR USER_DID_NOT_ARRIVE.
     * @param customer
     * @returns {*}
     */
    collapseCustomer (customer) {
        /**
         * array of options for the select tag
         * @type {string[]}
         */
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