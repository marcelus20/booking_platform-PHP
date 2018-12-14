/**
 * singleton instance.
 * @type {null}
 * @private
 */
let _formController = null;


/**
 * FormController Class
 *This class will handle the admin user's action and send requests to the backend structure using the so called AJAX
 * Asynchronous Javascript AND XML to the PHP routers backend class.
 */
class FormController{

    /**
     * singleton initializer
     * @returns {*} FormController obj
     */
    static formController (){
        if(_formController == null){// if null, initialise instance
            _formController = new FormController();
        }
        return _formController;return instance
    }


    /**
     * constructor: just has one global constant: the URL to send requests to server
     */
    constructor(){
        this.ROUNTING_URL = "/booking_platform/backend/routers/formControllerRouter.php?executionType="
    }

    /**
     * Takes a customer object and sends it over to PHP router by POST for the registration of this new Customer OBJECT
     * @param customer
     */
    registerCustomer(customer){
        fetch(this.ROUNTING_URL+"registerCustomer",{
            method: "POST",
            headers: {
                "Content-T.ype": "application/json; charset=utf-8"
            },
            body: JSON.stringify(customer)
        }).then(response=>response.text())
            .then(text=>{
                if(text == 1){ // if success, alert success
                    alertDiv("Thanks for subscribing to Booking Platform System" +
                        "You will be redirected to Login page!", "success", 0, select("success-alert"));
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");//redirects person to index after 3 seconds
                    }, 3000);
                }else{ // if failure, alert failure
                    alertDiv("something went terribly wrong. :(((", "danger", 0, select("success-alert"));
                }
            })
    }

    /**
     * takes a service provider and sends it over to PHP router by POST for the Service provider registration
     * @param service
     */
    registerServiceProvider(service){
        fetch(this.ROUNTING_URL+"registerServiceProvider",{
            method: "POST",
            headers: {
                "Content-T.ype": "application/json; charset=utf-8"
            },
            body: JSON.stringify(service)//<-new service provider to be sent over to server
        }).then(response=>response.text())
            .then(text=>{
                console.log(text);
                if(text == 1){ // if success, alert success
                    alertDiv("Thanks for subscribing to Booking Platform System" +
                        "You will be redirected to Login page!", "success", 0 ,select("success-alert"))
                    setTimeout(()=>{
                        window.location.replace("/booking_platform/");
                    }, 3000);
                }else{ // if failure, alert failure.
                    alertDiv("something went terribly wrong. :(((", "danger", 0,select("success-alert"))
                }
            });

    }


}