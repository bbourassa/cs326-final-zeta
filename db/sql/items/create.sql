-- creates table Items and associated types
CREATE TYPE item_type AS ENUM ('event', 'action');
CREATE TYPE item_status AS ENUM ('not started', 'in progress', 'completed');
CREATE TABLE items (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    description text,
    type item_type NOT NULL,
    status item_status NOT NULL DEFAULT 'not started',
    all_day boolean NOT NULL DEFAULT FALSE,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    dates date[],
    links text,
    calendar_id integer NOT NULL REFERENCES calendars ON DELETE CASCADE,
    source_id integer REFERENCES items ON DELETE SET NULL
);