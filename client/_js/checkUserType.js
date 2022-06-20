let userType = document.getElementById('user-type').textContent;
let userManagementBtn = document.getElementById('user-man-btn');

if(userType === 'Admin'){
	userManagementBtn.style.display = 'inline-block';
}