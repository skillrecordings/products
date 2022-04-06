alter table "public"."merchant_charges"
  add constraint "merchant_charges_user_id_fkey"
  foreign key ("user_id")
  references "public"."users"
  ("id") on update restrict on delete cascade;
