'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS subscriptions(id INTEGER PRIMARY KEY, user_id INT, calendar_id INT);');

exports.listAll = async function(req, res) {
	res.json(await db.any('SELECT * FROM public."subscriptions";'));
};

//NOT SURE IF WE USE THIS FUNCTION
/*exports.loadUser = function(req, res, next) {
	req.subs = subs.filter(sub => sub.user_id === req.user.id);
	next();
};*/

//DO WE USE THIS TO GET THE CALENDARS ALSO OR JUST THE SUBSCRIPTION ITEMS?
/*exports.list = async function(req, res) {
	console.log('hit sub list');
	let calId = req.params.cal;
	//res.end(JSON.stringify(db.any('SELECT * FROM public."subscriptions" WHERE user_id=$1;', [userId])));
	res.json(await db.any('SELECT * FROM public."subscriptions" WHERE calendar_id=$1', [calId]));
	//res.json(req.subs);
};*/

exports.listSubscribed = async function(req, res) {
	let userId = req.params.user;
	let subscriptionList = await db.any('SELECT * FROM public."subscriptions" WHERE user_id=$1 ORDER BY -id', [userId]);
	let subCalendars = [];
	for(let i = 0; i < subscriptionList.length; i++) {
		let thisCalendar = await db.any('SELECT * FROM public."calendars" WHERE id=$1 AND personal=0 ORDER BY -id', [subscriptionList[i].calendar_id]);
		if(thisCalendar[0] !== undefined) {
			subCalendars.push(thisCalendar[0]);
		}
	}
	res.json(subCalendars);
};

exports.create = async function(req, res) {
	res.sendStatus(201);
	let lastId =  await db.any('SELECT MAX(id) FROM public."subscriptions";');
	let newId = lastId[0].max + 1; 
	let userId = req.params.user;
	let calendarId = req.body.calendarId;
	db.none('INSERT INTO public."subscriptions"(id, user_id, calendar_id) VALUES($1, $2, $3);', [newId, userId, calendarId]);
};

exports.find = async function(req, res) {
	let calId = req.params.cal;
	res.json(await db.any('SELECT * FROM public."subscriptions" WHERE calendar_id=$1;', [calId]));
	/*if (subs[id] && subs[id].user_id === req.user.id) {
		res.json(subs[id]);
	} else {
		res.sendStatus(404);
	}*/
};

exports.remove = function(req, res) {
	//let userId = req.params.user;
	let subId = req.params.sub;
	db.none('DELETE from public."subscriptions" WHERE id=$1;', [subId]);
	res.sendStatus(204);
};

/*exports.loadCalendar = async function(req, res, next) {
	let calendarId = req.params.cal;
	res.json(await db.any('SELECT * FROM public."calendars" WHERE id=$1;', [calendarId]));
	next();
};*/
