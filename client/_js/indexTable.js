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
        }
    })
}


var tableBody = document.querySelector(".tableBody");
var arrayCandidates;

var page = (document.querySelector('input[name="num"]').value-1).toString();
var row = document.querySelector('input[name="row"]').value.toString();
var filter;
var search;
var order;

const userNameCorner = document.getElementById('user-name');
userNameCorner.innerHTML = JSON.parse(localStorage.getItem('UserInfo')).fullName
const userTypeCorner = document.getElementById('user-type');
userTypeCorner.innerHTML = JSON.parse(localStorage.getItem('UserInfo')).userType

const adminBtn = document.getElementById('user-man-btn');

if(userTypeCorner.innerHTML !== 'Admin') {
    adminBtn.style.display= 'none';
}

const logoutBtn = document.getElementById('logout-btn');

logoutBtn.addEventListener('click', function(e) {
    fetch('http://localhost:8080/logout', {
      method: 'POST',
      body: JSON.stringify({
        email: JSON.parse(localStorage.getItem('UserInfo')).email
      }),
      headers: {'Content-Type': 'application/json'}
    }).then(res => res.json())
    .then(json => {
        alert(json.message);
        localStorage.removeItem('UserInfo');
        location.href = 'http://localhost:8080/login.html';
    })
})

document.querySelector('.number-page').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    emptyTable();
    page = (document.querySelector('input[name="num"]').value-1).toString();
    row = document.querySelector('input[name="row"]').value.toString();

    fetch(`http://localhost:8080/status/current/${page}/${row}`)
      .then(response => response.json())
      .then(data => data["candidatesTable"])
      .then(arrayCandidates => {
        
        loadTableData(arrayCandidates)
        
      })
  }
});

document.querySelector('.number-row').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    emptyTable();
    page = (document.querySelector('input[name="num"]').value-1).toString();
    row = document.querySelector('input[name="row"]').value.toString();

    fetch(`http://localhost:8080/status/current/${page}/${row}`)
    .then(response => response.json())
    .then(data => data["candidatesTable"])
    .then(arrayCandidates => {
      loadTableData(arrayCandidates)
    })
  }
});

//Search Bar
document.querySelector('#searchBar').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    emptyTable();
    page = (document.querySelector('input[name="num"]').value-1).toString();
    row = document.querySelector('input[name="row"]').value.toString();
    filter = document.querySelector('#filter').value.toString();
    search = document.querySelector("#searchBar").value.toString();

    // filter = filter.options[filter.selectedIndex].value;

    fetch(`http://localhost:8080/status/current/${page}/${row}/${filter}/${search}`)
    .then(response => response.json())
    .then(data => data["candidatesTable"])
    .then(arrayCandidates => {
      loadTableData(arrayCandidates)
    })
  }
});

//Order by
document.querySelector("#sort").addEventListener('input', function(e) {
  emptyTable();
  page = (document.querySelector('input[name="num"]').value-1).toString();
  row = document.querySelector('input[name="row"]').value.toString();
  order = e.target.value;

  fetch(`http://localhost:8080/status/current/${page}/${row}/${order}`)
  .then(response => response.json())
  .then(data => data["candidatesTable"])
  .then(arrayCandidates => {
    loadTableData(arrayCandidates)
  })
});


fetch(`http://localhost:8080/status/current/${page}/${row}`)
  .then(response => response.json())
  .then(data => data["candidatesTable"])
  .then(arrayCandidates => loadTableData(arrayCandidates))

// Populates index table with data from the DB
function loadTableData(data){
  
  data.forEach(rowData => {
    let row = tableBody.insertRow();
    let req = row.insertCell(0);
    req.innerHTML = rowData["candidateReq"];
    let fullName = row.insertCell(1);
    fullName.innerHTML = rowData["candidate"]["firstName"] + " " + rowData["candidate"]["lastName"];
    let started = row.insertCell(2);
    started.innerHTML = rowData["dateStart"].substring(0,10);
    let deadline = row.insertCell(3);
    deadline.innerHTML = rowData["deadline"].substring(0,10);
    let timeFinish = row.insertCell(4);
    timeFinish.innerHTML = rowData["completionStatus"];
    let stageName = row.insertCell(5);
    stageName.innerHTML = rowData['stage']["stageName"];

    if(rowData["completionStatus"] === "Close To Deadline"){
      row.classList.add("close-to-deadline");
    } else if(rowData["completionStatus"] === "Delayed"){
      row.classList.add("priority");
    }

  });
  selectedRow();
}

// Add eventListeners to table rows
var candidateTable = document.querySelector(".content-table");
function selectedRow(){
  for(var i = 1; i < candidateTable.rows.length; i++){
    candidateTable.rows[i].style.cursor = "pointer";
    candidateTable.rows[i].onclick = function() {
      var candidateReq = this.cells[0].innerHTML;
      window.open("http://localhost:8080/candidate_info.html?candidateReq="+candidateReq, "_top");
    }
  }
}

function emptyTable(){
    let len = tableBody.rows.length
    for(var i=0; i<len; i++) {
      tableBody.deleteRow(0);
    }
}