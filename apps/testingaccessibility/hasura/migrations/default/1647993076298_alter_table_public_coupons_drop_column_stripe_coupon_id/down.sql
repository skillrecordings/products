alter table "public"."coupons" alter column "stripe_coupon_id" drop not null;
alter table "public"."coupons" add column "stripe_coupon_id" text;
