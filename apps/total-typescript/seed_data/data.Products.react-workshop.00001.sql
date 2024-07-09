-- React Standalone Workshop

INSERT INTO Product (id, name, status) VALUES
('tt_product_ba3b1b80-419b-4e62-a016-5f9add17c411', 'Advanced React', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_merchant_product_14164b6b-3701-4a6f-9276-95006eaecdf7', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_product_ba3b1b80-419b-4e62-a016-5f9add17c411', 1, 'prod_OFeL2XyQ5xnGxa');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_price_f587d289-c336-4171-81cb-5edc5c5373ef', 'tt_product_ba3b1b80-419b-4e62-a016-5f9add17c411', 'Advanced React', 1, 250);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_merchant_price_94595555-da26-4829-8878-ea4563376cbd', 'tt_merchant_product_14164b6b-3701-4a6f-9276-95006eaecdf7', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_price_f587d289-c336-4171-81cb-5edc5c5373ef', 'price_1NT92qAozSgJZBRP8O4sT2Cc');

-- React Bundle

INSERT INTO Product (id, name, status) VALUES
('tt_product_79434686-6437-48ac-956e-1357aba87672', 'Core Volume React Bundle', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_merchant_product_5d6a33cf-9780-4a07-a4f7-ea95d69a8cab', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_product_79434686-6437-48ac-956e-1357aba87672', 1, 'prod_OFeZUeZtu2hxN3');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_price_21e98913-32fa-4150-9c65-ad4c6fc5dbeb', 'tt_product_79434686-6437-48ac-956e-1357aba87672', 'Core Volume React Bundle', 1, 790);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_merchant_price_5a01cbbe-f0a9-4bda-adbb-80122abff505', 'tt_merchant_product_5d6a33cf-9780-4a07-a4f7-ea95d69a8cab', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_price_21e98913-32fa-4150-9c65-ad4c6fc5dbeb', 'price_1NViIsAozSgJZBRPWXXULskq');
