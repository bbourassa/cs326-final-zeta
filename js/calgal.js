'use strict';

window.localStorage.clear();
async function getSession(){
	let user = await fetch('/user');
	// console.log(user);
	let us = await user.json();
	console.log(us);
	let mID = await fetch('/api/username/'+us);
	let id = await mID.json();
	console.log(id[0].id);
	//const test= JSON.stringify(id);
    //user_id = test;
    setAllForPage(id[0].id);
	//return us;
}
window.addEventListener('load', getSession);

document.getElementById('logoutBtn').addEventListener('click', ()=>{
	fetch('/logout');
});

let letterMap = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 0};
let subscribeButton = document.getElementById('subscribeButton');
let songOfDay = document.getElementById('songOfDay');
let dailyMantras = document.getElementById('dailyMantras');
let dailyUpdates = document.getElementById('dailyUpdates');
let dailyPodcast = document.getElementById('dailyPodcast');
let createCalendar = document.getElementById('createCalendar');
let calendarName = document.getElementById('calendarName');
let calendarLink = document.getElementById('calendarLink');

function setAllForPage(user_id) {
    subscribeButton.addEventListener('click', () => redirectOnSubscription(user_id));
    songOfDay.addEventListener('click', () => redirectSongOfDay(user_id));
    dailyMantras.addEventListener('click', () => redirectDailyMantra(user_id));
    dailyUpdates.addEventListener('click', () => redirectDailyUpdates(user_id));
    dailyPodcast.addEventListener('click', () => redirectDailyPodcast(user_id));
    createCalendar.addEventListener('click', () => redirectOnCreation(user_id));
    calendarName.addEventListener('keyup', checkCalInput);
    calendarLink.addEventListener('keyup', checkLink);

}

function checkCalInput() {
	if(document.getElementById('calendarName').value !== '') {
		createCalendar.disabled = false;
	} else {
		createCalendar.disabled = true;
	}
}

function checkLink() {
	if(document.getElementById('calendarLink').value !== '') {
		subscribeButton.disabled = false;
	} else {
		subscribeButton.disabled = true;
	}
}

async function redirectOnCreation() {
	//console.log('newCalendarName', document.getElementById('calendarName').value);
	let newCalName = document.getElementById('calendarName').value;
	let newCalDescription = 'new calendar titled - ' + newCalName;
	let newCalInfo = {name: newCalName, personal: 0, description: newCalDescription};
	fetch('/api/cals/', {

		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newCalInfo)
	});
	// setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
}

//let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

async function redirectOnSubscription(user_id) {
	let calendarLink = document.getElementById('calendarLink');
	let calendarCode = calendarLink.value;
	let calendarId = '';
	for(let i = 0; i < calendarCode.length; i++) {
		let letterKey = calendarCode.charAt(i);
		calendarId += letterMap[letterKey];
	}
	const response = await fetch('/api/cals/'+calendarId);
	if(!response.ok) {
		console.log(response.error);
		return;
	}

    let newCalData = await response.json();
    if(newCalData !== null) {
        fetch('/api/subscriptions/'+user_id, {
            method: 'POST',
		    headers: {
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({'calendarId': calendarId})
		});
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectSongOfDay(user_id) {
    const response = await fetch('/api/cals/2');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

    let newCalData = await response.json();
    if(newCalData !== null) {
        fetch('/api/subscriptions/'+user_id, {
            method: 'POST',
		    headers: {
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({'calendarId': 2})
		});
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyMantra(user_id) {
    const response = await fetch('/api/cals/3');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

    let newCalData = await response.json();
    if(newCalData !== null) {
        fetch('/api/subscriptions/'+user_id, {
            method: 'POST',
		    headers: {
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({'calendarId': 3})
		});
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyUpdates(user_id) {
	const response = await fetch('/api/cals/4');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

    let newCalData = await response.json();
    if(newCalData !== null) {
        fetch('/api/subscriptions/'+user_id, {
            method: 'POST',
		    headers: {
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({'calendarId': 4})
		});
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyPodcast(user_id) {
	const response = await fetch('/api/cals/5');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

    let newCalData = await response.json();
    if(newCalData !== null) {
        fetch('/api/subscriptions/'+user_id, {
            method: 'POST',
		    headers: {
			    'Content-Type': 'application/json'
			},
			body: JSON.stringify({'calendarId': 5})
		});
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}