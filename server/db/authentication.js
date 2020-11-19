'use strict';
//holds first draft at authentication protocals

// For loading environment variables.
require('dotenv').config(); //Should be as high up as possible-- does the .env stuff
const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
//const LocalStrategy = require('passport-local').Strategy; // username/password strategy

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

exports.findU =  async function findUser(username){
	// let exists;
	try {
		//const user = JSON.stringify(await(db.any('SELECT * FROM public."users" WHERE username=$1;', [username])));
		return true;
	} catch(e){
		console.log(e);
		return false;
	}
	// return exists;
};


exports.check = async function checkCreds(username, pwd){
//get the user
// if it fails, return false
//otherwise, check password
	// let user;
	console.log('checking cred');
	try { //check that user exists by username, returns user
		const user = (await(db.any('SELECT * FROM public."users" WHERE username=$1;', [username])));
		//then check password
		if(user[0].password_val !== pwd){
			return false;
		}
	} catch (e){
		return false;
	}
	return true;
};


exports.checkLoggedIn = function checkLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		//if you are logged/ authenticated, run next route
		next();
	} else {
		//otherwise, redirect to login
		res.redirect('../html/index.html');
	}
};

