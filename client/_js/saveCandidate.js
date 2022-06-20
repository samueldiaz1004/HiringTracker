const req = document.getElementById('Req');
const pi = document.getElementById('PI');
const ol3 = document.getElementById('OL3');
const pCenter = document.getElementById('Pcenter');
const firstName = document.getElementById('Name');
const lastName = document.getElementById('Last Name');
const role = document.getElementById('Role');
const mgr = document.getElementById('Mgr');
const partner = document.getElementById('Partner');
const wcmBD = document.getElementById('WcmBd');
const fWD = document.getElementById('FWD');
const tentative = document.getElementById('Tentative');
const form = [req,pi,ol3,pCenter,firstName,lastName,role,mgr,partner];

// Attributes that contain options
const type = document.getElementsByName('Type');
const site = document.getElementsByName('Site');
const inv = document.getElementsByName('Inv');

// Html file name
path = window.location.pathname;
page = path.split('/').pop();

let candidateAttr = [];

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

// Adds the attribute to candidateAttr and erases the data from Modal
function pushAttribute(attribute) {
  candidateAttr.push(attribute.value);
  attribute.value = '';
}

function registerCandidate() {
  // Req
  pushAttribute(req);
  // Type
  candidateAttr.push(checkOptions(type, 0));
  // PI
  pushAttribute(pi);
  // OL3
  pushAttribute(ol3);
  // Pcenter
  pushAttribute(pCenter);
  // Name
  pushAttribute(firstName);
  // Last Name
  pushAttribute(lastName);
  // Role
  pushAttribute(role);
  // Site
  candidateAttr.push(checkOptions(site, 0));
  // Partner
  pushAttribute(partner);
  // Mgr
  pushAttribute(mgr);
  // Wcm Bd
  pushAttribute(wcmBD);
  // FWD
  pushAttribute(fWD);
  // Tentative
  pushAttribute(tentative);
  // Inv
  candidateAttr.push(checkOptions(inv, 1));
	
  const body = {   
    "req": parseInt(candidateAttr[0]),
    "type": candidateAttr[1],
    "PI": parseInt(candidateAttr[2]),
    "OL3": candidateAttr[3],
    "Pcenter": candidateAttr[4],
    "firstName": candidateAttr[5],
    "lastName": candidateAttr[6],
    "roleName": candidateAttr[7],
    "site": candidateAttr[8],
    "partner": candidateAttr[9],
    "Mgr": candidateAttr[10],
    "wcmBd": candidateAttr[11],
    "fwd": candidateAttr[12].value,
    "tentative": candidateAttr[13].value,
    "inv": candidateAttr[14],
    "stageId": 1,
    "completionStatus": "On Time"
}

  var jsonBody = JSON.stringify(body);

	fetch('http://localhost:8080/candidate/add',
  {method: "POST",
  body: jsonBody, headers: {'Content-Type': 'application/json'}
  })
  .then(res => res.json())
  .then(json => alert("Candidate "+candidateAttr[0]+" successfully added."))
  .catch(err => console.log(err))

}

//////////////////////////////////////////////////////////////////////////////////////////
// Button
const openModalButton = document.querySelector('#open-modal');
const closeModalButton = document.querySelector('#close-modal-icon');
const registerBtn = document.querySelector('#register');
const closeConfirmationBtn = document.querySelector('#close-confirmation-icon');
const confirmBtn = document.querySelector('#confirm');

// Overlay
const overlay = document.querySelector('#overlay');
const modal = document.querySelector('#modal');
const confirmationModal = document.querySelector('#confirmation-modal');
const overlayConfirmation = document.querySelector('#confirmation-overlay');

function openModal() {
  modal.classList.add('active');
  overlay.classList.add('active');
}

function askForConfirmation() {
  for(var i = 0; i < form.length; i++){
    if(form[i].value === ""){
        alert("Make sure to fill all the required spaces.");
        return;
      }
  }
  confirmationModal.classList.add('active');
  overlayConfirmation.classList.add('active');
}

function closeModal() {
  modal.classList.remove('active');
  overlay.classList.remove('active');
}

function closeConfirmation() {
  confirmationModal.classList.remove('active');
  overlayConfirmation.classList.remove('active');
}

function addCandidate(){
  registerCandidate();
  closeModal();
  closeConfirmation();
  location.reload();
}

if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
  openModalButton.addEventListener('click', openModal, false);
  closeModalButton.addEventListener('click', closeModal, false);
  overlay.addEventListener('click', closeModal, false);
  registerBtn.addEventListener('click', askForConfirmation, false);
  closeConfirmationBtn.addEventListener('click', closeConfirmation, false);
  overlayConfirmation.addEventListener('click', closeConfirmation, false);
  confirmBtn.addEventListener('click', addCandidate, false);
}
