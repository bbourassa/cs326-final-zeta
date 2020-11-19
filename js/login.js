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



/**
 * posts the login data. Authentication handles the rest
 */
// async function validate(){
// 	const usern = document.getElementById('inputUsername').value;
// 	const pass = document.getElementById('inputPassword').value;
// 	try {
// 		console.log('validating');
// 		await fetch('/login', {
// 			method: 'POST',
// 			headers:{
// 				'Content-Type': 'application/json'
// 			},
// 			body: JSON.stringify({username: usern, password:pass })
// 		});
// 	} catch (e) {
// 		console.log('Unable to login. ', e);
// 	}
// }

/*
FOR NOW: -sets methods for signInButton
         -sets validation checks on user input
FUTURE:  TBD
*/
const signInButton = document.getElementById('signIn');
// signInButton.addEventListener('click', validate);

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkHasInputs);
}