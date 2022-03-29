alter table "public"."merchant_prices" alter column "price_id" drop not null;
alter table "public"."merchant_prices" add column "price_id" uuid;
