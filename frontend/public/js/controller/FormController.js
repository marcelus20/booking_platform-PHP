let _formController = null;


class FormController{

    static formController (){
        if(_formController == null){
            _formController = new FormController();
        }
        return _formController;
    }


    constructor(){
        this.ROUNTING_URL = "/booking_platform/backend/routers/formControllerRouter.php?executionType="
    }

    registerCustomer(customer){
        fetch(this.ROUNTING_URL+"registerCustomer",{
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(customer)
        }).then(response=>response.text())
            .then(text=>{
                console.log(text);
                console.log(customer);
                if(text == 1){
                    alertDiv("Thanks for subscribing to Booking Platform System" +
                        "You will be redirected to Login page!", "success", select("success-alert"))
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");
                    }, 3000);
                }else{
                    alertDiv("something went terribly wrong. :(((", "danger", select("success-alert"))
                }
            })
    }


}