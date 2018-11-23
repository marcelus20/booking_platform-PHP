let state = {};


const inputElement = document.querySelector("#searchEngine");

const searchBarber = (value) =>{
    const obj = {};
    obj.fullName = value;


    fetch("/booking_platform/controllers/searchBarbers.php", {
       method: "POST",
       headers: {
           "Content-Type": "application/json; charset=utf-8"
       },
       body: JSON.stringify(obj)
   })
       .then(response=>response.text())
       .then(responseText=>{
           state.barbers = JSON.parse(responseText);
           fectchToHTML();
       });
};

const fectchToHTML = () => {
    let innerHTMLSTR = `<ul class="list-group">`;
    state.barbers.map((barber, index)=>{
        innerHTMLSTR += `
    <li class="list-group-item" key="index" id="barber${index}">
        ${barber[0]}
        <div id="barberFull${index}" onclick="fetchFullResults(${index})" ></div>
    </li>`
    });
    innerHTMLSTR += `</ul>`;
    document.querySelector("#table").innerHTML = innerHTMLSTR;

};

const fetchFullResults = (barberIndex) => {
    console.log(barberIndex);
};


inputElement.addEventListener("keypress",()=>{
   const value = inputElement.value;
   searchBarber(value);
});