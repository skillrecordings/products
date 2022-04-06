alter table "public"."purchases" alter column "stripe_charge_id" drop not null;
alter table "public"."purchases" add column "stripe_charge_id" text;
