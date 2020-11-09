'use strict';

let letterMap = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 0};

let subscribeButton = document.getElementById('subscribeButton');
subscribeButton.addEventListener('click', redirectOnSubscription);

let songOfDay = document.getElementById('songOfDay');
songOfDay.addEventListener('click', redirectSongOfDay);

let dailyMantras = document.getElementById('dailyMantras');
dailyMantras.addEventListener('click', redirectDailyMantra);

let dailyUpdates = document.getElementById('dailyUpdates');
dailyUpdates.addEventListener('click', redirectDailyUpdates);

let dailyPodcast = document.getElementById('dailyPodcast');
dailyPodcast.addEventListener('click', redirectDailyPodcast);

let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

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

async function redirectSongOfDay() {
    const response = await fetch('/api/calendars/20');
    if(!response.ok) {
		console.log(response.error);
		return;
    }
    let newCalData = await response.json();
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

async function redirectDailyMantra() {
    const response = await fetch('/api/calendars/21');
    if(!response.ok) {
		console.log(response.error);
		return;
    }
    let newCalData = await response.json();
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

async function redirectDailyUpdates() {
    const response = await fetch('/api/calendars/22');
    if(!response.ok) {
		console.log(response.error);
		return;
    }
    let newCalData = await response.json();
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

async function redirectDailyPodcast() {
    const response = await fetch('/api/calendars/23');
    if(!response.ok) {
		console.log(response.error);
		return;
    }
    let newCalData = await response.json();
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