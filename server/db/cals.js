'use strict';
// fake calendar database

const db = require('../app.js').db;

/*
ENUM FOR PERSONAL VALUES:
    0 corresponds to false
    1 corresponds to true
*/
db.none('CREATE TABLE IF NOT EXISTS calendars(id INTEGER PRIMARY KEY, name VARCHAR, owner_id INT, personal INT, description TEXT);');

exports.listAll = async function(req, res) {
    //res.json(cals);
    console.log('enter');
    res.json(await db.any('SELECT * FROM public."calendars";'));
};

exports.getUsersCals = async function(req, res) {
    //console.log('hit');
    let userId = req.params.user;
    //console.log('user cals' + JSON.stringify(await db.any('SELECT * FROM public."calendars" WHERE owner_id=$1', [userId])));
    res.json(await db.any('SELECT * FROM public."calendars" WHERE owner_id=$1', [userId]));
}

exports.create = async function(req, res) {
    //INSERT STATEMENT
    //console.log('hit');
    let lastId = await db.any('SELECT MAX(id) FROM public."calendars";');
    let newId = lastId[0].max + 1;
    let name = req.body.name;
    let ownerId = req.body.ownerId;
    let personal = req.body.personal;
    let description = req.body.description
    db.none('INSERT INTO public."calendars"(id, name, owner_id, personal, description) VALUES($1, $2, $3, $4, $5);', [newId, name, ownerId, personal, description]);
    res.sendStatus(201);
    
};

exports.load = async function(req, res, next) {
    const id = parseInt(req.params.cal, 10);
    //console.log('hit');
	res.json(await db.any('SELECT * from calendars WHERE id=$1;', [id]));
	/*if (req.cal) {
		next();
	} else {
		res.status(404).send('Calendar Not Found');
	}*/
};

//NOT SURE WE EVEN USE THIS
exports.find = async function(req, res) {
    console.log('hit find');
	const id = parseInt(req.params.cal, 10);
	res.json(await db.any('SELECT * from calendars WHERE id=$1;', [id]));
};

exports.edit = function(req, res) {
    //console.log('hit');
    let calendarId = req.params.cal;
    let name = req.body.name;
    let ownerId = req.body.ownerId;
    let personal = req.body.personal;
    let description = req.body.description
    db.none('UPDATE public."calendars" SET name=$1, description=$2 WHERE id=$3;', [name, description, calendarId]);
	res.sendStatus(204);
};

exports.remove = function(req, res) {
    //console.log('hit');
    let calendarId = req.params.cal;
    db.none('DELETE from public."calendars" WHERE id=$1;', [calendarId]);
	res.sendStatus(204);
};

exports.listOurs = async function(req, res) {
    //console.log('hit');
    res.json(await db.any('SELECT * from public."calendars" WHERE id BETWEEN 1 AND 4;'));
};

//NOT SURE WE EVEN USE THIS
exports.loadSubscribed = function(req, res, next) {
    //console.log('hit');
    let subscribedCalendars = [];

	req.cals = req.subs.map(sub => cals[sub.calendar_id]);
	next();
};

//NOT SURE WE EVEN USE THIS
exports.listSubscribed = function(req, res) {
	res.json(cals.filter(cal => cal.owner_id === 0 && !cal.personal));
};


exports.updatePersonal = async function(req, res) {
    //console.log('hit');
    let userId = req.params.user;
    res.json(await db.any('SELECT * from public."calendars" WHERE owner_id=$1 AND personal=1;', [userId]));
	res.sendStatus(204);
};