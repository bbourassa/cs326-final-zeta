'use strict';
require('dotenv').config(); //loading environmen variables; should be as high as possible
const express = require('express');
const path = require('path');

// const dbconnection = require('./secrets.json');
// const username = dbconnection.username;
// const password = dbconnection.password;

const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy


const pgp = require('pg-promise')({
	connect(client) {
		console.log('Connected to database:', client.connectionParameters.database);
	},
	/*disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }*/
});
const url = process.env.DATABASE_URL;
//  || `postgres://${username}:${password}@ec2-52-206-15-227.compute-1.amazonaws.com:5432/db0tah8l1g50dv?ssl=true`;

exports.db = pgp(url);

//db.none('CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, username VARCHAR, firstName VARCHAR, lastName VARCHAR, email VARCHAR, password_val VARCHAR, calendar_id INTEGER UNIQUE, notifications TEXT );');

const users = require('./db/users');
const cals = require('./db/cals');
const subs = require('./db/subs');
const todos = require('./db/todos');
const items = require('./db/items');
const auth = require('./db/authentication');

const app = express();

app.set('json spaces', '\t');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dir = path.dirname(__dirname);
app.use('/images', express.static(path.join(dir, 'images')));
app.use('/css', express.static(path.join(dir, 'css')));
app.use('/js', express.static(path.join(dir, 'js')));
app.use('/html', express.static(path.join(dir, 'html')));
// app.use('/', express.static(path.join(dir, 'html')));

//When you open the first page, if not logged in, redirect
app.get('/',
	auth.checkLoggedIn,
	(req, res) => {
		res.redirect('../html/personalcal.html');
	});

app.post('/api/login', users.auth);

app.get('/api/users', users.list);
app.post('/api/users', users.create);
app.use('/api/users/:user', users.load);
app.get('/api/users/:user', users.find);
app.delete('/api/users/:user', users.remove);

app.get('/api/users/:user/notifications', users.notifications);
app.post('/api/users/:user/notifications', users.notify);

app.get('/api/users/:user/todos', todos.list);
app.post('/api/users/:user/todos', todos.create);
app.get('/api/users/:user/todos/:todo', todos.find);
app.put('/api/users/:user/todos/:todo', todos.edit);
app.delete('/api/users/:user/todos/:todo', todos.remove);

app.use('/api/users/:user/subscriptions', subs.loadUser);
app.get('/api/users/:user/subscriptions', subs.list);
app.post('/api/users/:user/subscriptions', subs.create);
app.use('/api/users/:user/subscriptions/calendars', cals.loadSubscribed);
app.get('/api/users/:user/subscriptions/calendars', cals.listSubscribed);
app.get('/api/users/:user/subscriptions/calendars/items', items.listSubscribed);
app.get('/api/users/:user/subscriptions/:sub', subs.find);
app.delete('/api/users/:user/subscriptions/:sub', subs.remove);

app.put('/api/users/:user/calendar/pull', cals.updatePersonal);

app.get('/api/calendars', cals.listAll);
app.post('/api/calendars', cals.create);
app.get('/api/calendars/ours', cals.listOurs);
app.use('/api/calendars/:cal', cals.load);
app.get('/api/calendars/:cal', cals.find);
app.put('/api/calendars/:cal', cals.edit);
app.delete('/api/calendars/:cal', cals.remove);

app.use('/api/calendars/:cal/subscriptions', subs.loadCalendar);
app.get('/api/calendars/:cal/subscriptions', subs.list);
app.get('/api/calendars/:cal/subscriptions/users', users.listSubscribed);

app.get('/api/calendars/:cal/items', items.list);
app.post('/api/calendars/:cal/items', items.create);
app.get('/api/calendars/:cal/items/:item', items.find);
app.put('/api/calendars/:cal/items/:item', items.edit);
app.delete('/api/calendars/:cal/items/:item', items.remove);

app.get('/api/todos', todos.listAll);
app.get('/api/subscriptions', subs.listAll);
app.get('/api/items', items.listAll);
app.get('/api/items/:item', items.findUnlinked);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});