alter table "public"."merchant_prices"
  add constraint "merchant_prices_price_id_fkey"
  foreign key ("price_id")
  references "public"."prices"
  ("id") on update restrict on delete cascade;
