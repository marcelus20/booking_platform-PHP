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
    alertUpdateElement.setAttribute("class", alertType);
    alertUpdateElement.setAttribute("role", "alert");

    if(time != 0){
        setTimeout((()=>{
            clearAlertdiv();
        }), time);
    }


};

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
    div.setAttribute("class", alertType);
    div.setAttribute("role", "alert");

    if(time !== 0){
        setTimeout((()=>{
            clearDiv(div);
        }), time);
    }

};

const clearDiv = (div) => {
    div.setAttribute("class", "");
    div.setAttribute("role", "alert");
    div.innerHTML = "";
};

const clearAlertdiv = () => {
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.setAttribute("class", "");
    alertUpdateElement.setAttribute("role", "alert");
    alertUpdateElement.innerHTML = "";
};

const goToHome = () => {
    const mainDiv = document.querySelector("#table");
    mainDiv.innerHTML = "THIS IS HOME";
};

const add0ToTheLeft = (dateIndex) =>{
    return String(dateIndex).length===1?"0"+dateIndex:dateIndex;
};

const formatDateWithPaddedZero = (date) => {
    return  date.getFullYear()+ "-"+ add0ToTheLeft(date.getMonth()+1)+"-"+add0ToTheLeft(date.getDate());
};

const formatDateAndTimeWithPaddedZero = (date) => {
    return  date.getFullYear()+ "-"+ add0ToTheLeft(date.getMonth()+1)+"-"+add0ToTheLeft(date.getDate()) +
        " "+add0ToTheLeft(date.getHours()) + ":" + add0ToTheLeft(date.getMinutes());
};

const getTimeFromDate = (date) => {
    return add0ToTheLeft(date.getHours()) + ":" + add0ToTheLeft(date.getMinutes()) + ":" + add0ToTheLeft(date.getSeconds());
};

//this function will only work if paramenter is a string representation of a date in the following format:
//YYYY-MM-DD HH:MM:SS
const getTimeFromDateString = (dateString) => dateString.split(" ")[1];

const select = (strId) => document.querySelector("#"+strId);

const setAnElementClassToInvisible = (id) => select(id).classList.add("invisible");

const setAnElementToVisible = (element)=> element.classList.remove("invisible");

const setAnElementToInvisible = (element)=> element.classList.add("invisible");

const setAnElementClassToVisible = (id) => select(id).classList.remove("invisible");

const showColapsedBooking = (barberId) => {
    const reviewOptions = ["END_OF_THE_WORLD", "TERRIBLE", "BAD", "MEH", "OK", "GOOD", "VERY_GOOD", "SUPERB", "PERFECT"];
    return `
    <h3>booking Options</h3>
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
                        <button type="button" class="btn btn-secondary" id="submit-review" onclick="updateReview(${barberId})">
                            submit review
                        </button>
                    </div>
                </form> 
            </td>
            <td>
                <button type="button" class="btn btn btn-danger" onclick="cancelBooking(${barberId})">
                    Cancel Appointment
                </button>
            </td>
        </tr>
    </table>
    `;
};

const confDatePicker = ()=> {
    const datePicker = select("datePicker");
    datePicker.setAttribute("min", formatDateWithPaddedZero(new Date()));
    return datePicker;
} ;

const passwordHasOneSymbol = (password)=>password.match(new RegExp('[!#@&\\d&Ñ]')).length > 0;
const passwordHasOneCapital = (password)=>password.match(new RegExp('[A-Z0-9\\d&Ñ]')).length >0;

const passwordFollowsCriteria = (password) => (password.length > 7 && password.length <13)
    && passwordHasOneCapital(password);

const stringHasNumber = (str) => {
    for(let char of str.split("")){

        if(!isNaN(char)){
            return true;
        }
    }
    return false;

};

const checkPasswordFields = (passA, passB, flagFields) => {
    flagFields[1] = passA === passB && passwordFollowsCriteria(passA) && passwordHasOneSymbol(passA);
    flagFields[2] = passA === passA;
};

