-- creates table Todos
CREATE TABLE todos (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    content text NOT NULL,
    user_id integer NOT NULL REFERENCES users ON DELETE CASCADE,
    archived boolean NOT NULL DEFAULT FALSE,
    archived_at timestamptz
)