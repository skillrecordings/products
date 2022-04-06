alter table "public"."merchant_charges"
  add constraint "merchant_charges_purchase_id_fkey"
  foreign key ("purchase_id")
  references "public"."purchases"
  ("id") on update restrict on delete cascade;
