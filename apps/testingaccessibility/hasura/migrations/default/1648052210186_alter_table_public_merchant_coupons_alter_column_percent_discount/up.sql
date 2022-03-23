alter table "public"."merchant_coupons" alter column "percent_discount" set not null;
alter table "public"."merchant_coupons" rename column "percent_discount" to "percentage_discount";
