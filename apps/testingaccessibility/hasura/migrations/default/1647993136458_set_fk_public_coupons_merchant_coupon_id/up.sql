alter table "public"."coupons"
  add constraint "coupons_merchant_coupon_id_fkey"
  foreign key ("merchant_coupon_id")
  references "public"."merchant_coupons"
  ("id") on update restrict on delete cascade;
