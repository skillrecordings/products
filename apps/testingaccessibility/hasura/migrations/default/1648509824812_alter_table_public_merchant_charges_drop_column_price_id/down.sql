alter table "public"."merchant_charges" alter column "price_id" drop not null;
alter table "public"."merchant_charges" add column "price_id" uuid;
