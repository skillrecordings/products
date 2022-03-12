SET check_function_bodies = false;
CREATE TABLE public.users (
    id text NOT NULL,
    name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    email text NOT NULL,
    image text,
    github text,
    blog text,
    company text,
    twitter text
);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
