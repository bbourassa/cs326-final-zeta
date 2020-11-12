'use strict';
//holds first draft at authentication protocals

// For loading environment variables.
require('dotenv').config(); //Should be as high up as possible-- does the .env stuff

const express = require('express');                 // express routing
const expressSession = require('express-session');  // for managing session state
const passport = require('passport');               // handles authentication
const LocalStrategy = require('passport-local').Strategy; // username/password strategy
const app = express();
const port = process.env.PORT || 3000;


import postgres from 'pg-promise';

const pgp = postgres();
const cn = process.env.DATABASE_URL;

// Creating a new database instance from the connection details:
const db = pgp(cn);


//session configuration
const session = {
	secret: process.env.SECRET ||  'SECRET',  //will need to remove hard coded secret
	resave:false,
	saveUninitialized : false
};

//configure passport
const strategy = new LocalStrategy(
	async(username, password, done) => {
		if(!findUser(username)){
			return done(null, false, { 'message': 'Wrong username or password'});
		}
		if(!validatePassword(username, password)){
			//creates a 2 sec delay between failed attempts
			await new Promise((r) => setTimeout(r, 2000)); 
			return done(null, false, {'message':'Wrong username or password'});
		}
		//create a user object, associated w/ user_id
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

//Produces a user identifier; puts it in req.session.passport.user = {id:''
//ONLY saves the ID, not the user's personal cal id or anything else
passport.serializeUseer((user, done) => {
	done(null, user);
});
//TODO somewhere in here, need to link up user data w/ user object
//take that identifier, make it into the user object
passport.deserializeUser((user_id, done) =>{
	done(null, user_id);
});


app.use(express.json()); // allow JSON inputs
app.use(express.urlencoded({'extended' : true})); // allow URLencoded data

// '/api/users/:user'
//Not sure if the defining of findUser goes here or in the user api
//if user is in the database
//            await db.none('INSERT INTO wordScores(name, word, score) VALUES($1,$2, $3);', [data.name, data.word, data.score ]);

async function checkCreds(username, pwd){
	//check for user; .catch will catch any errors, no need for try/catch
	//if there is nothing matching there, returns false
	const userI = await db.none('SELECT * FROM userDB WHERE user_id = $1', [username]).catch((err) => { return false; });
	const user_INFO = userI.json();
	if(user_INFO.password !== pwd){
		return false;
	}
	return true;
}


function checkLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		//if you are logged/ authenticated, run next route
		next();
	} else {
		//otherwise, redirect to login
		res.redirect('../html/index.html');
	}
}

app.get('/', 
	checkLoggedIn,
	(req, res) => {
		res.redirect('../html/personalcal.html');
	});