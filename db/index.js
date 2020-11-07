const Promise = require('bluebird');
const pgPromise = require('pg-promise');
const dbConfig = require('./db-config.json'); // db connection details
const {Users, Todos, Calendars, Items} = require('./repos');

const initOptions = {
    promiseLib: Promise,
    extend(obj, dc) {
        obj.users = new Users(obj, pgp);
        obj.todos = new Todos(obj, pgp);
        obj.calendars = new Calendars(obj, pgp);
        obj.items = new Items(obj, pgp);
    }
};

const pgp = pgPromise(initOptions);
const db = pgp(dbConfig);

modules.exports = {db, pgp};