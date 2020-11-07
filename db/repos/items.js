const {items: sql} = require('../sql');

class ItemsRepository {
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

    async all() {
        return this.db.any(sql.all);
    }

    async total() {
        return this.db.one(sql.total, [], a => +a.count);
    }
}

module.exports = ItemsRepository;