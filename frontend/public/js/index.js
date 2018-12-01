window.addEventListener("load", ()=>{
    const select = (strId) => document.querySelector("#"+strId).value;
    const loginForm = document.querySelector("#loginform");

    loginForm.addEventListener("submit", (e)=>{

        e.preventDefault();

        const email = select("email").trim();
        const password = select("password").trim();

        const loginForm = new LoginModel(email, password);

        fetch("/booking_platform/backend/routers/mainControllerRouter.php?executionType=login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(loginForm)
        }).then(response=>response.text())
            .then(responseText=>{
                console.log(responseText);
                if(parseInt(responseText ) === 1){
                    window.location.href = "http://localhost/booking_platform/dashboard.html";
                }else{
                    const errorDiv = document.querySelector("#errorCred");
                    errorDiv.style.visibility = "visible";
                    setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
                }
            }).catch(e=>{
                console.log(e);
                const errorDiv = document.querySelector("#errorCred");
                errorDiv.style.visibility = "visible";
                setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
        })

    });
});