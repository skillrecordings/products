alter table "public"."merchant_charges"
  add constraint "merchant_charges_merchant_customer_id_fkey"
  foreign key ("merchant_customer_id")
  references "public"."merchant_customers"
  ("id") on update restrict on delete cascade;
