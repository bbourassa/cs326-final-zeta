-- deletes Todo that has the given id and user id
DELETE FROM todos WHERE id = $1 AND user_id = $2