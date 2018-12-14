/**
 * This function populates an HTML div with the ID of alertUpdate
 * with a message passed by parameter and styles it using the
 * alert class.
 * THe expected string values for type are:
 *  - info
 *  - danger
 *  - warning
 *  - success
 *  - secondary.
 * @param msg
 * @param type
 * @param time -- time out time for the alert to vanish.
 */
const alertUpdate = (msg, type, time=2000) => {
    let alertType = "";
    if(type === "info"){
        alertType = "alert alert-info"
    }else if (type === "danger"){
        alertType = "alert alert-danger";
    }else if (type === "warning"){
        alertType = "alert alert-warning";
    }else if (type === "success"){
        alertType = "alert alert-success";
    }else if (type === "secondary"){
        alertType = "alert alert-secondary";
    }
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.innerHTML = msg;
    alertUpdateElement.setAttribute("class", alertType);  // assiging alerttype to the class html attribute
    alertUpdateElement.setAttribute("role", "alert");

    /**
     * if time is specified  to 0, then the timeout function will never be triggered.
     * therefore the alert will remain forever in the div until user changes page or refreshes page.
     */
    if(time != 0){
        setTimeout((()=>{
            clearAlertdiv(); // clear the div.
        }), time);
    }


};

/**
 * Similar to the alertUpdate, this function is dynamic for all other divs, you just need to pass the div
 * in the forth parameter of the function parameter list.
 * sa div with the alert style and populates it with the text "msg" passed by parameter
 * @param msg -> text to populate the div element
 * @param type -> the type of the alert
 * @param time -> time for the alert to vanish
 * @param div -> the div that will be affected by this function
 */
const alertDiv = (msg, type, time = 2000 ,div) => {
    let alertType = "";
    if(type === "info"){
        alertType = "alert alert-info"
    }else if (type === "danger"){
        alertType = "alert alert-danger";
    }else if (type === "warning"){
        alertType = "alert alert-warning";
    }else if (type === "success"){
        alertType = "alert alert-success";
    }
    div.innerHTML = msg;
    div.setAttribute("class", alertType); // set class html attribute to the alertType variable
    div.setAttribute("role", "alert");

    if(time !== 0){
        setTimeout((()=>{
            clearDiv(div);
        }), time);
    }

};

/**
 * this div will clear the alert by removing its class style an assigning the innerHTML attribute of the div to
 * empty string.
 * @param div -> to be cleared
 */
const clearDiv = (div) => {
    div.setAttribute("class", "");
    div.setAttribute("role", "alert");
    div.innerHTML = "";
};

/**
 * this method is to clear the div with the ID of alertUpdate. it removes the alert style and clears the text
 * within the div.
 */
const clearAlertdiv = () => {
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.setAttribute("class", ""); // set class attribute to an empty string
    alertUpdateElement.setAttribute("role", "alert");
    alertUpdateElement.innerHTML = ""; // clears the text
};

/**
 * this function leads the user to the HOME page, so redirects to dashboard.html
 */
const goToHome = () => {
    window.location.replace("/booking_platform/dashboard.html");
};

/**
 * gets a date index. If index has a length of 1, it adds 0 to the left side, else it just returns the date index
 * Eg: add0ToTheLeft(2) returns -> "02"; add0ToTheLeft(10) -> returns "10"
 * @param dateIndex
 * @returns {string}
 */
const add0ToTheLeft = (dateIndex) =>{
    return String(dateIndex).length===1?"0"+dateIndex:dateIndex;
};

/**
 * takes a date object and returns the string format to the mysql timestamp : "YYYY-mm-dd"
 * @param date
 * @returns {string}
 */
const formatDateWithPaddedZero = (date) => {
    return  date.getFullYear()+ "-"+ add0ToTheLeft(date.getMonth()+1)+"-"+add0ToTheLeft(date.getDate());
};

/**
 * takes a date object and returns the string format to the mysql timestamp : "YYYY-mm-dd HH:MM:SS"
 * @param date
 * @returns {string}
 */
const formatDateAndTimeWithPaddedZero = (date) => {
    return  date.getFullYear()+ "-"+ add0ToTheLeft(date.getMonth()+1)+"-"+add0ToTheLeft(date.getDate()) +
        " "+add0ToTheLeft(date.getHours()) + ":" + add0ToTheLeft(date.getMinutes());
};

/**
 * takes a date object and returns just the string format of the sql.time format "HH:MM:SS"
 * @param date
 * @returns {string}
 */
const getTimeFromDate = (date) => {
    return add0ToTheLeft(date.getHours()) + ":" + add0ToTheLeft(date.getMinutes()) + ":" + add0ToTheLeft(date.getSeconds());
};

/**
 * this function will only work if paramenter is a string representation of a date in the following format:
 * YYYY-MM-DD HH:MM:SS
 * returns just the time from the dateString timestamp format by spliting it to the whitespace
 * */
const getTimeFromDateString = (dateString) => dateString.split(" ")[1];

/**
 * This function returns the HTML element by passing the element id.
 * @param strId -> the id of the HTML element you want to get.
 * A more fancy way of using getElementById();
 * @returns {Element}
 */
const select = (strId) => document.querySelector("#"+strId);

/**
 * this function takes an ID of an HTML elmenent and makes it invisible.
 * @param id
 */
const setAnElementClassToInvisible = (id) => select(id).classList.add("invisible");

/**
 * This function takes the HTML element and makes it visible
 * @param element
 */
const setAnElementToVisible = (element)=> element.classList.remove("invisible");

/**
 * This function takes an HTML element and makes it invisible
 * @param element
 */
const setAnElementToInvisible = (element)=> element.classList.add("invisible");

/**
 * This function takes an ID of a HTML element and makes the element visible
 * @param id
 */
const setAnElementClassToVisible = (id) => select(id).classList.remove("invisible");

/**
 * This function takes a barber ID and a bookingStatus and draw an HTML table with the options about the review of a booking
 * and a possibility for the customer to cancel the appointment after the user clicked on the list item.
 * It basically toggle table options
 * @param barberId
 * @param bookingStatus
 * @returns {string}
 */
const showColapsedBooking = (barberId, bookingStatus) => {
    const reviewOptions = ["END_OF_THE_WORLD", "TERRIBLE", "BAD", "MEH", "OK", "GOOD", "VERY_GOOD", "SUPERB", "PERFECT"];
    return `
    <h3>booking Options</h3>
    <div class="alert alert-light" role="alert">      
        <h3 class="display-3">You cannot give a review to a booking that is not complete!</h3>
        <h3 class="display-3">You cannot cancel an appointment that is already complete</h3>  
    </div>
    
    <table class="table">
        <tr>            
            <td>
                <h4>REVIEW OPTION</h4>
                <form>
                     <div class="form-group">
                        <select class="form-control" id="reviewSelect"><option value="">Choose an option</option>
                            ${
        reviewOptions.map(option=>`<option value=${option}>${option}</option>`)
            .reduce((acc, next)=>acc+next)
        }
                        </select>
                        <button type="button" class="btn btn-secondary" id="submit-review" 
                            ${bookingStatus !== 'COMPLETE'? "disabled":""} onclick="updateReview(${barberId})">
                            submit review
                        </button>
                    </div>
                </form> 
            </td>
            <td>
                <button type="button" class="btn btn btn-danger" 
                    ${bookingStatus === 'COMPLETE'?"disabled":""} onclick="cancelBooking(${barberId})">
                    Cancel Appointment
                </button>
            </td>
        </tr>
    </table>
    `;
};

/**
 * this function gets the datePicker object and set the attribute min to today's date.
 * This function makes sure the the option of chosing a date prior to today is blocked.
 * @returns {Element}
 */
const confDatePicker = ()=> {
    const datePicker = select("datePicker");
    datePicker.setAttribute("min", formatDateWithPaddedZero(new Date()));
    return datePicker;
} ;

/**
 * returns true if password matches regex or false if not by checking the size of the resulting array.
 * Regex is for checking the SYMBOL
 * @param password
 * @returns {boolean}
 */
const passwordHasOneSymbol = (password)=>password.match(new RegExp('[!#@&\\d&Ñ]')).length > 0;

/**
 * returns true if password matches regex or false if not by checking the size of the resulting array.
 * @param password
 * @returns {boolean}
 */
const passwordHasOneCapital = (password)=>password.match(new RegExp('[A-Z0-9\\d&Ñ]')).length >0;

/**
 * returns true if password is greater than 7 length and lower than 13 or false if it is not between this range.
 * @param password
 * @returns {boolean}
 */
const passwordFollowsCriteria = (password) => (password.length > 7 && password.length <13)
    && passwordHasOneCapital(password);


/**
 * This function returns true if if there is a number in the string.
 * usually to validate name or city in form fields.
 * @param str
 * @returns {boolean}
 */
const stringHasNumber = (str) => {
    for(let char of str.split("")){// loops through the chars of the string
        if(!isNaN(char)){// if it is a number, return true straight away
            return true;
        }
    }
    // if code reaches here, then the whole string has no numbers.
    return false;

};

/**
 * Checks if password a is equal password B
 * @param passA
 * @param passB
 * @param flagFields
 */
const checkPasswordFields = (passA, passB, flagFields) => {
    flagFields[1] = passA === passB && passwordFollowsCriteria(passA) && passwordHasOneSymbol(passA);
    flagFields[2] = passA === passA;
};

