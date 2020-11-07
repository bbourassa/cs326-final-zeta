-- inserts a few mock users into the database
INSERT INTO users (username, first_name, last_name, email, password) VALUES
    ('LifeOnTrack', '', '', 'lifeontrack@example.org', 'password'),
    ('jane', 'Jane', 'Doe', 'jdoe@example.org', 'janepassword'),
    ('john_smith', 'John', 'Smith', 'jsmith@example.org', 'johnpassword'),
    ('user3', 'Some', 'Body', 'sbody3@example.org', 'somepassword')
RETURNING id