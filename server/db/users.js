'use strict';

// fake user database

const sizes = require('./fakeSizes');
const faker = require('faker');
faker.seed(579);

const users = [];
let lastId = 0;

users.push({
	id: 0,
	username: 'LifeOnTrack',
	firstName: 'No',
	lastName: 'Name',
	email: 'lifeontrack@example.com',
	password: 'password',
	calendar_id: 0,
	notifcations: ['Change made to: CS 326 \n "Added milestone 2"']
});
/*for (let i = 1; i < sizes.users; ++i) {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    users.push({
        id: i,
        username: faker.internet.userName(first, last),
        firstName: first,
        lastName: last,
        email: faker.internet.email(first, last),
        password: faker.internet.password(),
        calendar_id: i,
        notifications: [faker.lorem.sentence(), faker.lorem.sentence()]
    });
}*/

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
	let user = users.find( ({id}) => id === req.body.id);
	let notifs = user.notifcations;
	res.json(notifs);
};