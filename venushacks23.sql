-- \drop postgres;
-- \create postgres;
\connect postgres;

\i 'venushacks23-schema.sql'
\i 'venushacks23-seed.sql'

SELECT CURRENT_TIME;