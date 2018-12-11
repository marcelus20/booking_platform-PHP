let _customerController = null;



class CustomerController{

    constructor(){
        this.serviceProviders = [];
        this.listOfBookings = [];
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
        return serviceProviders.reduce(((acc, [barber, flag])=>acc+`
            <tr onclick="addRowAListener(${barber.s_id})">
                <td><strong>${barber.company_full_name}</strong></td>
                <td>${barber.location.city}</td>    
            </tr>    
            <tr>
                <td colspan="2" id="slots${barber.s_id}">${flag?this.drawCollapsedBarber(barber):""}</td>
            </tr>
        `), "");
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

    retrieveBookings () {
        fetch(this.CUSTOMER_ROUTER_URL+"getAllBookings")
            .then(response=>response.json())
            .then(json=>json.map(booking=>[booking, false]))
            .then(json=> {
                this.listOfBookings = json;
                setAnElementClassToVisible("displayBookingsDiv");
                select("displayBookingsList").innerHTML = this.displayBookings();
            });
    };


    displayBookings (){
        if(this.listOfBookings.length > 0){
            return this.listOfBookings.reduce((acc,[{s_id, company_full_name,
                location, bookingSlots:[bookingSlot_]}, flag])=>acc+`
            <li class="list-group-item" onclick="addColapsedListAnEventListener(${s_id}, '${bookingSlot_.timestamp}')">
                    
                <ul class="list-inline">
                    <li class="list-inline-item"><string>${bookingSlot_.timestamp}</string></li>
                    <li class="list-inline-item">${company_full_name}</li>
                    <li class="list-inline-item">${location.first_line_address}</li>
                    <li class="list-inline-item">${location.second_line_address}</li>
                    <li class="list-inline-item"><strong>${location.city}</strong></li>
                    <li class="list-inline-item"><strong>${bookingSlot_.booking.booking_status}</strong></li>
                    <li class="list-inline-item"><h3>${bookingSlot_.booking.review}</h3></strong></li>
                </ul>
            </li>
            <li class="list-group-item" id="collapsedbarber${s_id}">
                 ${flag?showColapsedBooking(s_id):""}
            </li>
                `, "");
        }else {
            return "<div class=\"alert alert-info\" role=\"alert\"><h2>You have no bookings at the moment to display</h2></div>";
        }

    };




}

