let state = {};


const inputElement = document.querySelector("#searchEngine");


const searchBarber = (value) =>{
    const obj = {};
    obj.fullName = value;


    fetch("/booking_platform/controllers/searchBarbers.php", {
       method: "POST",
       headers: {
           "Content-Type": "application/json; charset=utf-8"
       },
       body: JSON.stringify(obj)
   })
       .then(response=>response.text())
       .then(responseText=>{
           state.barbers = JSON.parse(responseText);
           fectchToHTML();
       });
};

const fectchToHTML = () => {
    let innerHTMLSTR = `
        <table class="table table-dark">
            <tr>
                <th scope="col">Service Name</th>
                <th scope="col">City</th>        
            </tr>
    
`;
    state.barbers.map((barber, index)=> {
        innerHTMLSTR += `
            <tr onclick="addRowAListener(${index})">
                <td><strong>${barber["company_full_name"]}</strong></td>
                <td>${barber["city"]}</td>    
            </tr>    
            <tr>
                <td colspan="2" id="slots${index}"></td>
            </tr>
        `
    });

    innerHTMLSTR += `</table>`;
    document.querySelector("#table").innerHTML = innerHTMLSTR;


};

const addRowAListener = (rowIndex)=>{
    const row = document.querySelector("#slots"+rowIndex);

    fetch("/booking_platform/controllers/searchBookingSlots.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(state.barbers[rowIndex])
    }).then(response=>response.text())
        .then(responseText=>{
            state.bookingSlots = [];
            state.bookingSlots = JSON.parse(responseText);
            row.innerHTML = "";
            let str = "";
            if(state.bookingSlots.length !== 0){
                str = `<h1>Booking Slots with the Service ${state.barbers[rowIndex]["company_full_name"]}</h1>`;
                str += "<ul class=\"list-group\">";
                state.bookingSlots.map((slots, slotIndex)=>{
                    str += `<li class="list-group-item">${slots["timestamp"]}
                            <button type="button" class="btn btn-primary" onclick="book(state.bookingSlots[${slotIndex}])">Book this slot</button></li>`;
                });
                str +="</ul>";
                row.innerHTML = str;
            }else{
                row.innerHTML = `<div class="alert alert-info" role="alert">
                                    <h1>Oh, snap!</h1>
                                    The provider ${state.barbers[rowIndex]["company_full_name"]} has no available slots at the moment. 
                                </div>`;
            }

        });

};

const book = (slot) => {
    const booking = {...slot};

    booking.booking_status = "PENDENT";
    booking.review = "NO_REVIEW_ADDED";

    fetch("/booking_platform/controllers/bookASlot.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(booking)
    }).then(response=>response.text())
        .then(text=>console.log(text));

    clearDashboard();
};

const clearDashboard = () => {
    document.querySelector("#table").innerHTML = "";
};


inputElement.addEventListener("keypress",()=>{
   const value = inputElement.value;
   searchBarber(value);
});


const viewBookingsElement = document.querySelector("#view-your-bookings");



viewBookingsElement.addEventListener("click", ()=>{

    fetch("/booking_platform/controllers/getAllBookings.php")
        .then(response=>response.text())
        .then(text=>{
            state.listOfBookings = JSON.parse(text);
            state.colapeseBookingList = state.listOfBookings.map(booking=>false);
            displayBookings();
        });
});

const displayBookings = () => {
    let content = "<h1>List of your bookings</h1>";
    content += "<ul class=\"list-group\">";
    if(state.listOfBookings){
        state.listOfBookings.map((booking, bIndex)=>{
            content += `<li class="list-group-item" onclick="addColapsedListAnEventListener(${bIndex})">
                        
                        <ul class="list-inline">
                            <li class="list-inline-item"><string>${booking["time_stamp"]}</string></li>
                            <li class="list-inline-item">${booking["company_full_name"]}</li>
                            <li class="list-inline-item">${booking["first_line_address"]}</li>
                            <li class="list-inline-item">${booking["second_line_address"]}</li>
                            <li class="list-inline-item"><strong>${booking["city"]}</strong></li>
                            <li class="list-inline-item"><strong>${booking["review"]}</strong></li>
                        </ul>
            
                        </li>
                        <li class="list-group-item">
                            ${state.colapeseBookingList[bIndex]?showColapsedBooking(bIndex):""}
                        </li>
`;
        // addColapsedListAnEventListener("bookingOptions"+bIndex, bIndex);
        });
    }
    content += "</ul>";

    document.querySelector("#table").innerHTML = content;
};

const addColapsedListAnEventListener = (bookingIndex) => {
    const colapsedBookings = [...state.colapeseBookingList.map(flag=>false)];
    colapsedBookings[bookingIndex] = true;
    state.colapeseBookingList = [...colapsedBookings];
    displayBookings();
};

const showColapsedBooking = (bookingIndex) => {
    return `
    <h3>booking Options</h3>
    <table class="table">
        <tr>            
            <td>
                <h4>REVIEW OPTION</h4>
                <form>
                     <div class="form-group">
                        <select class="form-control">
                            <option value="volvo">END_OF_THE_WORLD</option>
                            <option value="saab">TERRIBLE</option>
                            <option value="mercedes">BAD</option>
                            <option value="audi">MEH</option>
                            <option value="audi">OK</option>
                            <option value="audi">GOOD</option>
                            <option value="audi">VERY_GOOD</option>
                            <option value="audi">SUPERB</option>
                            <option value="audi">PERFECT</option>
                        </select>
                        <button type="button" class="btn btn-primary" >
                            submit review
                        </button>
                    </div>
                </form> 
            </td>
            <td>
                <button type="button" class="btn btn-primary" onclick="cancelBooking(${bookingIndex})">
                    Cancel Appointment
                </button>
            </td>
        </tr>
    </table>
    


    `;
};

const cancelBooking = (bookingIndeex) => {
    const bookintToBeCancelled = {...state.listOfBookings[bookingIndeex]};
    console.log(bookintToBeCancelled);
    fetch("/booking_platform/controllers/cancelBooking.php",{
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(bookintToBeCancelled)
    }).then(response=>response.text())
        .then(text=>console.log(text));
};