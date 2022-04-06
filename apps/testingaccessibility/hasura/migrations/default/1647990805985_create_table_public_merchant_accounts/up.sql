CREATE TABLE "public"."merchant_accounts" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "payment_processor_id" text NOT NULL, "status" integer NOT NULL DEFAULT 0, "created_at" timestamptz NOT NULL DEFAULT now(), PRIMARY KEY ("id") );
CREATE EXTENSION IF NOT EXISTS pgcrypto;
