let serviceFieldsFlag = [];
let serviceFields = [];



const handleServiceForm = (formController) => {
    const email = select("email");
    const password = select("password");
    const confirm_password = select("confirm-password");
    const phone = select("phone");
    const companyName = select("company-name");
    const firstLineAddress = select("first-line-address");
    const secondLineAddress = select("second-line-address");
    const city = select("city");
    const eirCode = select("eir-code");



    const formElement = select("service-form");
    formElement.addEventListener("submit", (e)=>{
        e.preventDefault();
        const serviceForm = new ServiceProviderFormModel(email.value, password.value,
            confirm_password.value, phone.value, companyName.value,
            firstLineAddress.value, secondLineAddress.value, city.value, eirCode.value);
        if(formIsValid(serviceForm)){
            alertDiv("You have successfully registered to system! You will be redirected to login page!", "success", 0, select("success-alert"));
            formController.registerServiceProvider(serviceForm);
        }else{
            alertDiv("The form is not valid! password must contain an Upper case, symbol !$@# and a number char." +
                "All fields must be greater than 3 characters and names must not be numeric", "danger", 0, select("success-alert"))
        }
    });

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
        return a.reduce((acc, item)=>acc && item);
    };




    // serviceFields = [email, password, confirm_password, phone, companyName, firstLineAddress, secondLineAddress, city, eirCode];
    //
    // serviceFieldsFlag = serviceFields.map(field=>false);
    //
    // serviceFields.map((field, index) => field.addEventListener("keyup", ()=>validateField()));

};

window.addEventListener("load", ()=>{

    const formController = ()=> FormController.formController();

    handleServiceForm(formController());

});