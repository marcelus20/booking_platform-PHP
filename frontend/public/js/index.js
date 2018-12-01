
class LoginModel{
    constructor(email, password){
        this.email = email;
        this.password = password;
    }
}
const select = (strId) => document.querySelector("#"+strId).value;
const loginForm = document.querySelector("#loginform");

loginForm.addEventListener("submit", (e)=>{

    e.preventDefault();

    const email = select("email").trim();
    const password = select("password").trim();

    const loginForm = new LoginModel(email, password);

        fetch("/booking_platform/backend/controllers/login.php", {
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
                const errorDiv = document.querySelector("#errorCred");
                errorDiv.style.visibility = "visible";
                setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
            }
        }).catch(e=>{
            const errorDiv = document.querySelector("#errorCred");
            errorDiv.style.visibility = "visible";
            setTimeout((()=> errorDiv.style.visibility = "hidden"), 2000);
    })

});