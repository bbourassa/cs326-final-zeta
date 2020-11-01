'use strict';

// this script is used to generate ourcals.json, oursubs.json, and ouritems.json

const fs = require('fs');
const path = require('path');

const sizes = require('../fakeSizes');
const faker = require('faker');
faker.seed(222);

const ourcals = [];
const oursubs = [];
const ouritems = [];

ourcals.push({
    id: sizes.cals,
    name: 'Song of the Day',
    owner_id: 0,
    personal: false,
    description: 'Add this calendar to your subscriptions to get a new song recommendation every day for one month'
});
ourcals.push({
    id: sizes.cals + 1,
    name: 'Daily Mantras',
    owner_id: 0,
    personal: false,
    description: 'Add this calendar to your subscriptons to get a daily mantra every day for a month'
});
ourcals.push({
    id: sizes.cals + 2,
    name: 'Daily Updates',
    owner_id: 0,
    personal: false,
    description: 'Get notified about current events for the next month by adding this calendar to your subscriptions'
});
ourcals.push({
    id: sizes.cals + 3,
    name: 'Daily Podcasts',
    owner_id: 0,
    personal: false,
    description: 'Get daily recommendations for the next month about interesting podcasts by adding this calendar to your subscriptions'
});

for (let i = 0; i < 4; ++i) {
    const cal_id = sizes.cals + i;
    const sub_id = sizes.subs + i;
    oursubs.push({
        id: sub_id,
        user_id: 0,
        calendar_id: cal_id
    });
}

for (let i = 0; i < 4; ++i) {
    const cal_id = sizes.cals + i;
    let day = 1;
    for (let j = sizes.items; j < sizes.items + 30; ++j) {
        const date = new Date(2020, 10, day);
        ouritems.push({
            id: 30 * i + j,
            name: faker.lorem.words(),
            type: 'action',
            all_day: true,
            start: date,
            end: null,
            description: faker.lorem.sentence(),
            status: 'not started',
            calendar_id: cal_id
        });
        ++day;
    }
}

fs.writeFileSync(path.join(__dirname, 'ourcals.json'), JSON.stringify(ourcals, null, '\t'), err => {
    if (err) throw err;
});

fs.writeFileSync(path.join(__dirname, 'oursubs.json'), JSON.stringify(oursubs, null, '\t'), err => {
    if (err) throw err;
});

fs.writeFileSync(path.join(__dirname, 'ouritems.json'), JSON.stringify(ouritems, null, '\t'), err => {
    if (err) throw err;
});
