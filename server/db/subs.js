'use strict';

// fake subscription database

const fs = require('fs');
const path = require('path');
const sizes = require('./fakeSizes');
const faker = require('faker');
const { users } = require('./fakeSizes');
faker.seed(194);
const filename = path.resolve(__dirname, './ours/oursubs.json');

const subs = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : [];
let lastId = 0;

for (let i = 0; i < sizes.subs; ++i) {
	subs.push({
		id: i,
		user_id: faker.random.number({ min: 1, max: sizes.users - 1 }),
		calendar_id: faker.random.number({ min: sizes.users, max: sizes.cals + 3 })
	});
}

subs.push({
	id:3,
	user_id: 0,
	calendar_id:1
});

exports.listAll = function(req, res) {
	res.json(subs);
};

exports.loadUser = function(req, res, next) {
	req.subs = subs.filter(sub => sub.user_id === req.user.id);
	next();
};

exports.list = function(req, res) {
	
	res.json(req.subs);
};

exports.create = function(req, res) {
	res.sendStatus(201);
	lastId += 1;
	subs.push({
		id: lastId,
		user_id: req.userId,
		calendar_id: req.calId
	});
};

exports.find = function(req, res) {
	const id = parseInt(req.params.sub, 10);
	if (subs[id] && subs[id].user_id === req.user.id) {
		res.json(subs[id]);
	} else {
		res.sendStatus(404);
	}
};

exports.remove = function(req, res) {
	res.sendStatus(204);
};

exports.loadCalendar = function(req, res, next) {
	req.subs = subs.filter(sub => sub.calendar_id === req.cal.id);
	next();
};

//returns every calendar that a given user is subscribed to
/**
 * 
 * @param {Request} req will take a user_id
 * @param {Response} res If there is none, will return empty array
 */
exports.listSubscribed = function(req, res){
	const user =  parseInt(req.body.id);
	let subscriptions = [];
	subs.array.forEach(sub => {
		if(sub.user_id === user){
			subscriptions.push(sub.cal_id);
		}
	});
	res.json(subscriptions);



}