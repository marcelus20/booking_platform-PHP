
window.addEventListener("load", ()=>{

    const customerController = () => CustomerController.customerController();
    const serviceProviderController = () => ServiceProviderController.serviceProviderController();
    const adminController = () => AdminController.adminController();

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
        select("admin_area").classList.remove("invisible");
        const activityTab = select("logs-view-list");
        const handleComplaintTab = select("handle-complaint");
        const createAnotherAdmin = select("create-another-admin");
        const pendentServicesTab = select("pendentServicesTab");
        setAnElementToVisible(activityTab);
        setAnElementToVisible(handleComplaintTab);
        setAnElementToVisible(createAnotherAdmin);
        setAnElementToVisible(pendentServicesTab);

        pendentServicesTab.addEventListener("click", ()=>{
            adminController().goToPendentServicesPage();
        });

        activityTab.addEventListener("click", ()=>{
            adminController().goToActivitiesTab();
        });

        handleComplaintTab.addEventListener("click", ()=>{
            adminController().goToAComplaintTab();
        });
        createAnotherAdmin.addEventListener("click", ()=>{
            adminController().goToAnotherAdminTab();
        });

        //TODO: validade this form fields!
        const adminForm = select("adminForm");
        adminForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            const email = select("email");
            const password = select("password");
            const confirmPassword = select("confirmPassword");
            adminController().registerNewAdmin(new AdminFormModel(email.value.trim(), password.value.trim(), confirmPassword.value.trim()));
        });

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
        fetch("http://localhost/booking_platform/backend/routers/serviceProviderRouter.php?executionType=checkMyStatus")
            .then(response=>response.text())
            .then(text=>{
                if(text != 1){
                    setAnElementClassToVisible("provider_area");
                    const insertSlotsTab = select("insert-slots");
                    const viewCustomerListTab = select("view-customers-list");


                    insertSlotsTab.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("customerListContainer");
                        serviceProviderController().goToSlotsInsertionPage();
                    });


                    insertSlotsTab.classList.remove("invisible");
                    viewCustomerListTab.classList.remove("invisible")



                    viewCustomerListTab.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("slots_page");
                        serviceProviderController().goToCustomerListPage();
                    });
                }else{
                    alertUpdate(`
                    <div class="jumbotron jumbotron-fluid">
                        <div class="container">
                            <h1 class="display-4">Your status is unfortunately pendent. You will not be able to perform any activity</h1>
                            <p class="lead">
                                What should I do now?
                                Just wait, one of the administrators will either approve you if your details seem to be genuine.
                            </p>
                        </div>
                    </div>
                    
                    `, "secondary", 0);
                }

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