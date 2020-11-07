const {users: sql} = require('../sql');

class UsersRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    // creates table
    async create() {
        return this.db.none(sql.create);
    }

    // initializes table with mock users
    async init() {
        return this.db.map(sql.init, [], row => row.id);
    }

    // drops table
    async drop() {
        return this.db.none(sql.drop);
    }

    // empties table
    async empty() {
        return this.db.none(sql.empty);
    }

    // adds user
    // note: returns user object with id property
    async add(username, firstname, lastname, email, password) {
        return this.db.one(sql.add, [username, firstname, lastname, email, password]);
    }

    // removes a user by id and returns number of deleted rows
    async remove(id) {
        return this.db.result(sql.remove, +id, r => r.rowCount);
    }

    // finds and returns a user by id
    async findById(id) {
        return this.db.oneOrNone(sql.findById, +id);
    }

    // finds and returns a user by their login info
    // note: only the id is included in the returned user
    async findByLogin(email, password) {
        return this.db.oneOrNone(sql.findByLogin, [email, password]);
    }

    // returns all users
    async all() {
        return this.db.any(sql.all);
    }

    // returns number of users
    async total() {
        return this.db.one(sql.total, [], a => +a.count);
    }
}

module.exports = UsersRepository;