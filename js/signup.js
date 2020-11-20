'use strict';

function checkPasswords() {
	const password1 = document.getElementById('password');
	const password2 = document.getElementById('passwordConfirmation');
	if(password1.value === password2.value && password1.value !== '') {
		return true;
	} else {
		return false;
	}
}

// /*
// FOR NOW: checks if all form inputs have been filled
//          out by the user then sets signUpInfo values
//          when all are true --> enables sign in button
//          when all fields are filled out
// FUTURE:  will check that user login info is valid
//          before allowing sign-in to occur --> this
//          should also show an indication to show
//          why sign in button may still be disabled
// */
function checkValidation() {
	let setActive = true;
	for(let input of inputs) {
		if(input.value === '') {
			setActive = false;
			break;
		}
	}
	if (setActive === true) {
		setActive = checkPasswords();
		if(setActive === true) {
			if(document.getElementById('firstName').value !== '' && document.getElementById('lastName').value !== ''&&
			document.getElementById('email').value !== '' && document.getElementById('username').value !== ''){
				signUpButton.disabled = false;
			}

		}
	}
}


// /*
// initial page setup
// */
const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkValidation);
}

const signUpButton = document.getElementById('signUp');