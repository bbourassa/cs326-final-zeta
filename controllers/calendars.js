const {db} = require('../db');

// handler functions for calendar data

exports.create = () => db.calendars.create();  // creates table
exports.init = () => db.calendars.init();  // initializes with mock personal calendars
exports.drop = () => db.calendars.drop();  // drops table
exports.empty = () => db.calendars.empty();  // empties table
exports.all = () => db.calendars.all();  // returns all data from table
exports.total = () => db.calendars.total();  // returns number of calendars
