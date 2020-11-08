'use strict';

// fake item database

const fs = require('fs');
const path = require('path');
const sizes = require('./fakeSizes');
const faker = require('faker');
faker.seed(640);
const refDate = new Date(2020, 10, 1);
const filename = path.resolve(__dirname, './ours/ouritems.json');

const items = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : [];

for (let i = 0; i < sizes.items; ++i) {
    const name = faker.lorem.words(),
        type = faker.random.boolean() ? 'event' : 'action',
        all_day = faker.random.boolean(),
        start = faker.random.boolean() ? faker.date.recent(30, refDate) : faker.date.soon(30, refDate),
        end = (all_day || type === 'action') ? null : faker.date.soon(.2, start),
        desc = faker.lorem.sentence(),
        cal = faker.random.number(sizes.cals - 1),
        cal_title = faker.lorem.words(),
        rel_links = faker.lorem.sentence();

    if (all_day) {
        start.setHours(0, 0, 0);
    }

    let status = '';
    switch (faker.random.number(2)) {
        case 0:
            status = 'not started';
            break;
        case 1:
            status = 'in progress';
            break;
        case 2:
            status = 'completed';
    }

    items.push({
        id: i,
        name: name,
        type: type,
        all_day: all_day,
        start: start,
        end: end,
        description: desc,
        status: status,
        calendar_id: cal,
        calendar_title: cal_title,
        related_links: rel_links,
    });
}

exports.listAll = function(req, res) {
    res.json(items);
};

exports.list = function(req, res) {
    console.log(req);
    let result = items.filter(item => item.calendar_id === req.cal.id);
    //console.log(result);
    const values = Object.values(req.query);
    if (values.length === 0) {
        res.json(result);
    } else if (values.every(v => typeof v === 'string')) {
        const y = req.query.year ? parseInt(req.query.year, 10) : NaN;
        let m = req.query.month ? parseInt(req.query.month, 10) : NaN;
        if (isNaN(y) || isNaN(m)) {
            res.sendStatus(400);
        } else {
            m -= 1;
            const inYear = item => item.start.getFullYear() === y || (item.end && item.end.getFullYear() === y);
            const inMonth = item => item.start.getMonth() === m || (item.end && item.end.getMonth() === m);

            result = result.filter(item => inYear(item) && inMonth(item));

            const d = req.query.day ? parseInt(req.query.day, 10) : NaN;
            if (!isNaN(d)) {
                const inDay = item => item.start.getDate() === d || (item.end && item.end.getDate() === d);
                result = result.filter(item => inDay(item));
            }
            res.json(result);
        }
    } else {
        res.sendStatus(400);
    }
};

exports.create = function(req, res) {
    res.sendStatus(201);
};

exports.find = function(req, res) {
    const id = parseInt(req.params.item, 10);
    if (items[id] && items[id].calendar_id === req.cal.id) {
        res.json(items[id]);
    } else {
        res.status(404).send('Item Not Found');
    }
};

exports.edit = function(req, res) {
    res.sendStatus(204);
};

exports.remove = function(req, res) {
    res.sendStatus(204);
};

exports.listSubscribed = function(req, res) {
    res.json(req.cals.map(cal => {
        const itemList = items.filter(item => item.calendar_id === cal.id);
        const obj = {
            id: cal.id,
            name: cal.name,
            owner: cal.owner_id,
            items: itemList
        };
        return obj;
    }));
};