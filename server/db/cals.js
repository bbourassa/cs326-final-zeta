'use strict';
// fake calendar database


/*const fs = require('fs');
const path = require('path');

const sizes = require('./fakeSizes');
const faker = require('faker');
faker.seed(329);
const filename = path.resolve(__dirname, './ours/ourcals.json');

const cals = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : [];
//temp
cals.push({
	id:1, 
	name: 'CS 211',
	owner_id: 0,
	personal:false
});

for (let i = 0; i < sizes.users; ++i) {
	cals.push({
		id: i,
		name: 'User ' + i + ' Personal Calendar',
		owner_id: i,
		personal: true
	});
}
for (let i = sizes.users; i < sizes.cals; ++i) {
	cals.push({
		id: i,
		name: faker.lorem.words(),
		owner_id: faker.random.number({ min: 1, max: sizes.users - 1 }),
		personal: false
	});
}*/



exports.listAll = function(req, res) {
	res.json(cals);
};

exports.create = function(req, res) {
	res.sendStatus(201);
};

exports.load = function(req, res, next) {
	const id = parseInt(req.params.cal, 10);
	for(let i = 0; i < cals.length; i++) {
		if (cals[i].id === id) {
			req.cal = cals[i];
		}
	}
	if (req.cal) {
		next();
	} else {
		res.status(404).send('Calendar Not Found');
	}
};

exports.find = function(req, res) {
	res.json(req.cal);
};

exports.edit = function(req, res) {
	res.sendStatus(204);
};

exports.remove = function(req, res) {
	res.sendStatus(204);
};

exports.listOurs = function(req, res) {
	res.json(cals.filter(cal => cal.owner_id === 0 && !cal.personal));
};

exports.loadSubscribed = function(req, res, next) {
	req.cals = req.subs.map(sub => cals[sub.calendar_id]);
	next();
};

exports.listSubscribed = function(req, res) {
	res.json(cals.filter(cal => cal.owner_id === 0 && !cal.personal));
};

exports.updatePersonal = function(req, res) {
	res.sendStatus(204);
};