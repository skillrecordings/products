alter table "public"."purchases"
  add constraint "purchases_merchant_charge_id_fkey"
  foreign key ("merchant_charge_id")
  references "public"."merchant_charges"
  ("id") on update restrict on delete cascade;
