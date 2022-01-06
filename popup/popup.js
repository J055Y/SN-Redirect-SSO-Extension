const urlIgnoreList = document.getElementById("urlIgnoreList");
const newUrlPrefixInput = document.getElementById("newUrlPrefixInput");
const addUrlBtn = document.getElementById("addUrlBtn");
const urlTableBody = document.querySelector("tbody");

let instanceNames = [];

/**
 * Updates the stored array of instance names to ignore
 */
function updateInstanceNames() {
    chrome.storage.local.set({
        "instance_names": instanceNames
    });
}

/**
 * Creates a new row containing a cell with the instance URL and a cell 
 * that when clicked, removes the instance from the instanceNames list
 * 
 * @param {String} name Name of instance to insert into displayed URL
 */
function createListElem(name) {
    let tr = document.createElement("tr");

    let urlCell = document.createElement("td");
    urlCell.textContent = "https://" + name + ".service-now.com";
    tr.appendChild(urlCell);

    let closeCell = document.createElement("td");
    closeCell.innerHTML = "&#10006;";
    closeCell.className = "closeCell";
    closeCell.setAttribute("data-name", name);
    closeCell.addEventListener("click", e => {
        console.log(e.target);
        e.target.parentElement.style.display = "none";
        let name = e.target.getAttribute("data-name");
        let nameIndex = instanceNames.indexOf(name);
        if (nameIndex !== -1) {
            instanceNames.splice(nameIndex, 1);
            updateInstanceNames();
        }
    });
    tr.appendChild(closeCell);

    urlTableBody.appendChild(tr);
}

chrome.storage.local.get(["instance_names"], function (item) {
    if (Array.isArray(item.instance_names)) {
        instanceNames = item.instance_names;
        instanceNames.forEach(name => {
            createListElem(name);
        });
    }
});

/**
 * Pushes the entered instance name to the instanceNames array and
 * updates the stored list of instance names
 */
addUrlBtn.onclick = () => {
    if (newUrlPrefixInput.value.length > 0) {
        console.log(instanceNames);
        instanceNames.push(newUrlPrefixInput.value);
        updateInstanceNames();
        createListElem(newUrlPrefixInput.value);
    }
}