let serviceFieldsFlag = [];
let serviceFields = [];


const validateField = () => {
    serviceFields.map((field, i)=>{
        switch (field.id) {
            case "password": {
                serviceFieldsFlag[i] = passwordFollowsCriteria(field.value);
            }
            case "confirm-password": {
                serviceFieldsFlag[i] = serviceFieldsFlag[i-1];
            }
        }
    })
    console.log(serviceFieldsFlag);
};

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



    //TODO: make this form robust by validation process

    const formElement = select("service-form");
    formElement.addEventListener("submit", (e)=>{
        e.preventDefault();
        const serviceForm = new ServiceProviderFormModel(email.value, password.value,
        confirm_password.value, phone.value, companyName.value,
        firstLineAddress.value, secondLineAddress.value, city.value, eirCode.value);
        formController.registerServiceProvider(serviceForm);
    });


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