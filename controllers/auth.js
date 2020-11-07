const {db} = require('../db');

const jwt = require('jsonwebtoken');
const jwtConfig = require('./jwt-config'); // temp

// authentication middleware

exports.signup = (req, res, next) => {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    // check if request body contains all the necessary user info
    if (username && firstname && lastname && email && password) {
        db.task('add-user', async t => {
            return t.users.add(username, firstname, lastname, email, password)
                .then(user => {
                    return t.calendars.add(username, user.id, true)
                        .then(() => {
                            res.status(201).json({
                                success: true,
                                token: generateToken({ id: user.id })
                            });
                        });
                });
        })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Request body must contain the following properties: username, firstname, lastname, email, password'
        });
    }
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
        db.users.findByLogin(email, password)
            .then(user => {
                // check if user was found
                if (user) {
                    res.status(200).json({
                        success: true,
                        token: generateToken({ id: user.id })
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Incorrect email or password'
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Request body must contain the following properties: email, password'
        });
    }
};

exports.checkToken = (req, res, next) => {
    const header = req.get('Authorization');
    const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;
    if (token) {
        jwt.verify(token, jwtConfig.secret, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid authentication token'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).json({
            success: false,
            message: 'Requires authentication'
        });
    }
};

function generateToken(payload) {
    return jwt.sign(payload, jwtConfig.secret, jwtConfig.expireTime);
}