/**
 * When the window loads, an anonnymous function will trigger to initialise the singletons.
 */
window.addEventListener("load", ()=>{

    /**
     * getting instance of customer controller class
     * @returns {CustomerController}
     */
    const customerController = () => CustomerController.customerController();
    /**
     * getting instance of serviceProviderController class
     * @returns {ServiceProviderController}
     */
    const serviceProviderController = () => ServiceProviderController.serviceProviderController();
    /**
     * Getting an instance of adminController class
     * @returns {AdminController}
     */
    const adminController = () => AdminController.adminController();

    /**
     * Check if user is logged in by sending a request to the PHP router
     * @returns {Promise<string | never>}
     */
    const checkLogin = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=checkLogin")
            .then(response=>response.text())
            .then(text=>{// if it is not logged in, leads to index.html (Login page)
                if(parseInt(text) !== 1){
                    window.location.href = "/booking_platform/";
                }
            });

    /**
     * sends an HTTP request to the ROUTER for destroying session and logging out.
     */
    const logout = () => {
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=logout")
            .then(response=>response.text())
            .then(text=>{
                if(parseInt(text) === 1){
                    window.location.href = "/booking_platform/";
                }
            });
    };

    /**
     * retrieves a SessionModel object with all relevant information about the logged in user.
     * @returns {Promise<SessionModel | never>}
     */
    const getUserData = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=getUserData")
            .then(response=>response.text())
            .then(text=>sessionModel(JSON.parse(text)));

    /**
     * this function adapts dashboard by setting to visible only admin relevant HTML elements.
     * @param sessionModel
     * @returns {*}
     */
    const adminViewRendering = (sessionModel) => {
        select("admin_area").classList.remove("invisible"); // makes visible the admin area div element
        const activityTab = select("logs-view-list");//
        const handleComplaintTab = select("handle-complaint");
        const createAnotherAdmin = select("create-another-admin");
        const pendentServicesTab = select("pendentServicesTab");
        const btnActivity = select("btn-viewActivityLog");
        const btnHandle = select("btn-complaint");
        const btnCreateAdmin = select("btn-createAdmin");
        const btnApproveService = select("btn-approve");
        setAnElementToVisible(activityTab); // make visible
        setAnElementToVisible(handleComplaintTab);// make visible
        setAnElementToVisible(createAnotherAdmin);// make visible
        setAnElementToVisible(pendentServicesTab); // make visible

        /**
         * adding a listener to button activity logs
         */
        btnActivity.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToActivitiesTab();
        });

        /**
         * adding a listener to button handle complaint
         */
        btnHandle.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToAComplaintTab();
        });

        /**
         * adding a listener to button create admin
         */
        btnCreateAdmin.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToAnotherAdminTab();
        });

        /**
         * adding a listener to button approve a service provider
         */
        btnApproveService.addEventListener("click",()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToPendentServicesPage();
        });


        /**
         *adding a listener to the approve a service provider tab
         */
        pendentServicesTab.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToPendentServicesPage();
        });

        /**
         * adding a listener to the activity logs tab
         */
        activityTab.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToActivitiesTab();
        });

        /**
         * adding a listener to complaints tab
         */
        handleComplaintTab.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToAComplaintTab();
        });
        /**
         * adding a listener to create another admin tab
         */
        createAnotherAdmin.addEventListener("click", ()=>{
            setAnElementToInvisible(select("adminHome"));
            adminController().goToAnotherAdminTab();
        });

        //TODO: validate these form fields!
        const adminForm = select("adminForm");
        adminForm.addEventListener("submit",(e)=>{
            e.preventDefault();
            const email = select("email");
            const password = select("password");
            const confirmPassword = select("confirmPassword");
            adminController().registerNewAdmin(new AdminFormModel(email.value.trim(), password.value.trim(), confirmPassword.value.trim()));
        });
        // returning sessionModel
        return sessionModel;
    };

    /**
     * sets dashboard to customer view by making visible all of the customer tabs and buttons.
     * @param sessionModel
     * @returns {sessionModel}
     */
    const customerViewRendering = (sessionModel) => {
        select("customer_area").classList.remove("invisible"); // making invisible customer area
        const viewBooking  = select("view-your-bookings");
        const makeAComplaintTab = select("make-a-complaint");
        setAnElementToVisible(makeAComplaintTab); //making visible complaint tab

        const btnMakeComplaints = select("btn-make-complaint");
        btnMakeComplaints.addEventListener("click", ()=>{
            setAnElementToInvisible(select("customerHome")); // make invisible
            setAnElementToInvisible(select("tableCustomer"));// make invisible
            setAnElementToInvisible(select("displayBookingsDiv"));// making invisible
            customerController().makeAComplaint(); // redirecting to complaint page
        });

        /**
         * adding a listener to complaint tab
         */
        makeAComplaintTab.addEventListener("click", ()=>{
            setAnElementToInvisible(select("customerHome"));
            setAnElementToInvisible(select("tableCustomer"));
            setAnElementToInvisible(select("displayBookingsDiv"));
            customerController().makeAComplaint(); // redirect to complaint tab
        });
        const btnViewBooking = select("btn-viewBookings");

        /**
         * adding a listener to the button view booking
         */
        btnViewBooking.addEventListener("click", ()=>{
            customerController().retrieveBookings(); // redirecting to booking
        });
        viewBooking.classList.remove("invisible");
        /**
         * adding a listener to view booking tab
         */
        viewBooking.addEventListener("click", ()=>{
            customerController().retrieveBookings();// redirecting to bookings page
        });


        /**
         * This function adds a listener to the search engine html element.
         * it listens to the "keyup" event and sends information to PHP router server via HTTP POST request
         * encapsulated in a BarberSearchModel object.
         * @type {Element}
         */
        const searchEngine = select("searchEngine");
        searchEngine.classList.remove("invisible");// make it visible
        searchEngine.addEventListener("keyup",()=>{
            setAnElementClassToInvisible("displayBookingsDiv"); // sets booking div to invisible
            setAnElementClassToInvisible("customerHome"); // home to invisible.
            if(searchEngine.value.length > 0){
                select("searchBarberResult").classList.remove("invisible");
            }else {
                select("searchBarberResult").classList.add("invisible");
            }

            /**
             * calling the customerControllerme singleton class method searchbarber with the barberSesssion mordel as attribute
             */
            customerController().searchBarber(new BarberSearchModel(searchEngine.value));
        });
        return sessionModel; // returning session model
    };


    /**
     * adapts the dashboard.html file to show elements options relevant only to service providers user.
     * @param sessionModel
     * @returns {sessionModel}
     */
    const serviceViewRendering = (sessionModel) => {
        /**
         * checking with PHP if user has initialised a session.
         */
        fetch("/booking_platform/backend/routers/serviceProviderRouter.php?executionType=checkMyStatus")
            .then(response=>response.text())
            .then(text=>{
                if(text != 1){//if service provider is verified, then adapt dashboard
                    setAnElementClassToVisible("provider_area");// set provider area to visible
                    const insertSlotsTab = select("insert-slots");
                    const viewCustomerListTab = select("view-customers-list");
                    const btnSlots = select("btn-slots");
                    const btnCustomer = select("btn-viewCustomers");
                    //adds the event listener to the button that leads to the List of customer page
                    btnCustomer.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("slots_page"); //make div invisible
                        setAnElementToInvisible(select("serviceHome")); // make service home div invisible
                        serviceProviderController().goToCustomerListPage(); // leads service provider to the customer list page
                    });

                    /**
                     * adding a listener to the button that leads to the slots page
                     */
                    btnSlots.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("customerListContainer");// make customer list invisible
                        setAnElementToInvisible(select("serviceHome")); // make home invisible
                        serviceProviderController().goToSlotsInsertionPage(); // go to slots insertion page
                    });

                    /**
                     * give the insert slots tab a listener to lead to slots page.
                     */
                    insertSlotsTab.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("customerListContainer"); // make invisible
                        setAnElementToInvisible(select("serviceHome")); // make invisible
                        serviceProviderController().goToSlotsInsertionPage(); // leads user to the slots insertion page
                    });

                    insertSlotsTab.classList.remove("invisible"); // make invisible
                    viewCustomerListTab.classList.remove("invisible"); // make invisible


                    /**
                     * adds the view customer list tab a listener that leads to the customer list page.
                     */
                    viewCustomerListTab.addEventListener("click", ()=>{
                        setAnElementClassToInvisible("slots_page"); // make invisible
                        setAnElementToInvisible(select("serviceHome"));// make invisible
                        serviceProviderController().goToCustomerListPage(); //leads user to customer list page
                    });
                }else{ // if service provider is not verified, leave everything invisible and display this message
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

    /**
     * this method initialises everything after user has logged in.
     */
    const main = () => {
        checkLogin() // checks if user is logged in
            .then(()=>
                select("logout").addEventListener("click", (e)=>{ // adds a listener to the logout button
                    e.preventDefault(); // prevent form from refreshing page
                    logout()
            })).then(()=>getUserData())// after assiging listener, get user data from the server
            .then(sessionModel=>{ // after the sessionModel was returned from the server,
                // the algorithm bellow will redirect according to the user type.
                select("helloUser").innerHTML = `Hello, ${sessionModel.email} :)))`;
                switch (sessionModel.user_type) {
                    case "ADMIN": return adminViewRendering(sessionModel);// if admin
                    case "SERVICE_PROVIDER": return serviceViewRendering(sessionModel);// if service provider
                    case "CUSTOMER": return customerViewRendering(sessionModel);// if customer
                    default: throw Error("INVALID USER TYPE");
                }
            })
            .catch(e=>console.log(e));

    };

    /**
     * call main method when window of the dashboard loads
     */
    main();

});