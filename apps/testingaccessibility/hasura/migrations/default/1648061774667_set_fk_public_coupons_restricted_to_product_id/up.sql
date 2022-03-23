alter table "public"."coupons"
  add constraint "coupons_restricted_to_product_id_fkey"
  foreign key ("restricted_to_product_id")
  references "public"."products"
  ("id") on update restrict on delete cascade;
