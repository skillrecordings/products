INSERT INTO Product (id, name, productType, status) VALUES
('tt_product_7a0524b6-1edb-4588-9484-743dd7bb95c4', 'TypeScript Pro Essentials', 'self-paced',1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_price_a805bc8b-b0a1-4e53-8653-696be7a6b549', 'tt_product_7a0524b6-1edb-4588-9484-743dd7bb95c4', 'TypeScript Pro Essentials', 1, 250);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) 
VALUES ('tt_merchant_product_137e3deb-20bd-4879-bbce-ded76a679f70', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_product_7a0524b6-1edb-4588-9484-743dd7bb95c4', 1, 'prod_PtXc4OPWrQgjgM');

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_merchant_price_52b11009-41c6-4123-84b8-07386096d7fd', 'tt_merchant_product_137e3deb-20bd-4879-bbce-ded76a679f70', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_price_a805bc8b-b0a1-4e53-8653-696be7a6b549', 'price_1P3kXdAozSgJZBRPclm4z8GB');
