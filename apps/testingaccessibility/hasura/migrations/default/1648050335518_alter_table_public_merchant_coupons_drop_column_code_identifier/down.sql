alter table "public"."merchant_coupons" alter column "code_identifier" drop not null;
alter table "public"."merchant_coupons" add column "code_identifier" text;
