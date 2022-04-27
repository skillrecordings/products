alter table "public"."merchant_coupons" rename column "percentage_discount" to "percent_discount";
alter table "public"."merchant_coupons" alter column "percent_discount" drop not null;
