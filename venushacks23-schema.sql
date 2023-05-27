
CREATE TABLE products (
    id           SERIAL PRIMARY KEY,
    name         TEXT NOT NULL,
    brand        TEXT NOT NULL,
    type         TEXT NOT NULL,
    image        TEXT NOT NULL,
    ingredients  TEXT NOT NULL
);

CREATE TABLE ingredients (
    id              SERIAL PRIMARY KEY,
    name            TEXT NOT NULL UNIQUE,
    safety          INTEGER NOT NULL CHECK (safety BETWEEN 1 and 10),
    comedogenic     INTEGER NOT NULL CHECK (comedogenic BETWEEN 1 and 5),
    acne_fighting   BOOLEAN NOT NULL DEFAULT FALSE,
    anti_aging      BOOLEAN NOT NULL DEFAULT FALSE,
    brightening     BOOLEAN NOT NULL DEFAULT FALSE,
    oily            BOOLEAN NOT NULL DEFAULT FALSE,
    dry             BOOLEAN NOT NULL DEFAULT FALSE,
    sensitive       BOOLEAN NOT NULL DEFAULT FALSE
)