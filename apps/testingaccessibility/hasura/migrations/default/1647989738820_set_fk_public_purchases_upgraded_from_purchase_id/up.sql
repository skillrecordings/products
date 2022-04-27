alter table "public"."purchases"
  add constraint "purchases_upgraded_from_purchase_id_fkey"
  foreign key ("upgraded_from_purchase_id")
  references "public"."purchases"
  ("id") on update restrict on delete set null;
