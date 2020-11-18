'use strict';







//window.localStorage.removeItem('userInfo');

/*
double checks that a username and password
have been entered. Enables sign-in button only
when username and password field have inputs.

*/
// function checkHasInputs() {
// 	let setActive = true;
// 	for(let input of inputs) {
// 		if(input.value === '') {
// 			setActive = false;
// 			break;
// 		}
// 	}
// 	if (setActive === true) {
// 		signInButton.disabled = false;
// 	}
// }

// function login(){
// 	let form = document.getElementById('login-form');
// 	let data = new FormData(form);
// 	console.log("formdata",data);
// }

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
// const signIn = document.getElementById('login-form');
// signIn.addEventListener('submit', (e) =>{
// 	console.log('submitted');
// 	e.preventDefault();

// 	// construct a FormData object, which fires the formdata event
// 	new FormData(signIn);
// });

// signIn.addEventListener('formdata', (e) => {
// 	console.log('formdata fired');

// 	// Get the form data from the event object
// 	let data = e.formData;
// 	console.log(data.inputUsername);
// 	for (let value of data.values()) {
// 		console.log(value);
// 	}
// 	// submit the data via XHR
// 	let request = new XMLHttpRequest();
// 	request.open('POST', '/login');
// 	request.send(data);
// });

// const inputs = document.getElementsByTagName('input');
// for(let input of inputs) {
// 	input.addEventListener('keyup', checkHasInputs);
// }