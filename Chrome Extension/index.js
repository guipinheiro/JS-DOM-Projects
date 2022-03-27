const inputBtn = document.querySelector("#input-btn");
const inputEl = document.querySelector("#input-el");
const clearBtn = document.querySelector("#clear-btn");
const ulEl = document.querySelector("#ul-el");

let myLeads = [];

// ? Necessary?
ulEl.innerHTML = "";
inputEl.value = "";

let localLeads = localStorage.getItem("myLeads");

//Increase the list of leads with user inputs
const render = (userInput) => {
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
    let leads = JSON.parse(localLeads);
    leads.forEach((element) => {
        render(element);
    });
    return leads;
};

//If any local storage already has inputs, display them when reloading the page
if (localLeads) {
    myLeads = renderLocal();
}

//Adds user text to a list
inputBtn.addEventListener("click", () => {
    if (inputEl.value != "") {
        let userInput = inputEl.value;
        inputEl.value = "";

        myLeads.push(userInput);

        //Sets in local storage new inputs
        localStorage.setItem("myLeads", JSON.stringify(myLeads));

        render(userInput);
    }
});

//Clear localStorage history and list of leads
clearBtn.addEventListener("click", () => {
    const result = window.confirm("Are you sure you want to clear your leads?");

    if (result) {
        localStorage.removeItem("myLeads");
        ulEl.innerHTML = "";
        myLeads = [];
    }
});
