'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS subscriptions(id INTEGER PRIMARY KEY, user_id INT, calendar_id INT);');
//db.none('INSERT INTO public."subscriptions"(id, user_id, calendar_id) VALUES(0, 0 , 0);');

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
