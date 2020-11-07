const {db} = require('../db');

// handler functions for todo data

exports.create = () => db.todos.create();  // creates table
exports.drop = () => db.todos.drop();  // drops table
exports.empty = () => db.todos.empty();  // empties table
exports.all = () => db.todos.all();  // returns all data from table
exports.total = () => db.todos.total();  // returns number of rows

// finds and returns all todos belonging to the authenticated user
exports.list = (req, res, next) => {
    db.todos.findList(req.decoded.id)
        .then(list => {
            res.status(200).json({
                success: true,
                data: list
            });
        })
        .catch(err => {
            next(err);
        });
};

// adds a todo item to the user's todo list
exports.add = (req, res, next) => {
    if (req.body.content) {
        db.todos.add(req.body.content, req.decoded.id)
            .then(todo => {
                res.status(200).json({
                    success: true,
                    data: todo
                });
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Request body must contain the following properties: content'
        });
    }
};

// find todo by id
exports.find = (req, res, next) => {
    const id = +req.params.todo;
    if (id) {
        db.todos.find(id, req.decoded.id)
            .then(todo => {
                if (todo) {
                    res.status(200).json({
                        success: true,
                        data: todo
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Cannot find todo ${id} in user's todo list`
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid todo ID'
        });
    }
};

// edits todo
exports.edit = (req, res, next) => {
    const id = +req.params.todo;
    const content = req.body.content;
    if (!id) {
        res.status(400).json({
            success: false,
            message: 'Invalid todo ID'
        });
    } else if (!content) {
        res.status(400).json({
            success: false,
            message: 'Request body must contain the following properties: content'
        });
    } else {
        db.todos.edit(content, id, req.decoded.id)
            .then(todo => {
                if (todo) {
                    res.status(200).json({
                        success: true,
                        data: todo
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Cannot find todo ${id} in user's todo list`
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    }
};

// deletes the specified todo from the user's list
exports.remove = (req, res, next) => {
    const id = +req.params.todo;
    if (id) {
        db.todos.remove(id, req.decoded.id)
            .then(count => {
                if (count) {
                    res.status(200).json({
                        success: true,
                        message: `Deleted todo ${id}`
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Cannot find todo ${id} in user's todo list`
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid todo ID'
        });
    }
};

// archives todo
exports.archive = (req, res, next) => {
    const id = +req.params.todo;
    if (id) {
        db.todos.archive(id, req.decoded.id)
            .then(todo => {
                if (todo) {
                    res.status(200).json({
                        success: true,
                        data: todo
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Cannot find todo ${id} in user's todo list`
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid todo ID'
        });
    }
};

// unarchives todo
exports.unarchive = (req, res, next) => {
    const id = +req.params.todo;
    if (id) {
        db.todos.unarchive(id, req.decoded.id)
            .then(todo => {
                if (todo) {
                    res.status(200).json({
                        success: true,
                        data: todo
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: `Cannot find todo ${id} in user's todo list`
                    });
                }
            })
            .catch(err => {
                next(err);
            });
    } else {
        res.status(400).json({
            success: false,
            message: 'Invalid todo ID'
        });
    }
};