alter table "public"."purchases" rename column "stripe_charge_id" to "stripe_id";
alter table "public"."purchases" alter column "stripe_id" set not null;
