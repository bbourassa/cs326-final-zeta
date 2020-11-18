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

// exports.addUser = async function addUser(fname, lname, email, username, password) {

// 	// Check for user
// 	if(!findUser(username)){

//     db.none('INSERT INTO public."user"(id, username, firstName, lastName, email, password_val, calendar_id, notifications) VALUES($1, $2, $3, $4, $5, $6, $7, $8);', [newId, username, fname, lname, email, password, calendar_id, notifications]);

// 		console.log('added');
	// 	return true;
	// } else{
	// 	return false;
	// }
// };


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

// export {findUser};