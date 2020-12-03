/* eslint-disable linebreak-style */
'use strict';
require('dotenv').config(); //loading environmen variables; should be as high as possible
const express = require('express');
const path = require('path');
const app = express();

//SECRET
// const dbconnection = require('../secretRef.json');

// const username= dbconnection.username;
// const password=dbconnection.password;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const pgp = require('pg-promise')({
	connect(client) {
		console.log('Connected to database:', client.connectionParameters.database);
	},
	/*disconnect(client) {
        console.log('Disconnected from database:', client.connectionParameters.database);
    }*/
});
const url = process.env.DATABASE_URL; //|| `postgres://${username}:${password}@ec2-54-146-91-153.compute-1.amazonaws.com:5432/d1l0f3d95r5emj?sslmode=require`;



exports.db = pgp(url);

const users = require('./db/users');
const cals = require('./db/cals');
const subs = require('./db/subs');
const todos = require('./db/todos');
const items = require('./db/items');
const auth = require('./db/authentication');

app.set('json spaces', '\t');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dir = path.dirname(__dirname);
app.use('/images', express.static(path.join(dir, 'images')));
app.use('/css', express.static(path.join(dir, 'css')));
app.use('/js', express.static(path.join(dir, 'js')));
app.use('/html', express.static(path.join(dir, 'html')));
// app.use('/', express.static(path.join(dir, 'html')));


//PASSPORT CONFIGS ---------------------------------------------DO NOT REORDER------
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy

//session configuration
const session = {
	secret: process.env.SECRET, // || dbconnection.secret,
	resave:false,
	saveUninitialized : false
};

//configure passport
const strategy = new LocalStrategy(
	async(username, password, done) => {
		if( auth.findUser(username) === false){
			return done(null, false, { 'message': 'Wrong username or password'});
		}
		if(auth.check(username, password) ==false){
			//creates a 2 sec delay between failed attempts
			await new Promise((r) => setTimeout(r, 2000));
			return done(null, false, {'message':'Wrong username or password'});
		}
		// currently: user object is username string
		return done(null, username);
	}
);

//app configuration :AKA: MAGIC CODE, DO NOT CHANGE
app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
//End of magic
//END PASSPORT CONFIGS ---------------------------------------------------------


app.get('/user',
	auth.checkLoggedIn,
	(req, res) => {
		console.log(req.session.passport.user);
		res.json(req.session.passport.user);
	}
);

passport.serializeUser((user, done) => {  //produces an identifier;
	//puts id in the req.session.passport.user = {id: ''}
	// -> server only saves user ID, not everything
	done(null, user);
});
// Convert a unique identifier to a user object.
passport.deserializeUser((uid, done) => { //takes the ID and looks up user,
	// returns user object
	done(null, uid);
});

//When you open the first page, if not logged in, redirect
app.get('/',
	auth.checkLoggedIn,
	(req, res) => {
		console.log('user ' + req.session.user);
		res.redirect('../html/personalcal.html');
	});

// Handle post data from the login.html form.
app.post('/login',
	passport.authenticate('local' , {     // use username/password authentication
		successRedirect : '../html/personalcal.html',   // when we login, go to main page
		failureRedirect : '../html/index.html'      // otherwise, back to login
	})
);


// Handle logging out (takes us back to the login page).
app.get('/logout', (req, res) => {
	req.logout(); // Logs us out!
	res.redirect('../html/index.html'); // back to login
});

app.post('/signup',
	(req, res) => {
		const username = req.body['username'];
		const password = req.body['password'];
		const fname = req.body['fname'];
		const lname = req.body['lname'];
		const email = req.body['email'];
		if (auth.addNewUser(fname, lname, email, username, password)) {
			res.redirect('../html/index.html');
		} else {
			console.log('already exists, redirect to same pg');
			res.redirect('../html/signup.html'); //TODO this does not seem to be happening
		}
	});

//app.get('/api/users', users.list);
//app.post('/api/users', users.create);
//app.use('/api/users/:user', users.load);
app.get('/api/username/:username', users.findById); //ENDPOINT USED
//app.delete('/api/users/:user', users.remove);

// app.get('/api/users/:user/notifications', users.notifications);
// app.post('/api/users/:user/notifications', users.notify);

app.get('/api/todos/:user', todos.list); //ENDPOINT USED
app.post('/api/todos/:user', todos.create); //ENDPOINT USED
//app.get('/api/todos/:user/:todo', todos.find);
app.put('/api/todos/:user/:todo', todos.edit); //ENDPOINT USED
app.delete('/api/todos/:user/:todo', todos.remove); //ENDPOINT USED

//app.use('/api/users/:user/subscriptions', subs.loadUser);
//app.get('/api/users/:user/subscriptions', subs.list);
app.post('/api/subscriptions/:user', subs.create); //ENDPOINT USED
app.use('/api/subscriptions/:user', subs.listSubscribed); //ENDPOINT USED
//app.get('/api/users/:user/subscriptions/calendars', cals.listSubscribed);
//app.get('/api/users/:user/subscriptions/calendars/items', items.listSubscribed);
app.get('/api/subscriptionlist/:cal', subs.find); //ENDPOINT USED
app.delete('/api/subscription/:sub', subs.remove); //ENDPOINT USED

//app.put('/api/users/:user/calendar/pull', cals.updatePersonal);

app.get('/api/cals', cals.listAll); //ENDPOINT USED
app.get('/api/cals/:user/all', cals.getUsersCals); //ENDPOINT USED
app.post('/api/cals/:user', cals.create); //ENDPOINT USED
//app.get('/api/cals/ours', cals.listOurs);
//app.use('/api/cals/:cal', cals.load);
app.get('/api/cals/:cal/', cals.find); //ENDPOINT USED
app.put('/api/cals/:cal', cals.edit); //ENDPOINT USED
app.delete('/api/cals/:cal', cals.remove); //ENDPOINT USED

//app.use('/api/calendars/:cal/subscriptions', subs.loadCalendar);
//app.get('/api/calendars/:cal/subscriptions', subs.list);
//app.get('/api/calendars/:cal/subscriptions/users', users.listSubscribed);

app.get('/api/items/:cal', items.list); //ENDPOINT USED
app.post('/api/items/:cal', items.create); //ENDPOINT USED
app.get('/api/items/:cal/:item', items.find); //ENDPOINT USED
app.get('/api/item/:item', items.search); //ENDPOINT USED
app.put('/api/items/:cal/:item', items.edit); //ENDPOINT USED
app.delete('/api/items/:cal/:item', items.remove); //ENDPOINT USED

//app.get('/api/todos', todos.listAll);
//app.get('/api/subscriptions', subs.listAll);
//app.get('/api/items', items.listAll);
//app.get('/api/items/:item', items.findUnlinked);

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log('Listening on http://localhost:' + port);
});
