-- creates table Calendars
CREATE TABLE calendars (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    owner_id integer NOT NULL REFERENCES users ON DELETE CASCADE,
    personal boolean NOT NULL DEFAULT FALSE,
    source_id integer REFERENCES calendars ON DELETE SET NULL
)