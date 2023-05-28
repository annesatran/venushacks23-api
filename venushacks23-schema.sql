DROP TABLE products
CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    brand           TEXT NOT NULL,
    type            TEXT NOT NULL,
    image           TEXT NOT NULL,
    ingredients     TEXT NOT NULL,
    safety          TEXT NOT NULL,
    oily            INTEGER NOT NULL DEFAULT 0,
    dry             INTEGER NOT NULL DEFAULT 0,
    sensitive       INTEGER NOT NULL DEFAULT 0,
    comedogenic     INTEGER NOT NULL DEFAULT 0,
    acne_fighting   INTEGER NOT NULL DEFAULT 0,
    anti_aging      INTEGER NOT NULL DEFAULT 0,
    brightening     INTEGER NOT NULL DEFAULT 0,
    uv              INTEGER NOT NULL DEFAULT 0        
)