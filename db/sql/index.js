const {QueryFile} = require('pg-promise');
const {join: joinPath} = require('path');

module.exports = {
    calendars: {
        create: sql('calendars/create.sql'),
        empty: sql('calendars/empty.sql'),
        drop: sql('calendars/drop.sql'),
        // find: sql('calendars/find.sql'),
        add: sql('calendars/add.sql')
    },
    items: {
        create: sql('items/create.sql'),
        empty: sql('items/empty.sql'),
        drop: sql('items/drop.sql'),
        // find: sql('items/find.sql'),
        add: sql('items/add.sql')
    },
    todos: {
        add: sql('todos/add.sql'),
        all: sql('todos/all.sql'),
        archive: sql('todos/archive.sql'),
        create: sql('todos/create.sql'),
        drop: sql('todos/drop.sql'),
        edit: sql('todos/edit.sql'),
        empty: sql('todos/empty.sql'),
        find: sql('todos/find.sql'),
        findList: sql('todos/findList.sql'),
        remove: sql('todos/remove.sql'),
        total: sql('todos/total.sql'),
        unarchive: sql('todos/unarchive.sql')
    },
    users: {
        add: sql('users/add.sql'),
        all: sql('users/all.sql'),
        create: sql('users/create.sql'),
        drop: sql('users/drop.sql'),
        empty: sql('users/empty.sql'),
        findById: sql('users/findById.sql'),
        findByLogin: sql('users/findByLogin.sql'),
        init: sql('users/init.sql'),
        remove: sql('users/remove.sql'),
        total: sql('users/total.sql')
    }
};

function sql(file) {
    const fullPath = joinPath(__dirname, file);
    const options = { minify: true };
    const qf = new QueryFile(fullPath, options);
    if (qf.error) {
        console.error(qf.error);
    }
    return qf;
}