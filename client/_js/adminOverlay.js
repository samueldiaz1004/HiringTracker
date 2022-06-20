const user = JSON.parse(localStorage.getItem('UserInfo'));

if(!user) {
    alert("User not authenticated");
    location.href = "http://localhost:8080/login.html";
} else {
    let token = user.accessToken;
    fetch('http://localhost:8080/api/auth/isAuthenticated', {
        method: 'GET',
        headers: {
            'x-access-token': token
        }
    }).then(res => res.json()).then(json => {
        if (json.message !== 'Is Authenticated') {
            alert("Token is no longer valid");
            logout();
        } else {
            fetch('http://localhost:8080/api/test/admin', {
            method: 'GET',
            headers: {
                'x-access-token': token
            }}).then(response => response.json()).then(json => {
                if(json.message !== 'Admin Content') {
                    alert("You don't have access to this resource");
                    location.href = "http://localhost:8080/index.html";
                }
            })
        }
    })
}


const userNameCorner = document.getElementById('user-name');
userNameCorner.innerHTML = JSON.parse(localStorage.getItem('UserInfo')).fullName
const userTypeCorner = document.getElementById('user-type');
userTypeCorner.innerHTML = JSON.parse(localStorage.getItem('UserInfo')).userType


const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function(e) {
    logout();
})

function logout() {
    fetch('http://localhost:8080/logout', {
      method: 'POST',
      body: JSON.stringify({
        email: JSON.parse(localStorage.getItem('UserInfo')).email
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())
    .then(json => {
        localStorage.removeItem('UserInfo');
        location.href = 'http://localhost:8080/login.html';
    })
}

fetch('http://localhost:8080/user/get-all')
  .then(response => response.json())
  .then(data => {populateTable(data["usersArray"])
        arrayUsers = data["usersArray"]})


fetch('http://localhost:8080/holidays')
.then(response => response.json())
.then(dataHoliday => {populateHolidayTable(dataHoliday["holidays"])
        arrayHolidays = dataHoliday["holidays"]})

var filter;
var search;
document.querySelector('#searchBar').addEventListener('keypress', function (e) {
if (e.key === 'Enter') {
    
    filter = document.querySelector('#filter').value.toString();
    search = document.querySelector("#searchBar").value.toString();

    if(!search) {
        search = ""
    }

    fetch(`http://localhost:8080/user/get/${filter}/${search}`)
    .then(response => response.json())
    .then(data => data["usersArray"])
    .then(arrayCandidates => {
        console.log(arrayCandidates)
        if(arrayCandidates){
            emptyTable();
            populateTable(arrayCandidates)
        }
    })
}
});

function emptyTable(){
    let len = tableBody.rows.length
    for(var i=0; i<len; i++) {
      tableBody.deleteRow(0);
    }
}

function populateHolidayTable(data){
    data.forEach(rowData => {
        let row = tableHoliday.insertRow();
        let reason = row.insertCell(0);
        reason.innerHTML = rowData["name"];
        let date = row.insertCell(1);
        date.innerHTML = rowData["date"];
    });
}

function populateTable(data){
    data.forEach(rowData => {
        let row = tableBody.insertRow();
        let userEmail = row.insertCell(0);
        userEmail.innerHTML = rowData["email"];
        let userName = row.insertCell(1);
        userName.innerHTML = rowData["firstName"]+" "+rowData["lastName"];
        let typeUser = row.insertCell(2);
        typeUser.innerHTML = rowData["userType"];
        let online = row.insertCell(3);
        if(rowData["onlineStatus"] == null || rowData["onlineStatus"] == 'Absent'){
            online.innerHTML = "Absent";
            online.classList.add('absent');
        }else if(rowData["onlineStatus"] == "Active"){
            online.innerHTML = "Active";
        }
        let dep = row.insertCell(4);
        dep.innerHTML = rowData["department"];
    });
    
    for(var i = 0; i < tableBody.rows.length; i++){
        tableBody.rows[i].style.cursor = "pointer";
        tableBody.rows[i].onclick = function() {
            rowIndex = this.rowIndex-1;
            console.log(rowIndex);
        }
    }
}

// Table
var table = document.querySelector(".content-table");
var tableBody = document.querySelector(".tableBody");
var checked = document.querySelectorAll(".checkbox");
var rowIndex = -1;

// Form fields
var email = document.querySelector('input[name="Email"]');
var password = document.querySelector('input[name="Password"]');
var fName = document.querySelector('input[name="Name"]');
var lName = document.querySelector('input[name="LastName"]');
var dep = document.querySelector('input[name="Department"]');
var form = [email,password,fName,lName,dep];

//Form field non business day
var day = document.querySelector('input[name="Day"]');
var reason = document.querySelector('input[name="Reason"]');

//Table Holiday
var tableHoliday = document.querySelector(".tableBodyHoliday");

// Multiple selections
var general = document.querySelector("#general");
var consultant = document.querySelector("#consultant");
var admin = document.querySelector("#admin");
let userTypeList = [general,consultant,admin];

// Buttons
const removeBtn = document.querySelector("#remove");
const submitBtn = document.querySelector("#register");
const saveBtn = document.querySelector("#save");

var arrayUsers;

// Add click event to table rows
// function selectedRow(){
//     for(var i = 0; i < tableBody.rows.length; i++){
//         tableBody.rows[i].style.cursor = "pointer";
//         tableBody.rows[i].onclick = function() {
//             var currIndex = rowIndex;
//             rowIndex = this.rowIndex;
//             console.log(rowIndex);
//             Default selection
//             if(rowIndex === -1){
//                 checked[rowIndex-1].checked = true;
//             }
//             // Select same box twice to uncheck box
//             else if(rowIndex === currIndex){
//                 checked[rowIndex-1].checked = false;
//                 rowIndex = -1;
//             }
//             // Another box is selected
//             else if(currIndex !== rowIndex){
//                 checked[rowIndex-1].checked = true;
//                 checked[currIndex-1].checked = false;
//             }
//         }
//     }
// }

//Fills modal fields with selected row
function fillModal(){
    var selectedUser = tableBody.rows[rowIndex].cells[0].innerHTML;
    
    for(var i = 0; i < arrayUsers.length; i++){
        if(selectedUser === arrayUsers[i]["email"]){
            selectedUser = arrayUsers[i];
        }
    }

    form[0].value = selectedUser["email"];
    form[1].value = "Contraseña";
    form[2].value = selectedUser["firstName"];
    form[3].value = selectedUser["lastName"]
    form[4].value = selectedUser["department"];
    tableToModal(selectedUser["userType"]);
}

// Reset values from form fields
function resetFormValues(){
    form.forEach(element => {
        element.value = "";
    });
}

// Gets the value of cheked option and resets the default value
function checkOptions(optionsList, defaultValue = null) {
    let atrValue;
    optionsList.forEach((option) => {
      if (option.checked) {
        atrValue = option.value;
        option.checked = false;
      }
    });
  
    if (defaultValue != null) {
      optionsList[defaultValue].checked = true;
    }
      
    return atrValue;
  }

// Matches type of user to modal selection
function tableToModal(userTypeName){
    if(userTypeName === "General User"){
        general.checked = true;
    } else if(userTypeName === "Consultant"){
        consultant.checked = true;
    } else{
        admin.checked = true;
    }
}

// Validate user input to remove a row from the table
function removeRowValidation(){
    if(rowIndex !== -1){
        openConfirmModal(1);
    } else{
        alert("You have to first click on a user to delete it.");
    }
}

// Remove user
function removeRow(){    
    const body = {"email": tableBody.rows[rowIndex].cells[0].innerHTML};
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/user/delete',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())

    alert("User deleted.");
    window.open("http://localhost:8080/admin_page.html", "_top");
}

// Validate user input to add a row to the table
function addRowValidation(){
    // Check if all fields are complete
    for(var i = 0; i < form.length; i++){
        if(form[i].value === ""){
            alert("Make sure to fill all blank spaces.");
            return;
        }
    }
    openConfirmModal(2);
}

// Add a user
function addRow(){

    var token = JSON.parse(localStorage.getItem("UserInfo"))["accessToken"];
    var adminEmail = JSON.parse(localStorage.getItem("UserInfo"))["email"];

    const body = {
        "email": form[0].value,
        "password": form[1].value,
        "firstName": form[2].value,
        "lastName": form[3].value,
        "department": form[4].value,
        "userType": checkOptions(userTypeList,0),
        "adminEmail": adminEmail
    };
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/auth/signup',
    {method: "POST",
    body: jsonBody, headers: {'x-access-token': token, 'Content-Type': 'application/json'}})
    .then(res => res.json())

    alert("User added to system.");
    closeModal();
    window.open("http://localhost:8080/admin_page.html", "_top");
}

// Validate user input to modify a field(s) in the table
function saveRowValidation(){
    // Check if all fields are complete
    for(var i = 0; i < form.length; i++){
        if(form[i].value === ""){
            alert("Make sure to fill all blank spaces.");
            return;
        }
    }
    openConfirmModal(3);
}

// Save candidate
function saveRow(){
    
    const body = {
    "email": email.value,
    "password": password.value,
    "firstName": fName.value,
    "lastName": lName.value,
    "department": dep.value,
    "userType": checkOptions(userTypeList,0)
    };
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/user/update',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())

    alert("User information Updated.");
    closeModal();
    window.open("http://localhost:8080/admin_page.html", "_top");
}

removeBtn.addEventListener("click", removeRowValidation, false);
submitBtn.addEventListener("click", addRowValidation, false);
saveBtn.addEventListener("click", saveRowValidation, false);

//////////////////////////////////////////////////////////////////////////////

//Modal
const overlay = document.querySelector('#overlay');
const modal = document.querySelector('#modal');
const confirmOverlay = document.querySelector('#confirmation-overlay');
const confirmModal = document.querySelector("#confirmation-modal");
const holidayOverlay = document.querySelector('#holiday-overlay');
const holidayModal = document.querySelector("#holiday-modal");

//Modal Buttons
const addBtn = document.querySelector("#add");
const closeModalButton = document.querySelector('#close-modal-icon');
const updateBtn = document.querySelector("#update");
const closeConfirmBtn = document.querySelector("#close-confirmation-icon");
const confirmModalBtn = document.querySelector("#confirm");
const nonBusinesBtn = document.querySelector("#nonBusiness");
const closeHolidayBtn = document.querySelector("#close-holiday-icon");
const saveHolidayButton = document.getElementById('save-holiday');	
const addDayButton = document.getElementById('add-day');	
// Variable to know wich method to call when confirming action
var confirmMode = 0;

//Display add user modal
function openAddModal(){
    if(rowIndex === -1){
        modal.classList.add('active');
        overlay.classList.add('active');
        saveBtn.style.display = "none";
        submitBtn.style.display = "initial";
    } else{
        alert("Uncheck any user first.");
    }
}

// Display modify user modal
function openUpdateModal(){
    if(rowIndex !== -1){
        modal.classList.add('active');
        overlay.classList.add('active');
        saveBtn.style.display = "initial";
        submitBtn.style.display = "none";
        fillModal();
    } else{
        alert("You must select a user first.");
    }
}

//Display add non busines days modal
function openHolidayModal(){
    if(rowIndex === -1){
        modal.classList.add('active');
        overlay.classList.add('active');
        saveBtn.style.display = "none";
        submitBtn.style.display = "initial";
    } else{
        alert("Uncheck any user first.");
    }
}

// Close and reset modal
function closeModal(){
    modal.classList.remove('active');
    overlay.classList.remove('active');
    resetFormValues();
    checkOptions(userTypeList,0);
}

// Display confirmation modal
function openConfirmModal(funSelected){
    confirmModal.classList.add('active');
    confirmOverlay.classList.add('active');
    confirmMode = funSelected;
}

// Close confirm modal
function closeConfirmModal(){
    confirmModal.classList.remove('active');
    confirmOverlay.classList.remove('active');
    confirmMode = 0;
}

// This function goes along with the confirm btn action, it helps the system
// choose which function it needs to call (remove, add, or save)
function confirmAction(){
    if(confirmMode === 1){
        removeRow();
    } else if( confirmMode === 2){
        addRow();
    } else if(confirmMode === 3){
        saveRow();
    }
    closeConfirmModal();
}



// Display holiday modal
function openHolidayModal(funSelected){
    holidayModal.classList.add('active');
    holidayOverlay.classList.add('active');
    // confirmMode = funSelected;
}

// Close holiday modal
function closeHolidayModal(){
    holidayModal.classList.remove('active');
    holidayOverlay.classList.remove('active');
    // confirmMode = 0;
}

// Add Day to Table
function addToTable(){
    var agregar = true;

    for (var i=0; i<tableHoliday.rows.length; i++){
        if (day.value === tableHoliday.rows[i].cells[1].innerHTML){
            agregar = false;
        } else if (day.value === "") {
            agregar = false;
        }
    }

    //Si no existe la fecha en la tabla, se agrega
    if (agregar)
    {
        var th = tableHoliday.insertRow(tableHoliday.length);
        // Insert reason
        var reasonCell = th.insertCell(0);
        reasonCell.innerHTML = reason.value;
        // Insert date
        var dateCell = th.insertCell(1);
        dateCell.innerHTML = day.value;
    }
}

function updateHoliday(){
    var arrayJson = new Array()
    for (var i=0; i<tableHoliday.rows.length; i++){
        var obj;
        var reasonName = tableHoliday.rows[i].cells[0].innerHTML.toString();
        var dateHoliday = tableHoliday.rows[i].cells[1].innerHTML.toString();
        obj = [dateHoliday, reasonName];
        arrayJson.push(obj);
    }

    const body = {
        holidays: arrayJson
    };
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/holidays/update',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(json => {
        alert(json.message);
    })

    closeHolidayModal();
}

addBtn.addEventListener("click", openAddModal, false);
updateBtn.addEventListener("click", openUpdateModal, false);
nonBusinesBtn.addEventListener("click", openHolidayModal, false);
closeModalButton.addEventListener("click", closeModal, false);
overlay.addEventListener("click", closeModal, false);
confirmOverlay.addEventListener("click", closeConfirmModal, false);
closeConfirmBtn.addEventListener("click", closeConfirmModal, false);
confirmModalBtn.addEventListener("click", confirmAction, false);

holidayOverlay.addEventListener("click", closeHolidayModal, false);
closeHolidayBtn.addEventListener("click", closeHolidayModal, false);
saveHolidayButton.addEventListener('click', updateHoliday, false);
addDayButton.addEventListener('click', addToTable, false);