'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, firstName VARCHAR, lastName VARCHAR, email VARCHAR, password_val VARCHAR, calendar_id INTEGER UNIQUE, notifications TEXT );');
//db.none('INSERT INTO public."users"(id, username, firstName, lastName, email, password_val, calendar_id, notifications) VALUES(0, \'LifeOnTrack\', \'no first name\', \'no last name\', \'lifeontrack@gmail.com\', \'password\', 0, \'example notif\');');

const users = [];

//MEGHAN THIS MAY BE A YOU FUNCTION
exports.auth = function(req, res) {
	res.redirect('/personalcal.html');
};

exports.list = function(req, res) {
	//res.end(JSON.stringify(db.any('SELECT * FROM public."users";')));
};

exports.create = function(req, res) {
	res.sendStatus(201);
	let lastId = db.any('SELECT MAX(id) FROM public."users";');
	let newId = lastId + 1;
	/*
    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password_val = req.body.password;
    let calendar_id = req.body.calendar_id;
    let notifications = req.body.notifications;
    db.none('INSERT INTO public."user"(id, username, firstName, lastName, email, password_val, calendar_id, notifications) VALUES($1, $2, $3, $4, $5, $6, $7, $8);', [newId, username, firstName, lastName, email, password_val, calendar_id, notifications]);
    */
};

exports.load = function(req, res, next) {
	const id = parseInt(req.params.user, 10);

	res.end(JSON.stringify(db.any('SELECT * FROM public."users" WHERE id=$1;', [id])));

	req.user = users[id];
	if (req.user) {
		next();
	} else {
		res.status(404).send('User Not Found');
		// const err = new Error('cannot find user ' + id);
		// err.status = 404;
		// next(err);
	}
};

//NOT SURE WE EVEN USE THIS
exports.find = function(req, res) {
	res.json(req.user);
};


exports.remove = function(req, res) {
	/*
    let userId = req.params.user;
    db.none('DELETE from public."users" WHERE id=$1;', [userId]);
    */
	res.sendStatus(204);
};

//NEEDS TO BE WORKED MORE - MEGHAN CAN YOU ALTER THIS TO WORK CORRECTLY?
//I FEEL YOU PROBABLY KNOW MORE ABOUT THIS FUNCTION
exports.listSubscribed = function(req, res) {
	/*
    let userId = req.body.id;
    res.end(JSON.stringify(db.any(SELECT * FROM public."subscriptions" INNER JOIN public."calendars" ON calendars.id = subscriptions.calendar_id WHERE user_id=$1;', [userId])));
    */
	res.json(req.subs.map(sub => users[sub.user_id]));
};

//POST notification
//MEGHAN FILL IN
exports.notify = function(req, res){
	let user = users.find( ({id}) => id === req.body.id);
	user.notifcations.push(req.notification);
	res.sendStatus(204);

};

//GET notifications
//MEGHAN FILL IN
exports.notifications = function(req, res){
	//find the correct user
	//get that user's notifications
	res.sendStatus(204);
};

//MEGHAN FILL IN
exports.removeNotif = function(req, res){
	//take a notification object in the req?
	//notifications.pop(...)
	res.sendStatus(204);

};