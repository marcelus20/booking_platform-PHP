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
                <td>${barber["company_full_name"]}</td>
                <td>${barber["city"]}</td>    
            </tr>    
            <div id="slots${index}"></div>
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
            console.log(state.bookingSlots);
            row.innerHTML = "";
            let str = "";
            console.log(state.bookingSlots);
            if(state.bookingSlots.length !== 0){
                str = `<h1>Booking Slots with the Service ${state.barbers[rowIndex]["company_full_name"]}</h1>`;
                str += "<ul class=\"list-group\">";
                state.bookingSlots.map((slots, slotIndex)=>{
                    str += `<li class="list-group-item">${slots["timestamp"]}
                            <button type="button" class="btn btn-primary" onclick="book(state.bookingSlots[${slotIndex}])">Book this slot</button></li>`;
                });
                str +="</ul>";
            }
            row.innerHTML = str;
        });

};

const book = (slot) => {
    console.log(slot);

    const booking = {...slot};

    booking.booking_status = "PENDENT";
    booking.review = "";

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