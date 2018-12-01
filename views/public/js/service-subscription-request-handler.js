class ServiceModel {

    constructor(email, password, confirmPassword, phone, companyName, firstLineAddress, secondLineAddress, city, eirCode){
        this.email = email.trim();
        this.password = password.trim();
        this.confirmPassword = confirmPassword.trim();
        this.phone = phone.trim();
        this.companyName = companyName.trim();
        this.firstLineAddress = firstLineAddress.trim();
        this.secondLineAddress = secondLineAddress.trim();
        this.city = city.trim();
        this.eirCode = eirCode.trim();
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

    try{
        fetch("/booking_platform/controllers/subscribe-service.php", {
            method: "POST",
            headers:{
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(serviceModel),
        }).then(response=>response.text())
            .then(responseText=>{
                const message = document.querySelector("#alert");
                message.innerHTML =
                    `<div class="alert alert-success" role="alert">
                    Your data has been saved to the database. You may be able to login now
                 </div>`;
                console.log(responseText)

            });

    }catch (e) {
        console.log(e);
        const message = document.querySelector("#alert");
        message.innerHTML = `
        <div class="alert alert-warning" role="alert">
            Something went wrong - ${e}
        </div>
        `;
    }

});
