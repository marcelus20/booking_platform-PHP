
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

    const email = select("email");
    const password = select("password");

    const loginForm = new LoginModel(email, password);

    fetch("/booking_platform/private/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(loginForm)
    }).then(response=>response.text())
        .then(responseText=>console.log(responseText))


});