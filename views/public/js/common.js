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
};

const clearAlertdiv = () => {
    const alertUpdateElement = document.querySelector("#alertUpdate");
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

