CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username text not null,
    email text UNIQUE not null,
    password text not null
);