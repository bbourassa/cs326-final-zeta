-- inserts a new User
INSERT INTO users (username, first_name, last_name, email, password)
VALUES ($1, $2, $3, $4, $5)
RETURNING id