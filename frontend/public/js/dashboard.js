
window.addEventListener("load", ()=>{

    const customerController = () => CustomerController.customerController();
    const serviceProviderController = () => ServiceProviderController.serviceProviderController();

    const checkLogin = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=checkLogin")
            .then(response=>response.text())
            .then(text=>{
                if(parseInt(text) !== 1){
                    window.location.href = "http://localhost/booking_platform/";
                }
            });

    const logout = () => {
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=logout")
            .then(response=>response.text())
            .then(text=>{
                if(parseInt(text) === 1){
                    window.location.href = "http://localhost/booking_platform/";
                }
            });
    };

    const getUserData = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=getUserData")
            .then(response=>response.text())
            .then(text=>sessionModel(JSON.parse(text)));

    const adminViewRendering = (sessionModel) => {
        console.log(sessionModel);

        return sessionModel;
    };

    const customerViewRendering = (sessionModel) => {
        select("customer_area").classList.remove("invisible");
        const viewBooking  = select("view-your-bookings");
        viewBooking.classList.remove("invisible");
        viewBooking.addEventListener("click", ()=>{
            customerController().retrieveBookings();
        });

        const searchEngine = select("searchEngine");
        searchEngine.classList.remove("invisible");
        searchEngine.addEventListener("keyup",()=>{
            setAnElementClassToInvisible("displayBookingsDiv");
            if(searchEngine.value.length > 0){
                select("searchBarberResult").classList.remove("invisible");
            }else {
                select("searchBarberResult").classList.add("invisible");
            }

            customerController().searchBarber(new BarberSearchModel(searchEngine.value));
        });
        return sessionModel;
    };

    const serviceViewRendering = (sessionModel) => {
        setAnElementClassToVisible("provider_area");
        const insertSlotsTab = select("insert-slots");
        insertSlotsTab.classList.remove("invisible");
        const viewCustomerListTab = select("view-customers-list");
        viewCustomerListTab.classList.remove("invisible")

        viewCustomerListTab.addEventListener("click", ()=>{
            serviceProviderController().goToCustomerListPage();
        });


        return sessionModel;
    };

    const main = () => {
        checkLogin()
            .then(()=>
                select("logout").addEventListener("click", (e)=>{
                    e.preventDefault();
                    logout()
            })).then(()=>getUserData())
            .then(sessionModel=>{
                select("helloUser").innerHTML = `Hello, ${sessionModel.email} :)))`;
                switch (sessionModel.user_type) {
                    case "ADMIN": return adminViewRendering(sessionModel);
                    case "SERVICE_PROVIDER": return serviceViewRendering(sessionModel);
                    case "CUSTOMER": return customerViewRendering(sessionModel);
                    default: throw Error("INVALID USER TYPE");
                }
            })
            .catch(e=>console.log(e));

    };

    main();
});