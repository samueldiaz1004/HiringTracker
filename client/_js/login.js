const email = document.getElementById('email');
const password = document.getElementById('password');

const button = document.getElementById('login-btn');

button.addEventListener('click', function(e) {
    tryLogIn();
})

email.addEventListener('keypress', function(e) {
    if (e.key === 'Enter'){
        tryLogIn();
    }
});

password.addEventListener('keypress', function(e) {
    if (e.key === 'Enter'){
        tryLogIn();
    }
})


function tryLogIn() {
    fetch("http://localhost:8080/api/auth/signin",{
        method: 'POST',
        body: JSON.stringify({
            email: email.value,
            password: password.value
        }),
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'
        }
    }).then(res => res.json()).then(json => {
            if(json.accessToken) {
                localStorage.setItem('UserInfo', JSON.stringify(json));
                if(json.userType === 'Admin') {
                    location.href = 'http://localhost:8080/admin_page.html'
                } else {
                    location.href = 'http://localhost:8080/index.html'
                }
            } else {
                alert('Email or Password Incorrect');
            }

        }
    )
}