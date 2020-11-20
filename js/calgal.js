'use strict';

window.localStorage.clear();
async function getSession(){
	try{
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
	} catch(e){
		window.location.replace('./index.html');

	}
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

async function redirectOnCreation(user_id) {
	console.log('hit redirect');
	//console.log('newCalendarName', document.getElementById('calendarName').value);
	let newCalName = document.getElementById('calendarName').value;
	let newCalDescription = 'new calendar titled - ' + newCalName;
	let newCalInfo = {name: newCalName, personal: 0, description: newCalDescription};
	fetch('/api/cals/'+user_id, {

		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(newCalInfo)
	});
	setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
}

//let userInfo = JSON.parse(window.localStorage.getItem('userInfo'));

async function redirectOnSubscription(user_id) {
	let calendarLink = document.getElementById('calendarLink');
	let calendarCode = calendarLink.value;
	let calendarId = '';
	let makeSubscription = true;
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
		const subResponse = await fetch('/api/subscriptions/'+user_id);
		//const subResponse = await fetch('/api/cals/'+calendarId);
		if(!subResponse.ok) {
			console.log(subResponse.error);
			return;
		}
		let allSubs = await subResponse.json();
		for(let i = 0; i < allSubs.length; i++) {
			if(allSubs[i].calendar_id === parseInt(calendarId)) {
				makeSubscription = false;
			}
		}
		if(makeSubscription === true) {
			fetch('/api/subscriptions/'+user_id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'calendarId': calendarId})
			});
		}
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectSongOfDay(user_id) {
	let makeSubscription = true;
	const response = await fetch('/api/cals/2');
	if(!response.ok) {
		console.log(response.error);
		return;
	}
	let newCalData = await response.json();
	if(newCalData !== null) {
		const subResponse = await fetch('/api/subscriptions/'+user_id);
		//const subResponse = await fetch('/api/cals/'+calendarId);
		if(!subResponse.ok) {
			console.log(subResponse.error);
			return;
		}
		let allSubs = await subResponse.json();
		for(let i = 0; i < allSubs.length; i++) {
			if(allSubs[i].calendar_id === parseInt(2)) {
				makeSubscription = false;
			}
		}
		if(makeSubscription === true) {
			fetch('/api/subscriptions/'+user_id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'calendarId': 2})
			});
		}
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyMantra(user_id) {
	let makeSubscription = true;
	const response = await fetch('/api/cals/3');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

	let newCalData = await response.json();
	if(newCalData !== null) {
		const subResponse = await fetch('/api/subscriptions/'+user_id);
		//const subResponse = await fetch('/api/cals/'+calendarId);
		if(!subResponse.ok) {
			console.log(subResponse.error);
			return;
		}
		let allSubs = await subResponse.json();
		for(let i = 0; i < allSubs.length; i++) {
			if(allSubs[i].calendar_id === parseInt(3)) {
				makeSubscription = false;
			}
		}
		if(makeSubscription === true) {
			fetch('/api/subscriptions/'+user_id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'calendarId': 3})
			});
		}
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyUpdates(user_id) {
	let makeSubscription = true;
	const response = await fetch('/api/cals/4');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

	let newCalData = await response.json();
	if(newCalData !== null) {
		const subResponse = await fetch('/api/subscriptions/'+user_id);
		//const subResponse = await fetch('/api/cals/'+calendarId);
		if(!subResponse.ok) {
			console.log(subResponse.error);
			return;
		}
		let allSubs = await subResponse.json();
		for(let i = 0; i < allSubs.length; i++) {
			if(allSubs[i].calendar_id === parseInt(4)) {
				makeSubscription = false;
			}
		}
		if(makeSubscription === true) {
			fetch('/api/subscriptions/'+user_id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'calendarId': 4})
			});
		}
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}

async function redirectDailyPodcast(user_id) {
	let makeSubscription = true;
	const response = await fetch('/api/cals/5');
	if(!response.ok) {
		console.log(response.error);
		return;
	}

	let newCalData = await response.json();
	if(newCalData !== null) {
		const subResponse = await fetch('/api/subscriptions/'+user_id);
		//const subResponse = await fetch('/api/cals/'+calendarId);
		if(!subResponse.ok) {
			console.log(subResponse.error);
			return;
		}
		let allSubs = await subResponse.json();
		for(let i = 0; i < allSubs.length; i++) {
			if(allSubs[i].calendar_id === parseInt(5)) {
				makeSubscription = false;
			}
		}
		if(makeSubscription === true) {
			fetch('/api/subscriptions/'+user_id, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({'calendarId': 5})
			});
		}
		setTimeout(function(){window.location.replace('./subscriptions.html');}, 500);
	}
}