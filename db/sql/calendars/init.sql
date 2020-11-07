-- inserts personal calendars for all mock users
INSERT INTO calendars (name, owner_id, personal)
SELECT username, id, 'true'
FROM users