
const form = document.querySelector("#customer-subscription");


class CustomerFormModel {
    constructor(email, password, confirmPass, phone, firstName, lastName) {
        this.email = email;
        this.password = password;
        this.confirmPass = confirmPass;
        this.phone = phone;
        this.firstName = firstName;
        this.lastName = lastName;
    }

}

// const buildCustomerFormModel = () =>{};


const select = (strId) =>document.querySelector(`#${strId}`).value;


form.addEventListener("submit", (event)=>{
    event.preventDefault();


    try {
        const email = select("email");
        const password = select("password");
        const confirmPassword = select("confirm-password");
        const phone = select("phone");
        const firstName = select("first-name");
        const lastName = select("last-name");


        const formModel = new CustomerFormModel(email, password, confirmPassword, phone, firstName, lastName);
        console.log(formModel);
        fetch("/booking_platform/controllers/subscribe-customer.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(formModel)
        }).then((data) => data.text())
            .then(text => console.log(text));
    }catch (e) {
        console.log(e);
    }
    return false;
});