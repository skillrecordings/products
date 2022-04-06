alter table "public"."merchant_charges" alter column "purchase_id" drop not null;
alter table "public"."merchant_charges" add column "purchase_id" uuid;
