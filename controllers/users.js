const {db} = require('../db');

// handler functions for user data
// also see auth.js, which includes user signup and login

exports.create = () => db.users.create();  // creates table
exports.init = () => db.users.init();  // initializes with mock users
exports.drop = () => db.users.drop();  // drops table
exports.empty = () => db.users.empty();  // empties table
exports.all = () => db.users.all();  // returns all data from table
exports.total = () => db.users.total();  // returns number of users

// removes the authenticated user
exports.remove = (req, res, next) => {
    db.users.remove(req.decoded.id)
        .then(count => {
            if (count) {
                res.status(200).json({
                    success: true,
                    message: `Deleted user ${req.decoded.id}`
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: `Cannot find user ${req.decoded.id}`
                });
            }
        })
        .catch(err => {
            next(err);
        });
};

// finds and returns the authenticated user
exports.find = (req, res, next) => {
    db.users.findById(req.decoded.id)
        .then(user => {
            if (user) {
                res.status(200).json({
                    success: true,
                    data: user
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: `Cannot find user ${req.decoded.id}`
                });
            }
        })
        .catch(err => {
            next(err);
        });
};

// possible additions:
//  - update name, username, email?