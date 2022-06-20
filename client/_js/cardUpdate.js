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


// Update notifications
const notifBubble = document.getElementById('notifications-bubble');
const notifNumber = document.querySelector("#notifications-number");

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
    localStorage.removeItem('UserInfo');
    location.href = 'http://localhost:8080/login.html';
})



function updateNotificationNumber() {
fetch(`http://localhost:8080/notifications`)
    .then(response => response.json())
    .then(json => {
        notifNumber.innerHTML = json.notificationsNumber
        if(json.notificationsNumber === 0){
            notifBubble.classList.remove('fa-circle')
            notifNumber.classList.add('hide-notif')
        } else {
            notifBubble.classList.add('fa-circle')
            notifNumber.classList.remove('hide-notif')
        }
    })
}

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
var candidateNum = getQueryVariable("candidateReq");

// Get candidate statuses
fetch('http://localhost:8080/candidate/all-info',
{method: "POST",
body: JSON.stringify({"req":candidateNum}), headers: {'Content-Type': 'application/json'}})
.then(res => res.json())
.then(data => {
    populateCards(data["allStatuses"]);
})


//Array that contains the 21 cards
const cards = document.querySelectorAll(".status");

var currentCheck;
var current = 0;
var next = 1;
var currentInfo;
var nextInfo;

let today;
let day;
let deadline;
let userName = JSON.parse(localStorage.getItem('UserInfo')).fullName;

//Loop to get the index of the current stage
for(let i = 0; i < cards.length; i++){
    if(cards[i].classList.contains("current")){
        current = i;
        next = i + 1;
    }
}


var candidateStatusId;
// Fill status cards
function populateCards(allStatus){

    if(allStatus.length === 1){
        currentInfo = cards[current].querySelectorAll(".summary p");
        updateTextCurrent(allStatus[0]["dateStart"], allStatus[0]["deadline"], "N/A");
        candidateStatusId = allStatus[0]["statusID"];

        currentCheck = cards[current].querySelector(".container span");
        if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
            currentCheck.addEventListener("click", updateCards, {once:true});
        }

        nextInfo = cards[next].querySelectorAll(".summary p");
        nextCheck = cards[next].querySelector(".container span");
        if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
            nextCheck.addEventListener("click", updateCards, {once:true});
        }

    } else {
        for(var i = 0; i < allStatus.length-1; i++){

            cards[current].querySelector(".container input").setAttribute("checked","true");
            cards[current].querySelector(".container input").setAttribute("disabled","true");
    
            currentInfo = cards[current].querySelectorAll(".summary p");
            updateTextCurrent(allStatus[i]["dateStart"], allStatus[i]["dateCompletion"], allStatus[i]["userCompletion"]);
            CurrentToCompleted();
            
            if(current < 20){
                nextInfo = cards[next].querySelectorAll(".summary p");

                nextCheck = cards[next].querySelector(".container span");
                if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
                    nextCheck.addEventListener("click", updateCards, {once:true});
                }

                updateTextNext(allStatus[i+1]["dateStart"], allStatus[i+1]["deadline"]);
                NotStartedToCurrent();
                next++;
            }
            current++;
            candidateStatusId = allStatus[i+1]["statusID"];
        }
    }
    updateDeadline();
    updateNotificationNumber();
    updateProgressBar();
	centerCarrousel();
}

//Builds carrousel on current cards's page
function centerCarrousel() {
	let index = Math.floor(current/5); //Harcode para posicion default, es numero pagina, empieza en 0
	$(".carousel").owlCarousel({
			loop: false,
			autoplay: false,
			autoplayTimeout: 0,
			autoplayHoverPause: false,
			nav: true,
			navText : [
					"<i class='fa fa-chevron-left' style='font-size:300%;color:white'></i>",
					"<i class='fa fa-chevron-right' style='font-size:300%;color:white'></i>"
			],
			responsive: {
					0:{
					items:1
					},
					200:{
					items:2
					},
					500:{
					items:3
					},
					800:{
					items:4
					},
					1000:{
					items:5
					}
			}
	}).trigger("to.owl.carousel", [index, 1]);
}

centerCarrousel();
updateProgressBar();

//We assign the check of the current card
currentCheck = cards[current].querySelector(".container span");

//Changes the style from the current to completde
function CurrentToCompleted(){
    cards[current].classList.remove("current");
    cards[current].classList.add("completed")
}

//Changes the style from not started to completed
function NotStartedToCurrent(){
    cards[next].classList.remove("not_started");
    cards[next].classList.add("current");
}

// This update texts is for completing stages on load
function updateTextCurrent(startDate, dateCompletion, userFullName){
    currentInfo[0].innerHTML = "Start Date: <br><strong>" + startDate.substring(0,10) + "</strong>";
    currentInfo[1].innerHTML = "Completed: <br><strong>" + dateCompletion.substring(0,10) + "</strong>";
    currentInfo[2].innerHTML = "User: <br><strong>" + userFullName + "</strong>";
}

// This update texts is for completing stages on load
function updateTextNext(startDate, deadline){
    nextInfo[0].innerHTML = "Start Date: <br><strong>" + startDate.substring(0,10) + "</strong>";
    nextInfo[1].innerHTML = "Deadline: <br><strong>" + deadline.substring(0,10) + "</strong>";
    nextInfo[2].innerHTML = "User: <strong>N/A</strong>";
}

// Calculate todays date
function todaysDate(){
    var today = new Date();
    today = today.getFullYear() + "-" + "0" + (today.getMonth()+1) + "-" + today.getDate();
    return today;
}

// This update text is for completing stages onclick
function updateTextOriginal(startingDate, newDeadline){
    if(current < cards.length-1){
        nextInfo[0].innerHTML = "Start Date: <br><strong>" + startingDate + "</strong>";
        nextInfo[1].innerHTML = "Deadline: <br><strong>" + newDeadline + "</strong>";
    }
    currentInfo[2].innerHTML = "User: <br><strong>" + userName  + "</strong>";
    currentInfo[1].innerHTML = "Completed: <br><strong>" + todaysDate() + "</strong>";
}

//Gives us the porcentage of progress and updates width of the bar
function updateProgressBar(){
    let width = Math.ceil(((current) * 100) / (cards.length));
    width = "width:" + width.toString() + "%";
    document.getElementById('myBar').setAttribute("style",width);
    let percentage = current.toString() + " / " + cards.length.toString();
    document.querySelector(".percentage h4").innerHTML = percentage;
}

var currentDeadline;

// Update status back end
function updateCards(){
    console.log("Current Card: " + current);
    console.log("Next Card: " + next);
    var body = {
        "statusId": candidateStatusId,
        "userCompletion": userName
    }

    fetch('http://localhost:8080/complete/status',
    {method: "POST",
    body: JSON.stringify(body), headers: {'Content-Type': 'application/json'}})
    .then(res => res.json())
    .then(data => data).then(data => {
        updateCardsFrontEnd(data);
        updateDeadline();
    });

    updateNotificationNumber();
}

// Update status front end
function updateCardsFrontEnd(newStatusData){
    
    //Current Card Info Update
    CurrentToCompleted();
    currentInfo = cards[current].querySelectorAll(".summary p");
    currentInfo[1].innerHTML = "Completed: <br><strong>" + todaysDate() + "</strong>";
    currentInfo[2].innerHTML = "User: <br><strong>" + userName  + "</strong>";

    //Disable current Check
    cards[current].querySelector(".container input").setAttribute("disabled","true");

    if(current < cards.length-1){
        //Update Next card's info
        nextInfo = cards[next].querySelectorAll(".summary p");
        NotStartedToCurrent();

        //Adding Event Listener to new card
        nextCheck = cards[next].querySelector(".container span");
        if(JSON.parse(localStorage.getItem('UserInfo')).userType !== 'Consultant') {
            nextCheck.addEventListener("click", updateCards, {once:true});
        }
        next++;
    } else if(current === cards.length-1) {
        updateProgressBar();
        removeCandidate();
    }

    //Update current and next card text
    updateTextOriginal(newStatusData["dateStart"].substring(0,10), newStatusData["deadline"].substring(0,10));

    current++;
    candidateStatusId = newStatusData["statusId"]; 

    updateProgressBar();
	centerCarrousel();
}


async function updateDeadline() {
    await fetch(`http://localhost:8080/current/deadline/${candidateStatusId}}`)
    .then(res => res.json())
    .then(json => {
        currentDeadline = json['currentStatus']['deadline'];
        loadTimer();
    });
}

var todayWithHour;
var todayArray;

var deadlineCurrent;
var deadlineArray;

var timer;
var timerDisplay = document.querySelector(".clock p");
var remainingTime;
var overtime;

function loadTimer() {
    overtime = false;
    if(timerDisplay.classList.contains('overtime')){
        timerDisplay.classList.remove('overtime');
    }
    timer = [0,0,0]
    deadlineCurrent = new Date( parseInt(currentDeadline.substring(0,4)),
                        parseInt(currentDeadline.substring(5,7))-1,
                        parseInt(currentDeadline.substring(8,10)),
                        parseInt(currentDeadline.substring(11,13)),
                        parseInt(currentDeadline.substring(14,16)),
                        parseInt(currentDeadline.substring(17,19)));

    todayWithHour = new Date();

    remainingTime = deadlineCurrent-todayWithHour;
    
    if(remainingTime < 0) {
        overtime = true;
        remainingTime *= -1;
        timerDisplay.classList.add('overtime');
    }

    // let timerHours = Math.floor(milisegs / 3600000);
    // let timerMin = Math.floor((milisegs - (timerHours*3600000)) / 60000);
    // let timerSec = Math.floor((milisegs - (timerHours*3600000) - (timerMin*60000)) / 1000);
    // console.log(`${timerHours}:${timerMin}:${timerSec}`)

   

    todayArray = [todayWithHour.getDay(), todayWithHour.getDate(), todayWithHour.getMonth()];
    deadlineArray = [deadlineCurrent.getDay(), deadlineCurrent.getDate(), deadlineCurrent.getMonth()];
    
    if(deadlineArray[2] === todayArray[2]){
        if(deadlineArray[1] !== todayArray[1]){
            remainingTime = remainingTime/3;
        }
    } else {
        remainingTime = remainingTime/3;
    }
    
    var segs = Math.floor(remainingTime / 1000);
    var mins = Math.floor(segs / 60);
        segs = segs - (mins * 60);
    var hours = Math.floor(mins / 60);
        mins = mins - (hours * 60);


    if(!overtime){
        if(deadlineArray[2] === todayArray[2]){
            while(deadlineArray[1] !== todayArray[1]){
                todayArray[1]++;
                todayArray[0]++;
                if(todayArray[0] === 6) {
                    todayArray[1] += 2;
                    todayArray[0] = 1;
                    hours -= 16;
                }
            }   
        } else {
            let lastDayOfMonth = getLastDayOfMonth(todayArray[2]); //30
            let daysOffset;
            while(todayArray[1] <= lastDayOfMonth){
                todayArray[1]++;
                todayArray[0]++;
                if(todayArray[0] === 6) {
                    todayArray[1] += 2;
                    todayArray[0] = 1;
                    hours -= 16;
                }
            }
            daysOffset =  todayArray[1] - (lastDayOfMonth+1);
            todayArray[2]++;
            todayArray[1] = 1 + daysOffset;
            todayArray[0]++;
            if(todayArray[0] === 6) {
                todayArray[1] += 2;
                todayArray[0] = 1;
                hours -= 16;
            }

            while(deadlineArray[1] !== todayArray[1]){
                todayArray[1]++;
                todayArray[0]++;
                if(todayArray[0] === 6) {
                    todayArray[1] += 2;
                    todayArray[0] = 1;
                    hours -= 16;
                }
            }
        }
    }
    timer = [hours, mins, segs];                   
    updateTimerOnDisplay();
}


function updateTimer() {
    //Considering that status is on time
    //Seconds

    if(!overtime){
        if(timer[2]-1 < 0){
            timer[2] = 59
            if(timer[1]-1 < 0){
                timer[1] = 59;
                if(timer[0]-1 < 0) {
                    overtime= true;
                } else {
                    timer[0]--;
                }
            }else {
                timer[1]--;
            }
        } else {
            timer[2]--;
        }
    } else {
        timer[2]++;
        if(timer[2] === 60){
            timer[2] = 0
            timer[1] ++;
            if(timer[1] === 60){
                timer[1] = 0;
                timer[0]++; 
            }
        } 
    }
    
    //Not yet implemented when status is delayed
    updateTimerOnDisplay();
}
var interval = setInterval(updateTimer, 1000);

// When completed remove candidate from the database
function removeCandidate(){
    
    const body = {"req":parseInt(candidateNum)};
    var jsonBody = JSON.stringify(body);

    fetch('http://localhost:8080/candidate/delete',
    {method: "POST",
    body: jsonBody, headers: {'Content-Type': 'application/json'}
    })
    .then(res => alert("Congratulations, the candidate has completed all hiring steps. "+candidateNum+" will be deleted from the database"))
    .catch(err => console.log(err))
    
    window.open("http://localhost:8080/index.html", "_top");
}

function updateTimerOnDisplay() {
    if(timer[0].toString().length < 2){
        timer[0] = '0' + timer[0];
    }
    if(timer[1].toString().length < 2){
        timer[1] = '0' + timer[1];
    }
    if(timer[2].toString().length < 2){
        timer[2] = '0' + timer[2];
    }
    timerDisplay.querySelector('strong').innerHTML = timer[0]+":"+timer[1]+":"+timer[2];
}

const getLastDayOfMonth = (month, year) => {
    let lastDayOfMonth;
    switch(month) {
        case 1:
            lastDayOfMonth = 31;
            break;
        case 2:
            if(year % 4 == 0){
                lastDayOfMonth = 29;
            } else {
                lastDayOfMonth = 28;
            }
            break;
        case 3:
            lastDayOfMonth = 31;
            break;
        case 4:
            lastDayOfMonth = 30;
            break;
        case 5:
            lastDayOfMonth = 31;
            break;
        case 6:
            lastDayOfMonth = 30;
            break;
        case 7:
            lastDayOfMonth = 31;
            break;
        case 8:  
            lastDayOfMonth = 31;
            break;
        case 9:
            lastDayOfMonth = 30;
            break;
        case 10:
            lastDayOfMonth = 31;
            break;
        case 11:
            lastDayOfMonth = 30;
            break;
        case 12:
            lastDayOfMonth = 31;
            break;
    }
    return lastDayOfMonth;
}