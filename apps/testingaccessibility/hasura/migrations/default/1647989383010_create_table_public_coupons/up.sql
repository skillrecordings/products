CREATE TABLE "public"."coupons" ("id" uuid NOT NULL DEFAULT gen_random_uuid(), "code" text NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "expires_at" timestamptz, "max_uses" integer NOT NULL DEFAULT -1, "default" boolean NOT NULL DEFAULT false, "stripe_coupon_id" text, "stripe_promotion_code_id" text, PRIMARY KEY ("id") , UNIQUE ("id"));
CREATE EXTENSION IF NOT EXISTS pgcrypto;
