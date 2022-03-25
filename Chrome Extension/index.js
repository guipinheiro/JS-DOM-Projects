const inputBtn = document.querySelector("#input-btn");
const inputEl = document.querySelector("#input-el");
const ulEl = document.querySelector("#ul-el");

let myLeads = [];

// ? Necessary?
ulEl.innerHTML = "";
inputEl.value = "";

//Increase the list of leads with user inputs
const renderLeads = (userInput) => {
    let newItem = document.createElement("li");
    let newLink = document.createElement("a");
    newLink.innerHTML = userInput;
    newLink.href = userInput;
    newLink.target = "_blank";
    newItem.appendChild(newLink);
    ulEl.appendChild(newItem);
};

// Renders local inputs saved in previous sessions
const renderLocal = () => {
    myLeads = JSON.parse(localStorage.getItem("myLeads"));
    myLeads.forEach((element) => {
        renderLeads(element);
    });
};

if (localStorage.getItem("myLeads") != null) {
    renderLocal(); //If any local storage already has inputs, display them when reloading the page
}

//Using event listener instead of html onclick atribute
//Adds user text to a list
inputBtn.addEventListener("click", () => {
    if (inputEl.value != "") {
        let userInput = inputEl.value;
        inputEl.value = "";

        myLeads.push(userInput);

        //Sets in local storage new inputs
        localStorage.setItem("myLeads", JSON.stringify(myLeads));

        renderLeads(userInput);
    }
});
