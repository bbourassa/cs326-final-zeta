'use strict';

let letterMap = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 0};

let subscribeButton = document.getElementById('subscribeButton');
subscribeButton.addEventListener('click', redirectOnSubscription);

async function redirectOnSubscription() {
    let calendarLink = document.getElementById('calendarLink');
    let calendarCode = calendarLink.value;
    let calendarId = '';
    for(let i = 0; i < calendarCode.length; i++) {
        let letterKey = calendarCode.charAt(i);
        calendarId += letterMap[letterKey];
    }
    const response = await fetch('/api/calendars/'+calendarId); 
    if(!response.ok) {
        console.log(response.error);
        return;
    }
    let newCalData = await response.json();
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
    fetch('/api/users/'+userInfo.id+'/subscriptions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userId: userInfo.id, calId: newCalData.id})
    });
    window.localStorage.setItem('newSubscription', JSON.stringify(newCalData));
    window.location = '../html/subscriptions.html';
    

}