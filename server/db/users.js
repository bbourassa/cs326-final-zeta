'use strict';

// fake user database

const sizes = require('./fakeSizes');
const faker = require('faker');
faker.seed(579);

const users = [];
users.push({
    id: 0,
    username: 'janedoe101',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jdoe@example.com',
    password: 'password'
});
for (let i = 1; i < sizes.users; ++i) {
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    users.push({
        id: i,
        username: faker.internet.userName(first, last),
        firstName: first,
        lastName: last,
        email: faker.internet.email(first, last),
        password: faker.internet.password(),
        calendar_id: i
    });
}

exports.auth = function(req, res) {
    res.redirect('/personalcal.html');
};

exports.list = function(req, res) {
    res.json(users);
};

exports.create = function(req, res) {
    res.sendStatus(201);
};

exports.load = function(req, res, next) {
    const id = parseInt(req.params.user, 10);
    req.user = users[id];
    if (req.user) {
        next();
    } else {
        res.status(404).send('User Not Found');
        // const err = new Error('cannot find user ' + id);
        // err.status = 404;
        // next(err);
    }
};

exports.find = function(req, res) {
    res.json(req.user);
};

exports.remove = function(req, res) {
    res.sendStatus(204);
};

exports.listSubscribed = function(req, res) {
    res.json(req.subs.map(sub => users[sub.user_id]));
};
