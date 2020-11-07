-- creates table Users
CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username text NOT NULL,
    first_name text,
    last_name text,
    email text NOT NULL,
    password text NOT NULL
    -- calendar_id integer REFERENCES calendars ON DELETE RESTRICT
)