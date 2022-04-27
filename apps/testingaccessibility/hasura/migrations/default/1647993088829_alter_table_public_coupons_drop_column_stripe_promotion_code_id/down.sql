alter table "public"."coupons" alter column "stripe_promotion_code_id" drop not null;
alter table "public"."coupons" add column "stripe_promotion_code_id" text;
