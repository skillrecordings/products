alter table "public"."purchases" alter column "price" drop not null;
alter table "public"."purchases" add column "price" numeric;
