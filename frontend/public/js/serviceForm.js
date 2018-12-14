/**
 * Array of booleans that will be mapped to the each fields in the form
 * @type {Array}
 */
let serviceFieldsFlag = [];
/**
 * Array of the HTML fields
 * @type {Array}
 */
let serviceFields = [];


/**
 * This method will get all fields, give a listener to the form on submit event and validate every field
 * @param formController
 */
const handleServiceForm = (formController) => {
    const email = select("email"); // retrieving html element
    const password = select("password"); // retrieving html element
    const confirm_password = select("confirm-password"); // retrieving html element
    const phone = select("phone"); // retrieving html element
    const companyName = select("company-name"); // retrieving html element
    const firstLineAddress = select("first-line-address"); // retrieving html element
    const secondLineAddress = select("second-line-address"); // retrieving html element
    const city = select("city"); // retrieving html element
    const eirCode = select("eir-code"); // retrieving html element


    //getting the form element
    const formElement = select("service-form");
    formElement.addEventListener("submit", (e)=>{ // adding a listener to form
        e.preventDefault();
        /**
         * initialising the ServiceProviderFormModel instance with all of the values of the fields
         * @type {ServiceProviderFormModel}
         */
        const serviceForm = new ServiceProviderFormModel(email.value, password.value,
            confirm_password.value, phone.value, companyName.value,
            firstLineAddress.value, secondLineAddress.value, city.value, eirCode.value);
        if(formIsValid(serviceForm)){ // if form is valid, then send it over to the server to the registration
            alertDiv("You have successfully registered to system! You will be redirected to login page!", "success", 0, select("success-alert"));
            formController.registerServiceProvider(serviceForm);
        }else{// if not, alert user
            alertDiv("The form is not valid! password must contain an Upper case, symbol !$@# and a number char." +
                "All fields must be greater than 3 characters and names must not be numeric", "danger", 0, select("success-alert"))
        }
    });

    /**
     * this function will check each field of the form and update the array of flags according to the validity of the field.
     * @param serviceForm
     * @returns {any}
     */
    const formIsValid = (serviceForm) => {
        const a = Object.keys(serviceForm).map(key=>{
            const field = serviceForm[key];
            if(key.includes("assword")){
                return field.match(
                    new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$&-]).{8,12}$"))!== null &&
                    field === serviceForm["confirm_password"];
            }else if(key.includes("companyNam")){
                return !stringHasNumber(field);
            }else if(key.includes("city")){
                return !stringHasNumber(field);
            }else if(key.includes("second")){
                return serviceForm["first_line_address"].length > 2;
            }else{
                return field.length >= 2;
            }
        });
        console.log(a);
        // return the array of booleans reduced to one boolean.
        return a.reduce((acc, item)=>acc && item);
    };

};

/**
 * On the load of the window, initialise the formController singleton and then call handle form function
 */
window.addEventListener("load", ()=>{

    const formController = ()=> FormController.formController();

    handleServiceForm(formController());

});