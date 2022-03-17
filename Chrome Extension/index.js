const inputBtn = document.querySelector("#input-btn");
const inputEl = document.querySelector("#input-el");

let myleads = []; 
let myInput = inputEl.textContent;

//Using event listernet instead of html onclick atribute  
inputBtn.addEventListener("click", function() {
        alert(myInput);
    });