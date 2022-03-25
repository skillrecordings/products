alter table "public"."merchant_coupons" rename column "coupon_identifier" to "identifier";
alter table "public"."merchant_coupons" alter column "identifier" set not null;
