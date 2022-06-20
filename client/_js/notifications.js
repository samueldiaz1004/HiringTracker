const notifNumber = document.querySelector("#notifications-number");
const notifBubble = document.getElementById('notifications-bubble');



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
    
