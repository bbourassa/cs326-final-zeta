'use strict';
//holds first draft at authentication protocals

// For loading environment variables.
require('dotenv').config(); //Should be as high up as possible-- does the .env stuff
const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy

const db = require('../app.js').db;

const app = express();

const minicrypt = require('../miniCrypt');

const mc = new minicrypt();


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
	// console.log('checked for user');
	// Check for user
	if(!exists){
		let lastId = await db.any('SELECT MAX(id) FROM public."users";');
		let newId = lastId[0].max + 1;
		let username = Username;
		let firstName = fname;
		let lastName = lname;
		let email = Email;

		// let password_val = password;
		const encrypt = mc.hash(password);
		const salt = encrypt[0];
		const hash = encrypt[1];

		//create personal cal
		let lastCal = await db.any('SELECT MAX(id) FROM public."calendars";');
		let newCal = lastCal[0].max + 1;
		let name = username;
		let ownerId = newId;
		let personal = 1;
		let description = 'User ' + username +'\'s personal calendar';
		db.none('INSERT INTO public."calendars"(id, name, owner_id, personal, description) VALUES($1, $2, $3, $4, $5);', [newCal, name, ownerId, personal, description]);
		// console.log(salt, hash);
		//create user!
		db.none('INSERT INTO public."users"(id, username, firstName, lastName, email, password_val, calendar_id, salt, hash) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9);', [newId, username, firstName, lastName, email, '',newCal, salt, hash]);

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
	console.log('checking credentials');
	const user = (await(db.any('SELECT * FROM public."users" WHERE username=$1;', [username])));
	if(user === '[]'){
		console.log('no user');
		return false;
	}
	else if(!mc.check(pwd, user[0].salt, user[0].hash)){
		console.log('wrong pass');
		return false;
	}
	console.log('logging in');
	// next();
	return true;
};


exports.checkLoggedIn = function checkLoggedIn(req, res, next) {
	console.log('check logged in');
	if(req.isAuthenticated()){
		console.log(res.user, req.isAuthenticated());
		//if you are logged/ authenticated, run next route
		next();
	} else {
		console.log(res.user);
		//otherwise, redirect to login
		res.redirect('../html/index.html');
	}
};

// module.exports {findUser};