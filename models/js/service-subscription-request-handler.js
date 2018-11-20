class ServiceModel {

    constructor(email, password, confirmPassword, phone, companyName, firstLineAddress, secondLineAddress, city, eirCode){
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phone = phone;
        this.companyName = companyName;
        this.firstLineAddress = firstLineAddress;
        this.secondLineAddress = secondLineAddress;
        this.city = city;
        this.eirCode = eirCode;
    }
}

formElement = document.querySelector("#service-form");

const select = (strId)=>document.querySelector(`#${strId}`).value;

formElement.addEventListener("submit", (e)=>{
    e.preventDefault();
    const email = select("email");
    const password = select("password");
    const confirmPassword = select("confirm-password");
    const phone = select("phone");
    const companyName = select("company-name");
    const firstLineAddress = select("first-line-address");
    const secondLineAddress = select("second-line-address");
    const city = select("city");
    const eirCode = select("eir-code");

    const serviceModel = new ServiceModel(email, password, confirmPassword, phone, companyName, firstLineAddress, secondLineAddress, city, eirCode);


    fetch("/booking_platform/controllers/subscribe-service.php", {
        method: "POST",
        headers:{
            "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(serviceModel),
    }).then(response=>response.text())
        .then(responseText=>console.log(responseText));




});
