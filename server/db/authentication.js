'use strict';
//holds first draft at authentication protocals

// For loading environment variables.
require('dotenv').config(); //Should be as high up as possible-- does the .env stuff
const e = require('express');
const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
// const LocalStrategy = require('passport-local').Strategy; // username/password strategy

const db = require('../app.js').db;

const app = express();

// const dbconnection = require('../secrets.json');



//session configuration
const session = {
	secret: process.env.SECRET  ,
	resave:false,
	saveUninitialized : false
};


//app configuration :AKA: MAGIC CODE, DO NOT CHANGE
app.use(expressSession(session));
// passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
//End of magic

exports.findUser = async function findUser(username){
	// let exists;
	try {
		const user = JSON.stringify(await(db.any('SELECT * FROM public."users" WHERE username=$1;', [username])));
		// console.log(username, user);
		if(user === '[]'){
			console.log('not exst');
			return false;
		}
		return true;
	} catch(e){
		console.log(e);
		return false;
	}
	// return exists;
};

exports.addNewUser = async function addUser(fname, lname, Email,Username, password) {
	let exists = true;
	const user = JSON.stringify(await(db.any('SELECT * FROM public."users" WHERE username=$1;', [Username])));

	if(user === '[]'){
		// console.log('not exst');
		exists= false;
	} else {
		exists = true;
	}
	console.log('checked for user');
	// Check for user
	if(!exists){
		let lastId = await db.any('SELECT MAX(id) FROM public."users";');
		let newId = lastId[0].max + 1;
		let username = Username;
		let firstName = fname;
		let lastName = lname;
		let email = Email;
		let password_val = password;
		// let notifications = req.body.notifications;

		//create personal cal
		let lastCal = await db.any('SELECT MAX(id) FROM public."calendars";');
		let newCal = lastCal[0].max + 1;
		let name = username;
		let ownerId = newId;
		let personal = 1;
		let description = 'User ' + username +'\'s personal calendar';
		db.none('INSERT INTO public."calendars"(id, name, owner_id, personal, description) VALUES($1, $2, $3, $4, $5);', [newCal, name, ownerId, personal, description]);

		//create user!
		db.none('INSERT INTO public."users"(id, username, firstName, lastName, email, password_val, calendar_id) VALUES($1, $2, $3, $4, $5, $6, $7);', [newId, username, firstName, lastName, email, password_val, newCal]);

		//user should be subscribed to their personal cal
		let lastSub =  await db.any('SELECT MAX(id) FROM public."subscriptions";');
		let newSub = lastSub[0].max + 1;
		let userSub = newId;
		let calendarId = newCal;
		db.none('INSERT INTO public."subscriptions"(id, user_id, calendar_id) VALUES($1, $2, $3);', [newSub, userSub, calendarId]);

		return true;
	} else{
		// console.log('username used already');
		return false;
	}
};


exports.check = async function checkCreds(username, pwd){
//get the user
// if it fails, return false
//otherwise, check password
	// let user;
	const user = (await(db.any('SELECT * FROM public."users" WHERE username=$1;', [username])));
	if(user === '[]'){
		return false;
	}
	else if(user[0].password_val !== pwd){ //TODO not failing where it is supposed to
		return false;
	}
	else{
		return true;
	}
};


exports.checkLoggedIn = function checkLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		//if you are logged/ authenticated, run next route
		next();
	} else {
		console.log('not logged it');
		//otherwise, redirect to login
		res.redirect('../html/index.html');
	}
};

// module.exports {findUser};