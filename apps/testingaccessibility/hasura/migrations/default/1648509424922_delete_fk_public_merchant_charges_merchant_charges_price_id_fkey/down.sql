alter table "public"."merchant_charges"
  add constraint "merchant_charges_price_id_fkey"
  foreign key ("price_id")
  references "public"."merchant_prices"
  ("id") on update restrict on delete cascade;
