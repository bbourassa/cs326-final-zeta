-- inserts a new Calendar
INSERT INTO calendars (name, owner_id, personal, source_id)
VALUES (${name}, ${ownerId}, ${personal}, ${sourceId})
RETURNING id