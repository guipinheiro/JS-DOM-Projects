const inputBtn = document.querySelector("#input-btn");
const inputEl = document.querySelector("#input-el");
const ulEl = document.querySelector("#ul-el");

let myLeads = [];

// ? Necessary?
ulEl.innerHTML = "";
inputEl.value = "";

//Using event listener instead of html onclick atribute
//Adds user text to a list
inputBtn.addEventListener("click", () => {
    if (inputEl.value != "") {
        let userInput = inputEl.value;

        myLeads.push(userInput);

        let newItem = document.createElement("li");
        let newLink = document.createElement("a");
        newLink.innerHTML = userInput;
        newLink.href = userInput;
        newLink.target = "_blank";
        newItem.appendChild(newLink);
        ulEl.appendChild(newItem);
        inputEl.value = "";
    }

    //! not good practice. Reloads the whole HTML (might destroy events, is slow)
    ////ulEl.innerHTML += `<li>${inputEl.value}</li>`;
});

// testing
//// myLeads.forEach((leads) => {
////     ulEl.innerHTML += `<li>${leads}</li>`;
////});
