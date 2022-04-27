alter table "public"."merchant_coupons" alter column "identifier" drop not null;
alter table "public"."merchant_coupons" rename column "identifier" to "coupon_identifier";
