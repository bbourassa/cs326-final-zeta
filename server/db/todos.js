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
     /*
    res.end(JSON.stringify(db.any('SELECT * FROM public."to_dos";')));
    */
};

exports.list = function(req, res) {
    /*
    let userId = req.body.userId;
    res.end(JSON.stringify(db.any('SELECT * FROM public."to_dos" WHERE user_id=$1;', [userId])));
    res.json(todos.filter(todo => todo.user_id === req.user.id));
    */
};

exports.create = function(req, res) {
	let lastId =  db.any('SELECT MAX(id) FROM public."items_for_calendars";');
    let newId = lastId + 1; 
    /*
    let content = req.body.content;
    let userId = req.body.userId;
    let archived = 0;
    db.none('INSERT INTO public."to_dos"(id, content, user_id, archived) VALUES($1, $2, $3, $4);', [newId, content, userId, archived]);
    */
};

exports.find = function(req, res) {
    /*
    let userId = req.params.user;
    let toDoId = req.params.todo;
    res.end(JSON.stringify(db.any('SELECT * FROM public."to_dos" WHERE user_id=$1, id=$2;' [userId, toDoId])));
    */
	/*const id = parseInt(req.params.todo, 10);
	if (todos[id] && todos[id].user_id === req.user.id) {
		res.json(todos[id]);
	} else {
		res.status(404).send('Todo Not Found');
	}*/
};

exports.edit = function(req, res) {
    /*
    let userId = req.params.user;
    let toDoId = req.params.todo;
    let content = req.body.content;
    let archived = req.body.archived
    db.none('UPDATE public."to_dos" SET content=$1, archived=$2 WHERE id=$3 AND user_id=$4;', [content, archived, toDoId, userId]);
    */
	res.sendStatus(204);
};

exports.remove = function(req, res) {
    /*
    let userId = req.params.user;
    let toDoId = req.params.todo;
    db.none('DELETE from public."to_dos" WHERE user_id=$1 AND id=$2;', [userId, toDoId]);
    */
	res.sendStatus(204);
};
