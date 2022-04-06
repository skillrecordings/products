alter table "public"."merchant_charges"
  add constraint "merchant_charges_merchant_price_id_fkey"
  foreign key ("merchant_price_id")
  references "public"."prices"
  ("id") on update restrict on delete cascade;
