'use strict';

const db = require('../app.js').db;

db.none('CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY, owner_id INT, subscriber_id INT, content VARCHAR);');

exports.create = async function(req, res) {
    res.sendStatus(201);
    let lastId = await db.any('SELECT MAX(id) FROM public."notifications";');
    let newId = lastId[0].max + 1;
    let ownerId = req.params.user;
    let subId = req.params.sub;
    let content = req.body.content;
    console.log('newId', newId, 'content', content);
    db.none('INSERT INTO public."notifications"(id, owner_id, subscriber_id, content) VALUES($1, $2, $3, $4);', [newId, ownerId, subId, content]);
}