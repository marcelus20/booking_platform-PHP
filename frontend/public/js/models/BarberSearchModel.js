/**
 * This model class is used by customerController to send HTTP POST request to the routers
 * for retrieving a list of services providers with the name contained in the fullName attribute.
 *
 * Eg: set a request with {"fullName": "a"} -> server will return all services providers that has "a" in the name.
 */
class BarberSearchModel {
    constructor(fullName){
        this.fullName = fullName;
    }
}