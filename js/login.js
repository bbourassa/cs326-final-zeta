'use strict';

//window.localStorage.removeItem('userInfo');

/*
double checks that a username and password
have been entered. Enables sign-in button only
when username and password field have inputs.

*/
function checkHasInputs() {
	let setActive = true;
	for(let input of inputs) {
		if(input.value === '') {
			setActive = false;
			break;
		}
	}
	if (setActive === true) {
		signInButton.disabled = false;
	}
}

// async function searchUsers(currUser, currPassword) {
// 	const response = await fetch('/api/users');
// 	if (!response.ok) {
// 		console.log(response.error);
// 		return;
// 	}
// 	let allUsers = await response.json();
// 	console.log(allUsers);
// 	for(let i = 0; i < allUsers.length; i++) {
// 		if(allUsers[i].username === currUser) {
// 			if(allUsers[i].password === currPassword) {
// 				window.localStorage.setItem('userInfo', JSON.stringify({id: allUsers[i].id, username: allUsers[i].username, password: allUsers[i].password }));
// 				return true;
// 			}
// 		}
// 	}
// 	return false;
// }

// /*
// FOR NOW: redirects to the Personal Calendar
//          page on sign-in
// */
// function redirectToCal() {
// 	let currentUsername = document.getElementById('inputUsername');
// 	let currentPassword = document.getElementById('inputPassword');
// 	//let validUser = false;
// 	searchUsers(currentUsername.value, currentPassword.value).then((res) => {if(res === true) { window.location = '../html/personalcal.html';} else {
// 		if(document.getElementById('loginError') === null) {
// 			let loginError = document.createElement('p');
// 			loginError.classList.add('text-uppercase');
// 			loginError.id = 'loginError';
// 			loginError.innerHTML = 'Invalid Login Info';
// 			document.getElementById('loginText').appendChild(loginError);
// 		}
// 	}});
// }

/**
 * posts the login data. Authentication handles the rest
 */
function validate(){
	() => {
		const usern = document.getElementById('inputUsername').value;
		const pass = document.getElementById('inputPassword').value;
		fetch('/login', {
			method: 'POST',
			headers:{
				'Content-Type': 'application/json'
			},
			body: {username: usern, password:pass }
		});
	};
}

/*
FOR NOW: -sets methods for signInButton
         -sets validation checks on user input
FUTURE:  TBD
*/
const signInButton = document.getElementById('signIn');
signInButton.addEventListener('click', validate);

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkHasInputs);
}