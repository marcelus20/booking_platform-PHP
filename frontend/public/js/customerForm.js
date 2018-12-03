let customerFields = [];
let formElements = [];

window.addEventListener("load", ()=>{
    const formController = () => FormController.formController();
    handleCustomerForm(formController());
});

const handleCustomerForm = (formController) => {
    const email = select("email");
    const password = select("password");
    const confirm_password = select("confirm-password");
    const phone = select("phone");
    const first_name = select("first-name");
    const last_name = select("last-name");

    formElements = [email, password, confirm_password, phone, first_name, last_name];

    customerFields = formElements.map(key=>false);

    formElements.map((element, index)=>element.addEventListener("keyup", ()=>checkFormValidation()));

    const customerSubscription = select("customer-subscription");
    customerSubscription.addEventListener("submit", (e)=>{
        e.preventDefault();
        if(customerFormIsValid()){
            const customerForm = new CustomerFormModel(
                email.value.trim(), password.value.trim(), confirm_password.value.trim(),
                phone.value.trim(), first_name.value.trim(), last_name.value.trim()
            );

            formController.registerCustomer(customerForm);
        }else{
            manageFormAlerts();
        }
    });
};

const manageFormAlerts = () => {
    customerFields.map((field, index) => {

        switch (field) {
            case !field && (index === 1 || index === 2 ):{
                alertDiv("Password fields don't match!", "danger", select("alerPasswordError"));
            }
            case !field && index === 3:{
                alertDiv("This field must contain at least 2 characters", "danger", select("alerPhoneError"));
            }
            case !field && index === 4:{
                alertDiv("This field must contain at least 2 characters", "danger", select("alerFirstNameError"));
            }
            case !field && index === 5:{
                alertDiv("This field must contain at least 2 characters", "danger", select("alertSecondNameError"));
            }
        }
    });
};

const checkFormValidation = ()=> {
    checkPasswordFields(formElements[1].value, formElements[2].value, customerFields);
    formElements.map((element, index)=>{
        if(element.value.trim().length > 1){
            if(element.id !== "password" && element.id !== "confirm-password"){
                customerFields[index] = true;
            }

        }else{
            customerFields[index] = false;
        }
    });
};

const customerFormIsValid = () => {
    return customerFields.reduce((acc, flag) => acc && flag, true)
};