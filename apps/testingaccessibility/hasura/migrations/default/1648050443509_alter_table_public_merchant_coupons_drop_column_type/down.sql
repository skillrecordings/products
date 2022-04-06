alter table "public"."merchant_coupons" alter column "type" drop not null;
alter table "public"."merchant_coupons" add column "type" text;
