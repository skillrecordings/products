alter table "public"."purchases"
  add constraint "purchases_product_id_fkey"
  foreign key ("product_id")
  references "public"."products"
  ("id") on update restrict on delete cascade;
