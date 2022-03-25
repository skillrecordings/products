alter table "public"."purchases" alter column "stripe_id" drop not null;
alter table "public"."purchases" rename column "stripe_id" to "stripe_charge_id";
