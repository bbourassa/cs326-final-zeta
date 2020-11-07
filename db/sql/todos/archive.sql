-- archives a Todo by setting archived to true and archived_at to the current time
UPDATE todos SET archived = TRUE, archived_at = NOW()
WHERE id = $1 AND user_id = $2
RETURNING *