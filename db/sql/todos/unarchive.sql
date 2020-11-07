-- unarchives a Todo by setting archived to false and archived_at to null
UPDATE todos SET archived = FALSE, archived_at = NULL
WHERE id = $1 AND user_id = $2
RETURNING *