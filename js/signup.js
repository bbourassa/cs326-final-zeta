'use strict';

let signUpInfo = {
    firstName: '',
    lastName: '', 
    email: '', 
    userName: '', 
    password: ''
};

function checkPasswords() {
    const password1 = document.getElementById('password');
    const password2 = document.getElementById('passwordConfirmation');
    if(password1.value === password2.value) {
        return true;
    } else {
        return false;
    }
}

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

function redirectToCal() {
    window.location = '../html/personalcal.html';
}

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
    input.addEventListener('keyup', checkValidation);
}

const signUpButton = document.getElementById('signUp');
signUpButton.addEventListener('click', redirectToCal);