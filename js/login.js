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


/*
FOR NOW: -sets methods for signInButton
         -sets validation checks on user input
*/
const signInButton = document.getElementById('signIn');
// signInButton.addEventListener('click', validate);

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkHasInputs);
}