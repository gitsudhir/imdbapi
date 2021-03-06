-- This script was generated by a beta version of the ERD tool in pgAdmin 4.
-- Please log an issue at https://redmine.postgresql.org/projects/pgadmin4/issues/new if you find any bugs, including reproduction steps.
BEGIN;


CREATE TABLE IF NOT EXISTS public.movie
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name text COLLATE pg_catalog."default",
    details text COLLATE pg_catalog."default",
    upvote integer,
    downvote integer,
    release_date date,
    image bytea,
    image_url text COLLATE pg_catalog."default",
    CONSTRAINT movie_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.movie_genre
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    title text COLLATE pg_catalog."default",
    CONSTRAINT movie_genre_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.movie_genre_map
(
    movie_id integer,
    genre_id integer
);

CREATE TABLE IF NOT EXISTS public.movie_reviews
(
    movie_id integer,
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    review text COLLATE pg_catalog."default",
    CONSTRAINT movie_reviews_pkey PRIMARY KEY (id)
);

ALTER TABLE IF EXISTS public.movie_genre_map
    ADD CONSTRAINT movie_genre_map_genre_id_fkey FOREIGN KEY (genre_id)
    REFERENCES public.movie_genre (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movie_genre_map
    ADD CONSTRAINT movie_genre_map_movie_id_fkey FOREIGN KEY (movie_id)
    REFERENCES public.movie (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.movie_reviews
    ADD CONSTRAINT movie_reviews_movie_id_fkey FOREIGN KEY (movie_id)
    REFERENCES public.movie (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;

END;