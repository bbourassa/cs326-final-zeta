const {calendars: sql} = require('../sql');

class CalendarsRepository {
    constructor(db, pgp) {
        this.db = db;
        this.pgp = pgp;
    }

    async create() {
        return this.db.none(sql.create);
    }

    async drop() {
        return this.db.none(sql.drop);
    }

    async empty() {
        return this.db.none(sql.empty);
    }

    async add(name, ownerId, personal, sourceId = null) {
        return this.db.one(sql.add, { name, ownerId, personal, sourceId });
    }

    async remove(id) {
        return this.db.result(sql.remove, +id, r => r.rowCount);
    }

    async find(id) {
        return this.db.oneOrNone(sql.find, +id);
    }

    async all() {
        return this.db.any(sql.all);
    }

    async total() {
        return this.db.one(sql.total, [], a => +a.count);
    }
}