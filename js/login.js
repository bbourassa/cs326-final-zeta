'use strict';

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

function redirectToCal() {
    window.location = '../html/personalcal.html';
}

function redirectToPasswordRet() {
    window.location = '../html/passwordretrieve.html';
}

const signInButton = document.getElementById('signIn');
signInButton.addEventListener('click', redirectToCal);

const retPassButton = document.getElementById('passRet');
retPassButton.addEventListener('click', redirectToPasswordRet);

const inputs = document.getElementsByTagName('input');
for(let input of inputs) {
    input.addEventListener('keyup', checkValidation);
}