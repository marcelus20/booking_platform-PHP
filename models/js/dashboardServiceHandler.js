state = {};

const alertUpdate = (msg, type) => {
    let alertType = "";
    if(type === "info"){
        alertType = "alert alert-info"
    }else if (type === "danger"){
        alertType = "alert alert-danger";
    }else if (type === "warning"){
        alertType = "alert alert-warning";
    }else if (type === "success"){
        alertType = "alert alert-success";
    }
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.innerHTML = msg;
    alertUpdateElement.setAttribute("class", alertType);
    alertUpdateElement.setAttribute("role", "alert");
};

const clearAlertdiv= ()=>{
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.innerHTML = null;
    alertUpdateElement.setAttribute("class", "");
};


//REDIRECTING TO HOME PAGE WHEN SERVICE DASHBOARD LOADS
window.addEventListener("load", ()=>{

    const mainDiv = document.querySelector("#table");
    goToHome();
    //ADDING CLICK LISTENER TO THE REST OF THE ELEMENTS IN NAV BAR
    addHomeMenuAListener();
    addSlotsInsertionMenuAListener(mainDiv);
    addViewCustomerListMenuAListener(mainDiv);
});

const addViewCustomerListMenuAListener = (mainDiv) => {
    goToViewCustomerListPage(mainDiv);
};

const goToViewCustomerListPage = (mainDiv)=>{
    const viewCustomerListMenu = document.querySelector("#view-customers-list");
    viewCustomerListMenu.addEventListener("click", ()=>{
        mainDiv.innerHTML = "THIS IS THE CUSTOMER LIST";
        getListOfCustomers();
    });
};

const goToHome = () => {
    const mainDiv = document.querySelector("#table");
    mainDiv.innerHTML = "THIS IS HOME";
};

const addHomeMenuAListener = () => {
    const homeMenuHeader = document.querySelector("#home");
    homeMenuHeader.addEventListener("click", ()=>{
        goToHome()
    });
};

const addSlotsInsertionMenuAListener = (mainDiv) => {
    const slotsInsertionMenu = document.querySelector("#insert-slots");
    slotsInsertionMenu.addEventListener("click", ()=>{
        goToSlotsInsertionPage(mainDiv);
    });

};

const goToSlotsInsertionPage = (mainDiv) => {
    mainDiv.innerHTML = "THIS IS SLOTS INSERTION PAGE!"
};



const getListOfCustomers = () => {

    fetch("/booking_platform/controllers/getCustomersList.php")
        .then(response=>response.text())
        .then(text=>{

            state.customers = JSON.parse(text);
            state.collapseCustomers = state.customers.map(customer=>false);
            showCustomersResult();
        });
};

const showCustomersResult = () => {
    let str = "";

    if(state.customers.length === 0){//IF IT HAS NO RESULTS TO DISPLAY
        alertUpdate("<h2> You have no customer yet to display, have you inserted booking slots yet?</h3>", "info");
    }else{
        str += `<h1 class="display-1">List of Customers booked with you!</h1>`;
        str += `<h3 class="display-3">Click on the row of the list below to see booking details</h3>`;
        str += "<div class=\"list-group\"> ";
        state.customers.map((customer, i)=>{
            str += `
                 <a href="#" class="list-group-item list-group-item-action" id="customer${+i}" onclick="addListenerToListItem(${i})">
                    <ul class="list-inline">
                        <li>${customer["first_name"]}</li>
                        <li>${customer["last_name"]}</li>
                    </ul>
                 </a>
                 <a class="list-group-item list-group-item-action" id="collapsed${i}">
                    ${state.collapseCustomers[i]?collapseCustomer(i):""}
                 </a>
            `;

        });
        str += `</div>`;
        printContentToMainDiv(str);


    }
};

const setCollapsedCustomersListToFalse = () => {
    const collapsedList = [...state.collapseCustomers];
    state.collapseCustomers = collapsedList.map(shouldCollapse=>false);
};

const addListenerToListItem = (index) => {
    setCollapsedCustomersListToFalse();
    state.collapseCustomers[index] = true;
    showCustomersResult();
};

const collapseCustomer = (index) => {
    clearAlertdiv();
    console.log(state.customers[index]);
    const bookingStatusArray = ["CONFIRMED", "COMPLETE", "PENDENT", "USER_DID_NOT_ARRIVE"];
    return state.customers[index].listOfBookings.map((booking, i)=>
    `
        <h5 class="display-5">#${i+1}</h5>
        <table class="table">
            <thead class="thead-dark">
                <tr>
                    <th scope="col">Date And Time</th>
                    <th scope="col">Status</th>
                    <th scope="col">Review</th>
                </tr>
                <tr>
                    <td>${booking["time_stamp"]}</td>
                    <td>${booking["booking_status"]}</td>
                    <td>${booking["review"]}</td>
                    <td rowspan="2">
                        <form>
                            PS: bookings with the COMPLETE <br>status can't be cancelled or changed status!<br>
                            <button type="button" class="btn btn-danger" ${
                            booking["booking_status"] === "COMPLETE" ? "disabled = \"true\"":""
                            } onclick="cancelBooking(${index}, ${i})" >Cancel Appointment</button>
                          
                        </form>
                        <div class="form-group">
                            <label for="changeStatus">Set booking status to:</label>
                            <select class="form-control" id="change-status" ${
        booking["booking_status"] === "COMPLETE" ? "disabled = \"true\"":""
        } onchange="updateBookingStatus(${index}, ${i})">
                                <option value="" selected disabled hidden>Select here an option</option>
                                ${bookingStatusArray.map(status=>`<option>${status}</option>`)
                                    .reduce((acc, next)=>acc+next)}
                            </select>
                         </div>
                    </td>
                </tr>
            </thead>
        </table>
        <hr>
        
    `
    );
};

const updateBookingStatus = (customerIndex, bookingIndex) => {
    state.customers[customerIndex].listOfBookings[bookingIndex]["booking_status"] = document.querySelector("#change-status").value;
    fetch("/booking_platform/controllers/updateStatus.php", {
        method:"POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body:JSON.stringify(state.customers[customerIndex].listOfBookings[bookingIndex])
    }).then(response=>response.text())
        .then(text=>{
            console.log(text);
            alertUpdate(`<h1 class='display-1'>
                             You have successfully changed the booking status to ${
                                state.customers[customerIndex].listOfBookings[bookingIndex]["booking_status"]
                            }!
                         </h1>`, "success");
            getListOfCustomers();
        })
};

const cancelBooking = (customerIndex, booking_index) => {
    fetch("/booking_platform/controllers/cancelBooking.php", {
        method:"POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body:JSON.stringify(state.customers[customerIndex].listOfBookings[booking_index])
    }).then(response=>response.text())
        .then(text=>{
            alertUpdate("<h1 class='display-1'>You have successfully deleted the booking!</h1>", "success");
            getListOfCustomers();
        })

};

const printContentToMainDiv = (content) => {
    document.querySelector("#table").innerHTML = content;
};


