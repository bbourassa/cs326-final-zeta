-- inserts a new Todo
INSERT INTO todos (content, user_id)
VALUES ($1, $2)
RETURNING *