'use strict';

const db = require('../app.js').db;

/*
ENUM FOR ARCHIVED: 
    0 corresponds to 'Not archived'
    1 corrsponds to 'Archived'
*/
db.none('CREATE TABLE IF NOT EXISTS to_dos(id INTEGER PRIMARY KEY, content VARCHAR, user_id INT, archived INT);');
//db.none('INSERT INTO public."to_dos"(id, content, user_id, archived) VALUES(0, \'example to-do\', 0, 0);');

exports.listAll = function(req, res) {
	res.json(todos);
};

exports.list = function(req, res) {
	res.json(todos.filter(todo => todo.user_id === req.user.id));
};

exports.create = function(req, res) {
	res.sendStatus(201);
	lastId += 1;
	todos.push({
		id: lastId,
		content: req.content,
		user_id: req.userId,
		archived: req.archived
	});
	console.log(req.body);
};

exports.find = function(req, res) {
	const id = parseInt(req.params.todo, 10);
	if (todos[id] && todos[id].user_id === req.user.id) {
		res.json(todos[id]);
	} else {
		res.status(404).send('Todo Not Found');
	}
};

exports.edit = function(req, res) {
	res.sendStatus(204);
};

exports.remove = function(req, res) {
	res.sendStatus(204);
};
