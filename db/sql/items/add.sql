-- inserts a new Item
INSERT INTO items (name, description, type, status, all_day, start_time, end_time, dates, links, calendar_id, source_id)
VALUES (${name}, ${description}, ${type}, ${status}, ${allDay}, ${startTime}, ${endTime}, ${dates}, ${links}, ${calendarId}, ${sourceId})
RETURNING id