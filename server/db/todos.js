'use strict';

/*const sizes = require('./fakeSizes');
const faker = require('faker');
faker.seed(123);
let lastId = 0;

const todos = [];
for (let i = 0; i < sizes.todos; ++i) {
	todos.push({
		id: i,
		content: faker.lorem.sentence(),
		user_id: faker.random.number(sizes.users - 1),
		archived: faker.random.boolean()
	});
}*/

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
