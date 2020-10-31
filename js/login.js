'use strict';

/*
FOR NOW: double checks that a username and password 
         have been entered. Enables sign-in button only
         when username and password field have
         inputs.
FUTURE:  will check that user login info is valid
         before allowing sign-in to occur
*/
function checkValidation() {
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
FOR NOW: redirects to the Personal Calendar
         page on sign-in
*/
function redirectToCal() {
	window.location = '../html/personalcal.html';
}

/*
FOR NOW: -sets methods for signInButton
         -sets validation checks on user input
FUTURE:  TBD
*/
const signInButton = document.getElementById('signIn');
signInButton.addEventListener('click', redirectToCal);

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkValidation);
}