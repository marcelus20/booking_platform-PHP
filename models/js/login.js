
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

    fetch("/booking_platform/controllers/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(loginForm)
    }).then(response=>response.text())
        .then(responseText=>{
            console.log(responseText);
            if(responseText.includes("again")){
                const errorDiv = document.querySelector("#errorAlert");
                errorDiv.innerHTML = `
                <div class="alert alert-warning" role="alert">
                    ${responseText}
                </div>
            `;
            }else{
                window.location.replace("http://localhost/booking_platform/views/public/dashboard.php");
            }

        }).catch(e=>{
            const errorDiv = document.querySelector("#errorAlert");
            errorDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    something went wrong ${e};
                </div>
            `;
    })


});