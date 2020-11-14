'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, firstName VARCHAR, lastName VARCHAR, email VARCHAR, password_val VARCHAR, calendar_id INTEGER UNIQUE, notifications TEXT );');
//db.none('INSERT INTO public."users"(id, username, firstName, lastName, email, password_val, calendar_id, notifications) VALUES(0, \'LifeOnTrack\', \'no first name\', \'no last name\', \'lifeontrack@gmail.com\', \'password\', 0, \'example notif\');');

const users = [];

exports.auth = function(req, res) {
	res.redirect('/personalcal.html');
};

exports.list = function(req, res) {
	res.json(users);
};

exports.create = function(req, res) {
	res.sendStatus(201);
	console.log(req.body);
	lastId += 1;
	users.push({
		id: lastId,
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		calendar_id: lastId,
		notifications: req.body.notifcations
	});
	console.log(users);
};

exports.load = function(req, res, next) {
	const id = parseInt(req.params.user, 10);
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

exports.find = function(req, res) {
	res.json(req.user);
};

exports.remove = function(req, res) {
	res.sendStatus(204);
};

exports.listSubscribed = function(req, res) {
	res.json(req.subs.map(sub => users[sub.user_id]));
};

//POST notification
exports.notify = function(req, res){
	let user = users.find( ({id}) => id === req.body.id);
	user.notifcations.push(req.notification);
	res.sendStatus(204);

};

//GET notifications
exports.notifications = function(req, res){
	//find the correct user
	//get that user's notifications
	res.sendStatus(204);
};

exports.removeNotif = function(req, res){
	//take a notification object in the req?
	//notifications.pop(...)
	res.sendStatus(204);

};