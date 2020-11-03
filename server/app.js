'use strict';

const express = require('express');
const path = require('path');

// fake databases
const users = require('./db/users');
const cals = require('./db/cals');
const subs = require('./db/subs');
const todos = require('./db/todos');
const items = require('./db/items');

const app = express();

app.set('json spaces', '\t');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dir = path.dirname(__dirname);
app.use('/images', express.static(path.join(dir, 'images')));
app.use('/css', express.static(path.join(dir, 'css')));
app.use('/js', express.static(path.join(dir, 'js')));
app.use('/html', express.static(path.join(dir, 'html')));
app.use('/', express.static(path.join(dir, 'html')));

app.post('/api/login', users.auth);

app.get('/api/users', users.list);
app.post('/api/users', users.create);
app.use('/api/users/:user', users.load);
app.get('/api/users/:user', users.find);
app.delete('/api/users/:user', users.remove);

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

const port = process.env.PORT;
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});
