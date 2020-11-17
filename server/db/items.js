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
db.none('CREATE TABLE IF NOT EXISTS items_for_calendars(id INTEGER PRIMARY KEY, name VARCHAR, item_type INT, start_time VARCHAR, end_time VARCHAR, description TEXT, item_status INT, calendar_id INT, related_links TEXT, parent_id INT);');
//db.none('UPDATE public."items_for_calendars" SET start_time=$1 WHERE id=$2 AND calendar_id=$3;', ['2020-11-18T10:23', 1, 0]);

exports.listAll = async function(req, res) {
    res.json(await db.any('SELECT * FROM public."items_for_calendars";'));
};

exports.list = async function(req, res) {
    let calendarId = req.params.cal;;
    res.json(await db.any('SELECT * FROM public."items_for_calendars" WHERE calendar_id=$1;', [calendarId]));
    //res.end(JSON.stringify(db.any('SELECT name FROM public."items_for_calendars" WHERE id=$1;', [calendarId])));
};

exports.create = function(req, res) {
    let lastId =  db.any('SELECT MAX(id) FROM public."items_for_calendars";');
    let newId = lastId + 1; 
    let name = req.body.name;
    let itemType = req.body.itemType;
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let description = req.body.description;
    let itemStatus = req.body.itemStatus;
    let calendarId = req.params.cal;
    let relatedLinks = req.body.relatedLinks;
    let parentId = req.body.parentId
    db.none('INSERT INTO public."items_for_calendars"(id, name, item_type, start_time, end_time, description, item_status, calendar_id, related_links, parent_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', [newId, name, itemType, startTime, endTime, description, itemStatus, calendarId, relatedLinks, parentId]);
	res.sendStatus(201);
};

exports.find = async function(req, res) {
    let calendarId = req.params.cal;
    let itemId = req.params.item;
    res.json(await db.any('SELECT * FROM public."items_for_calendars" WHERE calendar_id=$1 AND id=$2;', [calendarId, itemId]));
};

//NOT SURE WE EVER USE THIS 
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
    let itemId = req.params.item;
    let name = req.body.name;
    let itemType = req.body.type;
    let startTime = req.body.start;
    console.log('start time is ' + startTime);
    let endTime = req.body.end;
    console.log('end time is ' + endTime);
    let description = req.body.description;
    console.log('descriptions is ' + description);
    let itemStatus = req.body.status;
    console.log('item status is ' + itemStatus);
    let calendarId = req.params.cal;
    console.log('calendar id is ' + calendarId);
    let relatedLinks = req.body.related_links;
    console.log('related links is ' + relatedLinks);
    if(itemType === 2) {
        itemStatus = 0;
    }
    /*db.none('UPDATE public."items_for_calendars" SET name=$1, WHERE id=0;', [name]);*/
    db.none('UPDATE public."items_for_calendars" SET name=$1, item_type=$2, start_time=$3, end_time=$4, description=$5, item_status=$6, related_links=$7 WHERE id=$8 AND calendar_id=$9;', [name, itemType, startTime, endTime, description, itemStatus, relatedLinks, itemId, calendarId]);
	res.sendStatus(204);
};

exports.remove = function(req, res) {
    console.log('hit');
    let calendarId = req.params.cal;
    let itemId = req.params.item;
    db.none('DELETE from public."items_for_calendars" WHERE calendar_id=$1 AND id=$2;', [calendarId, itemId]);
	res.sendStatus(204);
};

//NOT SURE ABOUT THIS FUNCTION
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