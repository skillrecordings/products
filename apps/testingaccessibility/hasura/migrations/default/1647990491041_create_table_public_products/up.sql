CREATE TABLE "public"."products" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "name" text, "key" text, "created_at" timestamptz NOT NULL DEFAULT now(), "status" integer NOT NULL DEFAULT 0, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
