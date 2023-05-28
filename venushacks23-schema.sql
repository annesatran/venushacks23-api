DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL,
    brand           TEXT NOT NULL,
    type            TEXT NOT NULL,
    image           TEXT NOT NULL,
    ingredients     TEXT NOT NULL,
    safety          TEXT NOT NULL,
    comedogenic     BOOLEAN NOT NULL DEFAULT FALSE,
    oily            BOOLEAN NOT NULL DEFAULT FALSE,
    dry             BOOLEAN NOT NULL DEFAULT FALSE,
    sensitive       BOOLEAN NOT NULL DEFAULT FALSE,
    acne-fighting   BOOLEAN NOT NULL DEFAULT FALSE,
    anti_aging      BOOLEAN NOT NULL DEFAULT FALSE,
    brightening     BOOLEAN NOT NULL DEFAULT FALSE,
    uv              BOOLEAN NOT NULL DEFAULT FALSE          
);