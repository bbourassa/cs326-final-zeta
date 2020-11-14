'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS subscriptions(id INTEGER PRIMARY KEY, user_id INT, calendar_id INT);');
//db.none('INSERT INTO public."subscriptions"(id, user_id, calendar_id) VALUES(0, 0 , 0);');

exports.listAll = function(req, res) {
    /*
    res.end(JSON.stringify(db.any('SELECT * FROM public."subscriptions";')));
    */
};

//NOT SURE IF WE USE THIS FUNCTION
exports.loadUser = function(req, res, next) {
	req.subs = subs.filter(sub => sub.user_id === req.user.id);
	next();
};

//DO WE USE THIS TO GET THE CALENDARS ALSO OR JUST THE SUBSCRIPTION ITEMS?
exports.list = function(req, res) {
    /*
    let userId = req.params.user;
    res.end(JSON.stringify(db.any('SELECT * FROM public."subscriptions" WHERE user_id=$1;', [userId])));
    res.end(JSON.stringify(db.any(SELECT * FROM public."subscriptions" INNER JOIN public."calendars" ON calendars.id = subscriptions.calendar_id WHERE user_id=$1;', [userId])));
    */
	res.json(req.subs);
};

exports.create = function(req, res) {
	res.sendStatus(201);
	let lastId =  db.any('SELECT MAX(id) FROM public."items_for_calendars";');
    let newId = lastId + 1; 
    /*
    let userId = req.params.user;
    let calendarId = req.body.calendarId;
    db.none('INSERT INTO public."subscriptions"(id, user_id, calendar_id) VALUES($1, $2, $3);', [newId, userId, calendarId]);
    */
};

exports.find = function(req, res) {
    /*
    let userId = req.params.user;
    let subId = req.params.sub;
    res.end(JSON.stringify(db.any('SELECT * FROM public."subscriptions" WHERE user_id=$1 AND id=$2;', [userId, subId])));
    */
	if (subs[id] && subs[id].user_id === req.user.id) {
		res.json(subs[id]);
	} else {
		res.sendStatus(404);
	}
};

exports.remove = function(req, res) {
    /*let userId = req.params.user;
    let subId = req.params.sub;
    db.none('DELETE from public."subscriptions" WHERE user_id=$1 AND id=$2;', [userId, subId]);*/
	res.sendStatus(204);
};

exports.loadCalendar = function(req, res, next) {
    /*
    let calendarId = req.params.cal;
    res.end(JSON.stringify(db.any(SELECT * FROM public."calendars" WHERE id=$1;', [calendarId])));
    */
	next();
};
