'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY, owner_id INT, subscriber_id INT, content VARCHAR);');

exports.create = async function(req, res) {
	let lastId = await db.one('SELECT MAX(id) FROM public."notifications";');
	let newId = parseInt(lastId.max) + 1;
	let ownerId = req.params.user;
	let subId = req.params.sub;
	let content = req.body.content;
	console.log('lastId', lastId.max, 'newId', newId, 'content', content);
	db.none('INSERT INTO public."notifications"(id, owner_id, subscriber_id, content) VALUES($1, $2, $3, $4);', [parseInt(newId), parseInt(ownerId), parseInt(subId), content]);
	res.sendStatus(201);
};

exports.list = async function(req, res) {
	console.log('hit list notifs');
	let subId = req.params.user;
	console.log('subId', subId);
	res.json('SELECT * FROM public."notifications" WHERE subscriber_id=$1;', [subId]);
};