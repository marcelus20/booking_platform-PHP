/**
 * On the load of the window, of the index.html page....
 */
window.addEventListener("load", ()=>{
    /**
     * sends a get REQUEST to PHP router server gets the response and redirects to dashboard if user is logged in.
     * @returns {Promise<Element | never>}
     */
    const checkLogin = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=checkLogin")
            .then(response=>response.text())
            .then(text=>{
                if(parseInt(text) === 1){
                    window.location.href = "/booking_platform/dashboard.html";
                }
                return select("loginform");
            });


    /**
     * gives a listener for the submit of the login form.
     * @param loginForm
     * @returns {*}
     */
    const addEventToForm = (loginForm) => loginForm.addEventListener("submit", (e)=>{

        e.preventDefault();

        const captcha = select("recaptcha");
        const response = grecaptcha.getResponse();

        /**
         * if captcha is not verified, just alert user about the captcha
         */
        if(response.length == 0){
            setAnElementClassToVisible("errorCaptcha");
        }else{
            /**
             * if code reaches here, captcha has been verified, so that is good to go.
             * @type {string}
             */
            const email = select("email").value.trim(); // gets value from input
            const password = select("password").value.trim(); // gets value from input

            /**
             * creating instance of the loginModel with the email and password
             * @type {LoginModel}
             */
            const loginForm = new LoginModel(email, password);

            /**
             * sends an HTTP POST request with the loginForm sent over to the SERVER
             */
            fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify(loginForm) //<- data to be sent over
            }).then(response=>response.text())
                .then(responseText=>{
                    if(parseInt(responseText ) === 1){// if server finds credentials, redirect to dashboard
                        window.location.href = "/booking_platform/dashboard.html";
                    }else{// if server does not finc a user with the email or password entered
                        const errorDiv = select("errorCred"); // alert incorrect credentials
                        errorDiv.style.visibility = "visible";
                        setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
                    }
                }).catch(e=>{
                const errorDiv = select("errorCred");
                errorDiv.style.visibility = "visible";
                setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
            })
        }

    });

    /**
     * main function, calls checkloging and after that adds the form an event.
     */

    const main = () => {
        checkLogin().then(addEventToForm);
    };

    /**
     * main function being called. first thing when window loads
     */
    main();


});