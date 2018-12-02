const alertUpdate = (msg, type) => {
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
    const alertUpdateElement = document.querySelector("#alertUpdate");
    alertUpdateElement.innerHTML = msg;
    alertUpdateElement.setAttribute("class", alertType);
    alertUpdateElement.setAttribute("role", "alert");

    setTimeout((()=>{
        clearAlertdiv();
    }), 2000);

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

const add0ToTheLeft = (dateIndex) => {
    return dateIndex+"".length===1?"0"+dateIndex:dateIndex;
};

const formatDateWithPaddedZero = (date) => {
    return  date.getFullYear()+ "-"+ add0ToTheLeft(date.getMonth()+1)+"-"+add0ToTheLeft(date.getDate());
};

const select = (strId) => document.querySelector("#"+strId);

const setAnElementClassToInvisible = (id) => select(id).classList.add("invisible");

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


