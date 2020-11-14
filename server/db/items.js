'use strict';

const db = require('../app.js').db;

/*
ENUM FOR TYPE: 
    1 corresponds to 'Action Item'
    2 corrsponds to 'Event'
ENUM FOR STATUS:
    0 corresponds to Null (for events)
    1 corresponds to 'not started'
    2 corresponds to 'in progress'
    3 corresponds to 'completed'
*/
db.none('CREATE TABLE IF NOT EXISTS items_for_calendars(id INTEGER PRIMARY KEY, name VARCHAR, item_type INT, start_time VARCHAR, end_time VARCHAR, description TEXT, item_status INT, calendar_id INT, related_links TEXT);');
/*db.none('ALTER TABLE items_for_calendars ALTER COLUMN start_time TYPE VARCHAR;');
db.none('ALTER TABLE items_for_calendars ALTER COLUMN end_time TYPE VARCHAR;');
db.none('INSERT INTO public."items_for_calendars"(id, name, item_type, start_time, end_time, description, item_status, calendar_id, related_links) VALUES(0, \'example item\', 1, \'example start time\', \'example end time\', \'this is an example of an item\', 1, 0, \'example for related links\');');*/

exports.listAll = function(req, res) {
	/*res.json(items);*/
};

exports.list = function(req, res) {
	/*let result = items.filter(item => item.calendar_id === req.cal.id);
	const values = Object.values(req.query);
	if (values.length === 0) {
		res.json(result);
	} else if (values.every(v => typeof v === 'string')) {
		const y = req.query.year ? parseInt(req.query.year, 10) : NaN;
		let m = req.query.month ? parseInt(req.query.month, 10) : NaN;
		if (isNaN(y) || isNaN(m)) {
			res.sendStatus(400);
		} else {
			m -= 1;
			const inYear = item => item.start.getFullYear() === y || (item.end && item.end.getFullYear() === y);
			const inMonth = item => item.start.getMonth() === m || (item.end && item.end.getMonth() === m);

			result = result.filter(item => inYear(item) && inMonth(item));

			const d = req.query.day ? parseInt(req.query.day, 10) : NaN;
			if (!isNaN(d)) {
				const inDay = item => item.start.getDate() === d || (item.end && item.end.getDate() === d);
				result = result.filter(item => inDay(item));
			}
			res.json(result);
		}
	} else {
		res.sendStatus(400);
	}*/
};

exports.create = function(req, res) {
	res.sendStatus(201);
};

exports.find = function(req, res) {
	/*const id = parseInt(req.params.item, 10);
	if (items[id] && items[id].calendar_id === req.cal.id) {
		res.json(items[id]);
	} else {
		res.status(404).send('Item Not Found');
	}*/
};

exports.findUnlinked = function(req, res){
	/*//get item id from the request
	const id = parseInt(req.params.item, 10);
	//if that item id exists in the array of items, send back item
	if(items[id]){
		res.json(items[id]);
	} else{
		res.status(404).send('Item Not Found');
	}*/
};

exports.edit = function(req, res) {
	res.sendStatus(204);
};

exports.remove = function(req, res) {
	res.sendStatus(204);
};

exports.listSubscribed = function(req, res) {
	/*res.json(req.cals.map(cal => {
		const itemList = items.filter(item => item.calendar_id === cal.id);
		const obj = {
			id: cal.id,
			name: cal.name,
			owner: cal.owner_id,
			items: itemList
		};
		return obj;
	}));*/
};