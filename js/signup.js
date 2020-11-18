'use strict';
const auth = require('../server/db/authentication');

/*
THIS WAS MOCK SINGUP USER INFO DATA OBJECT
CAN WE REMOVE THIS NOW??
I THINK WE MAY BE ABLE TO OR WE MAY
USE IT TO PASS THE DATA - NOT SURE
*/
let signUpInfo = {
	firstName: '',
	lastName: '',
	email: '',
	userName: '',
	password: ''
};

/*
FOR NOW: double checks that password and the confirmed
         password are the same before allowing the
         user to sign up
FUTURE:  add some indication to user - right now it
         is just button disabled but we should let
         user know why --> i plan on adding this when
         we add in tooltips for our forms which i have
         in my head as its own separate task once we have
         everything
*/
function checkPasswords() {
	const password1 = document.getElementById('password');
	const password2 = document.getElementById('passwordConfirmation');
	if(password1.value === password2.value) {
		return true;
	} else {
		return false;
	}
}

/*
FOR NOW: checks if all form inputs have been filled
         out by the user then sets signUpInfo values
         when all are true --> enables sign in button
         when all fields are filled out
FUTURE:  will check that user login info is valid
         before allowing sign-in to occur --> this
         should also show an indication to show
         why sign in button may still be disabled
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
		setActive = checkPasswords();
		if(setActive === true) {
			signUpButton.disabled = false;
			signUpInfo.firstName = document.getElementById('firstName').value;
			signUpInfo.lastName = document.getElementById('lastName').value;
			signUpInfo.email = document.getElementById('email').value;
			signUpInfo.userName = document.getElementById('username').value;
			signUpInfo.password = document.getElementById('password').value;
		}
	}
}

async function addNewUser(fname, lname, email, username, password) {
	const cal_id;
	fetch('/api/users', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({username: username, firstName: fname, lastName: lname, email: email, password: password, calendar_id: cal_id})
	});
}

/*
redirect function on sign in to
personal calendar page
*/
function redirectToCal() {
	addNewUser();
	window.location = '../html/personalcal.html';
}

/*
initial page setup
*/
const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
	input.addEventListener('keyup', checkValidation);
}

const signUpButton = document.getElementById('signUp');
signUpButton.addEventListener('click', redirectToCal);