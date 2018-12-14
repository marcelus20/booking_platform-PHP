/**
 * Will map every field of the customer registration form to a boolean flag (valid or not valid)
 * @type {Array}
 */
let customerFields = [];
/**
 * Array of fields from html form
 * @type {Array}
 */
let formElements = [];

/**
 * on loading of the window... gets the instance of of FOrmController singleton.
 */
window.addEventListener("load", ()=>{
    const formController = () => FormController.formController();
    handleCustomerForm(formController());
});

/**
 * maps each field of the customer form
 * @param formController
 */
const handleCustomerForm = (formController) => {
    const email = select("email");
    const password = select("password");
    const confirm_password = select("confirm-password");
    const phone = select("phone");
    const first_name = select("first-name");
    const last_name = select("last-name");
    // populating formElements array
    formElements = [email, password, confirm_password, phone, first_name, last_name];
    // maping each field to false flag
    customerFields = formElements.map(key=>false);
    /**
     * giving each field in the form a "keyup listener triggering the function checkFormValidation"
     */
    formElements.map((element, index)=>element.addEventListener("keyup", ()=>checkFormValidation()));

    /**
     * Giving a form a "submit" listener calling registerCustomer from formController singleton method class
     * @type {Element}
     */
    const customerSubscription = select("customer-subscription");
    customerSubscription.addEventListener("submit", (e)=>{
        e.preventDefault(); // prevent from refreshing the page
        if(customerFormIsValid()){// if form is valid, encapsulate all fields values in CustomerFormModel class
            const customerForm = new CustomerFormModel( // opening CustomerFormModel constructor
                email.value.trim(), password.value.trim(), confirm_password.value.trim(),
                phone.value.trim(), first_name.value.trim(), last_name.value.trim()
            );
            // finally register customer.
            formController.registerCustomer(customerForm);
        }else{ // if form is not valid, an alert will pop up for user
            manageFormAlerts();
        }
    });
};

/**
 * informs customer that the password fields don't match
 */
const manageFormAlerts = () => {
    customerFields.map((field, index) => {
        switch (field) {
            case !field && (index === 1 || index === 2 ):{
                alertDiv("Password fields don't match! or they do not follow criteria" +
                    "the criteria is to be 8-12 characters at least 1 digit, upper case and symbol !@$#", "danger", 0, select("alerPasswordError"));
            }
        }
    });
};

/**
 * checks if customer registration for is valid by assigning a boolean flag to every index of the array of customerFields
 */
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

/**
 * reduces the array of customerFields to one boolean value for valid or not valid:
 * Eg: [false, false, false, true] returns => false && false && false && true = false!
 * @returns {*|boolean}
 */
const customerFormIsValid = () => {
    return customerFields.reduce((acc, flag) => acc && flag, true)
};