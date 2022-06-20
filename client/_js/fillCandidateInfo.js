// Get candidate req from url
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}
var candidate = getQueryVariable("candidateReq");

const body = {"req":candidate};
var jsonBody = JSON.stringify(body);

// Populate candidate information
fetch('http://localhost:8080/candidate/all-info',
{method: "POST",
body: jsonBody, headers: {'Content-Type': 'application/json'}})
.then(res => res.json())
.then(data => {
    quickInfo(data["candidateInfo"]);
    fillAllCandidateInfo(data["candidateInfo"]);
})

// Fill essential candidate info [grey rectangle]
function quickInfo(data){
    var candidateSummary = document.querySelector(".info");
    var fwd = data["fwd"];
    if(!fwd) fwd = 'Not Assigned';
    candidateSummary.getElementsByTagName('p')[0].innerHTML = 'Req: '+'<strong>'+data["req"]+'</strong>';
    candidateSummary.getElementsByTagName('p')[1].innerHTML = 'Name: '+'<strong>'+data["firstName"]+' '+data["lastName"]+'</strong>';
    candidateSummary.getElementsByTagName('p')[2].innerHTML = 'Role: '+'<strong>'+data["roleName"]+'</strong>';
    candidateSummary.getElementsByTagName('p')[3].innerHTML = 'FWD: '+'<strong>'+fwd+'</strong>';
}

// Form spaces
const req = document.getElementsByName('Req')[0];
const pi = document.getElementsByName('PI')[0];
const ol3 = document.getElementsByName('OL3')[0];
const pCenter = document.getElementsByName('Pcenter')[0];
const firstName = document.getElementsByName('Name')[0];
const lastName = document.getElementsByName('Last Name')[0];
const role = document.getElementsByName('Role')[0];
const mgr = document.getElementsByName('Mgr')[0];
const partner = document.getElementsByName('Partner')[0];
const id = document.getElementsByName('ID')[0]
const wcmBD = document.getElementsByName('WcmBd')[0];
const fWD = document.getElementsByName('FWD')[0];
const tentative = document.getElementsByName('Tentative')[0];
const form = [req,pi,ol3,pCenter,firstName,lastName,role,mgr,partner];

// Attributes that contain options
const type = document.getElementsByName('Type');
const site = document.getElementsByName('Site');
const inv = document.getElementsByName('Inv');

// Gets the value of cheked option and resets the default value
function checkOptions(optionsList) {
    let atrValue;
    optionsList.forEach((option) => {
      if (option.checked) {
        atrValue = option.value;
      }
    });
    return atrValue;
  }

// Check space in modal
function checkCandidateForm(optionsList, valueChecked){
    let atrValue;
    optionsList.forEach((option) => {
        if (option.value === valueChecked) {
        option.checked = true;
        }
    });
}

// Fill the modal with all the candidate information
function fillAllCandidateInfo(data){
    req.value = data["req"];
    pi.value = data["PI"];
    ol3.value = data["OL3"];
    pCenter.value = data["Pcenter"];
    firstName.value = data["firstName"];
    lastName.value = data["lastName"];
    role.value = data["roleName"];
    mgr.value = data["Mgr"];
    partner.value = data["partner"];
    id.value = data["ID"];
    wcmBD.value = data["wcmBd"];
    fWD.value = data["fwd"]
    tentative.value = data["tentative"];
    checkCandidateForm(type,data["type"]);
    checkCandidateForm(site,data["site"]);
    checkCandidateForm(inv,data["inv"]);
}

// Update candidates information
function updateCandidate(){
    
    const body = {   
        "req": req.value,
        "type": checkOptions(type),
        "PI": pi.value,
        "OL3": ol3.value,
        "Pcenter": pCenter.value,
        "firstName": firstName.value,
        "lastName": lastName.value,
        "roleName": role.value,
        "site": checkOptions(site),
        "partner": partner.value,
        "Mgr": mgr.value,
        "wcmBd": wcmBD.value,
        "ID": id.value,
        "fwd": fWD.value,
        "tentative": tentative.value,
        "inv": checkOptions(inv),
    }

    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/candidate/modify',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => alert(json.message))
    .catch(err => console.log(err))
}

// Delete candidate from database
function deleteCandidate(){
    
    const body = {"req":req.value};
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/candidate/delete',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}
    })
    .then(res => res.json())
    .then(json => alert(json.message))
    .catch(err => console.log(err))
    
    window.open("http://localhost:8080/index.html", "_top");
}

// Button
const openModalButton = document.querySelector('#open-modal');
const closeModalButton = document.querySelector('#close-modal-icon');
const registerBtn = document.querySelector('#register');
const closeConfirmationBtn = document.querySelector('#close-confirmation-icon');
const confirmBtn = document.querySelector('#confirm');
const eliminateBtn = document.querySelector('#eliminateBtn');
const modifyBtn = document.querySelector('#modify');

if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
    // Disable modal form fields
    let inputDisabled;
    modifyBtn.addEventListener('click', () => {
        inputDisabled = document.querySelectorAll('.modal li input');
        inputDisabled.forEach((element) => element.removeAttribute('disabled'));
    }, false);
}

// Overlay
const overlay = document.querySelector('#overlay');
const modal = document.querySelector('#modal');
const confirmationModal = document.querySelector('#confirmation-modal');
const overlayConfirmation = document.querySelector('#confirmation-overlay');

function openModal() {
    modal.classList.add('active');
    overlay.classList.add('active');
    inputDisabled.forEach((element) => element.setAttribute('disabled', true));
}

function closeModal() {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

function askForConfirmation() {
    for(var i = 0; i < form.length; i++){
        if(form[i].value === ""){
            alert("Make sure to fill all the required spaces.");
            return;
        }
    }
    mode = "modify";
    confirmationModal.classList.add('active');
    overlayConfirmation.classList.add('active');
}
  
function closeConfirmation() {
    confirmationModal.classList.remove('active');
    overlayConfirmation.classList.remove('active');
}

function modifyCandidate(){
    updateCandidate();
    closeModal();
    closeConfirmation();
    location.reload();
}

function eliminateCandidate(){
    mode = "eliminate";
    confirmationModal.classList.add('active');
    overlayConfirmation.classList.add('active');
}

// Check which action to trigger
var mode = "";
function chooseAction(){
    if(mode === "modify"){
        modifyCandidate();
    } else if(mode === "eliminate"){
        deleteCandidate();
    }
}

openModalButton.addEventListener('click', openModal, false);
closeModalButton.addEventListener('click', closeModal, false);
overlay.addEventListener('click', closeModal, false);
closeConfirmationBtn.addEventListener('click', closeConfirmation, false);
overlayConfirmation.addEventListener('click', closeConfirmation, false);
confirmBtn.addEventListener('click',chooseAction, false);

if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
    registerBtn.addEventListener('click', askForConfirmation, false);
    eliminateBtn.addEventListener('click',eliminateCandidate,false);
}
