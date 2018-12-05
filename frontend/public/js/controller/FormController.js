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
                "Content-T.ype": "application/json; charset=utf-8"
            },
            body: JSON.stringify(customer)
        }).then(response=>response.text())
            .then(text=>{

                if(text == 1){
                    alertDiv("Thanks for subscribing to Booking Platform System" +
                        "You will be redirected to Login page!", "success", 0, select("success-alert"));
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");
                    }, 3000);
                }else{
                    alertDiv("something went terribly wrong. :(((", "danger", 0, select("success-alert"));
                }
            })
    }

    registerServiceProvider(service){
        fetch(this.ROUNTING_URL+"registerServiceProvider",{
            method: "POST",
            headers: {
                "Content-T.ype": "application/json; charset=utf-8"
            },
            body: JSON.stringify(service)
        }).then(response=>response.text())
            .then(text=>{
                console.log(text);
                if(text == 1){
                    alertDiv("Thanks for subscribing to Booking Platform System" +
                        "You will be redirected to Login page!", "success", 0 ,select("success-alert"))
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");
                    }, 3000);
                }else{
                    alertDiv("something went terribly wrong. :(((", "danger", 0,select("success-alert"))
                }
            });

    }


}