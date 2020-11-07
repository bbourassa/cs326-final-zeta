const {todos: sql} = require('../sql');

class TodosRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    // creates table
    async create() {
        return this.db.none(sql.create);
    }

    // drops table
    async drop() {
        return this.db.none(sql.drop);
    }

    // empties table
    async empty() {
        return this.db.none(sql.empty);
    }

    // adds todo to user's list
    async add(content, userId) {
        return this.db.one(sql.add, [content, +userId]);
    }

    // removes specified todo and returns number of deleted rows
    async remove(id, userId) {
        return this.db.result(sql.remove, [+id, +userId], r => r.rowCount);
    }

    // returns user's todo list
    async findList(userId) {
        return this.db.any(sql.findList, +userId);
    }

    // returns specified todo
    async find(id, userId) {
        return this.db.oneOrNone(sql.find, [+id, +userId]);
    }

    // edits todo content and returns updated todo
    async edit(content, id, userId) {
        return this.db.oneOrNone(sql.edit, [content, +id, +userId]);
    }

    // archives todo and returns updated todo
    async archive(id, userId) {
        return this.db.oneOrNone(sql.archive, [+id, +userId]);
    }

    // unarchives todo and returns updated todo
    async unarchive(id, userId) {
        return this.db.oneOrNone(sql.unarchive, [+id, +userId]);
    }

    // returns all todos
    async all() {
        return this.db.any(sql.all);
    }

    // returns number of todos
    async total() {
        return this.db.one(sql.total, [], a => +a.count);
    }
}

modules.exports = TodosRepository;