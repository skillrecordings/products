alter table "public"."merchant_charges" alter column "merchant_price_id" drop not null;
alter table "public"."merchant_charges" add column "merchant_price_id" uuid;
