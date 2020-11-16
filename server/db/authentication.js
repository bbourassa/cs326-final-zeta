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

const dbconnection = require('../secrets.json');



//session configuration
const session = {
	secret: process.env.SECRET  || dbconnection.secret,
	resave:false,
	saveUninitialized : false
};

//configure passport
// const strategy = new LocalStrategy(
// 	async(username, password, done) => {
// 		if(!findUser(username)){
// 			return done(null, false, { 'message': 'Wrong username or password'});
// 		}
// 		if(!checkCreds(username, password)){
// 			//creates a 2 sec delay between failed attempts
// 			await new Promise((r) => setTimeout(r, 2000));
// 			return done(null, false, {'message':'Wrong username or password'});
// 		}
// 		//create a user object, associated w/ user_id
// 		// currently: user object is username string
// 		return done(null, username);
// 	}
// );
//app configuration :AKA: MAGIC CODE, DO NOT CHANGE
app.use(expressSession(session));
// passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());
//End of magic

exports.findU =  async function findUser(username){
	// let exists;
	try {
        const user = JSON.stringify(db.any('SELECT * FROM public."users" WHERE username=$1;', [username]));
        return true;
    } catch(e){
        console.log(e);
        return false;
	}
	// return exists;
};

//Produces a user identifier; puts it in req.session.passport.user = {id:''
//ONLY saves the ID, not the user's personal cal id or anything else
// Convert user object to a unique identifier.
// passport.serializeUser((user, done) => {
//     //user will come in as username
// 	let userObj;
// 	try{
// 		userObj = JSON.stringify(db.any('SELECT * FROM public."users" WHERE username=$1;', [user]));
// 		let user_id = userObj.id;
// 		done(null, user_id);
// 	} catch(e){
// 		done(null, false);
// 	}
// 	// console.log(user);
// 	//get userid from fetch
// 	// const userObj = fetch('/api/username/'+user);

// });

// //take that identifier, make it into the user object
// passport.deserializeUser((user_id, done) =>{
// 	let user;
//     try{ //try to get user id
//         user = JSON.stringify(db.any('SELECT * FROM public."users" WHERE id=$1;', [user_id]));
// 		// user = fetch(`/api/users/${user_id}`);
// 	} catch {
// 		return done(null, false);
// 	}

// 	done(null, user);
// });


exports.check = async function checkCreds(username, pwd){
//get the user
// if it fails, return false
//otherwise, check password
	let user;
	try { //check that user exists by username, returns user

        user = JSON.stringify(db.any('SELECT * FROM public."users" WHERE username=$1;', [username]));
		//then check password
		if(user.password !== pwd){
			return false;
		}
	} catch (e){
		console.log(e);
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

