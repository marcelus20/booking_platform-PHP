window.addEventListener("load", ()=>{
    const checkLogin = () =>
        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=checkLogin")
            .then(response=>response.text())
            .then(text=>{
                if(parseInt(text) === 1){
                    window.location.href = "http://localhost/booking_platform/dashboard.html";
                }

                return select("loginform");
            });


    const addEventToForm = (loginForm) => loginForm.addEventListener("submit", (e)=>{

        e.preventDefault();

        const email = select("email").value.trim();
        const password = select("password").value.trim();

        const loginForm = new LoginModel(email, password);

        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(loginForm)
        }).then(response=>response.text())
            .then(responseText=>{
                if(parseInt(responseText ) === 1){
                    window.location.href = "http://localhost/booking_platform/dashboard.html";
                }else{
                    const errorDiv = select("errorCred");
                    errorDiv.style.visibility = "visible";
                    setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
                }
            }).catch(e=>{
                const errorDiv = select("errorCred");
                errorDiv.style.visibility = "visible";
                setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
            })

    });

    const main = () => {
        checkLogin().then(addEventToForm);
    };


    main();


});