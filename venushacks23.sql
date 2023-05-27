\echo 'Delete and recreate database?'
\prompt 'Return for yes or control-C for cancel > ' answer

DROP DATABASE venushacks223;
CREATE DATABASE venushacks34;
\connect venushacks23;

\i venushacks23-schema.sql
\i venushacks23-seed.sql