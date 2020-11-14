'use strict';
// fake calendar database

const db = require('../app.js').db;

/*
ENUM FOR PERSONAL VALUES:
    0 corresponds to false
    1 corresponds to true
*/
db.none('CREATE TABLE IF NOT EXISTS calendars(id INTEGER PRIMARY KEY, name VARCHAR, owner_id INT, personal INT, description TEXT);');
//db.none('INSERT INTO public."calendars"(id, name, owner_id, personal, description) VALUES(0, \'example calendar\', 0, 1, \'this is an example of a calendar\');');

exports.listAll = function(req, res) {
    res.json(cals);
    res.end(JSON.stringify(db.any('SELECT * FROM public."calendars";')));
};

exports.create = function(req, res) {
    //INSERT STATEMENT
    let lastId = db.any('SELECT MAX(id) FROM public."calendars";');
    let newId = lastId + 1;
    /*
    let name = req.body.name;
    let ownerId = req.body.ownerId;
    let personal = req.body.personal;
    let description = req.body.description
    //db.none('INSERT INTO public."calendars"(id, name, owner_id, personal, description) VALUES($1, $2, $3, $4, $5);', [newId, name, ownerId, personal, description]);
    */
    res.sendStatus(201);
    
};

exports.load = function(req, res, next) {
	const id = parseInt(req.params.cal, 10);
	//res.end(JSON.stringify(db.any('SELECT * from calendars WHERE id=$1;', [id])));
	if (req.cal) {
		next();
	} else {
		res.status(404).send('Calendar Not Found');
	}
};

//NOT SURE WE EVEN USE THIS
exports.find = function(req, res) {
	res.json(req.cal);
};

exports.edit = function(req, res) {
    /*
    let calendarId = req.body.id;
    let name = req.body.name;
    let ownerId = req.body.ownerId;
    let personal = req.body.personal;
    let description = req.body.description
    db.none('UPDATE public."calendars" SET name=$1, description=$2 WHERE id=$3;', [name, description, calendarId]);
    */
	res.sendStatus(204);
};

exports.remove = function(req, res) {
    /*
    let calendarId = req.body.id;
    db.none('DELETE from public."calendars" WHERE id=$1;', [calendarId]);
    */
	res.sendStatus(204);
};

exports.listOurs = function(req, res) {
    /*
    res.end(JSON.stringify(db.any('SELECT * from public."calendars" WHERE id BETWEEN 1 AND 4;')));
    */
};

//NOT SURE WE EVEN USE THIS
exports.loadSubscribed = function(req, res, next) {
	req.cals = req.subs.map(sub => cals[sub.calendar_id]);
	next();
};

//NOT SURE WE EVEN USE THIS
exports.listSubscribed = function(req, res) {
	res.json(cals.filter(cal => cal.owner_id === 0 && !cal.personal));
};


exports.updatePersonal = function(req, res) {
    /*
    let userId = req.body.id;
    res.end(JSON.stringify(db.any('SELECT * from public."calendars" WHERE owner_id=$1 AND personal=1;', [userId])));
    */
	res.sendStatus(204);
};