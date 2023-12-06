INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 1, "acct_1HzmnqIugVgg5liQ", "stripe");

INSERT INTO Product (id, name, status) VALUES
('kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', "Testing JavaScript Pro", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_47479d9f-10a0-4725-a6ee-5eac6299067a', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', 1, "prod_NJvuoglTLIYE60");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_0a823046-d7d0-43d1-a39d-896cd76baff2', 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', 'Testing JavaScript Pro', 1, 332);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_99c9b532-6f12-4662-a93e-ac69bea7306a', 'kcd_47479d9f-10a0-4725-a6ee-5eac6299067a', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_0a823046-d7d0-43d1-a39d-896cd76baff2", "price_1MZI37IugVgg5liQOBPzPBQv");

INSERT INTO Product (id, name, status) VALUES
('kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', "Testing JavaScript Standard", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_85b2ceb9-6b6b-4545-af1e-826fd5bacfd2', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', 1, "prod_NJvuQnX13D2e7n");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_4a502214-ae2b-4256-a575-789fc82d8c7b', 'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', 'Testing JavaScript Standard', 1, 136);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_9c47a9ff-8d04-4649-bece-e69c93dbc6cc', 'kcd_85b2ceb9-6b6b-4545-af1e-826fd5bacfd2', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_4a502214-ae2b-4256-a575-789fc82d8c7b", "price_1MZI37IugVgg5liQVGX0IspL");

INSERT INTO Product (id, name, status) VALUES
('kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', "Testing JavaScript Basic", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_34e6140e-77e1-46ca-95f9-ef96a096aa9e', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', 1, "prod_NJvur3aADf36J8");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_1a194e9c-9eff-430e-a295-531d38ed6086', 'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', 'Testing JavaScript Basic', 1, 67);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_29062dfd-818e-4f55-a2d5-905ea1407a42', 'kcd_34e6140e-77e1-46ca-95f9-ef96a096aa9e', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_1a194e9c-9eff-430e-a295-531d38ed6086", "price_1MZI36IugVgg5liQd7hJqnfD");

INSERT INTO Product (id, name, status) VALUES
('kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', "Epic React Pro", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_754b9122-5f02-4789-ad66-fe792eef1b5c', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', 1, "prod_NJvu5JtYQvqHdc");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_3bd9544d-9ed0-4dae-97d5-118e51ca6df5', 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', 'Epic React Pro', 1, 599);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_9d63d7fe-6620-4df8-963e-5ee8db317e6f', 'kcd_754b9122-5f02-4789-ad66-fe792eef1b5c', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_3bd9544d-9ed0-4dae-97d5-118e51ca6df5", "price_1MZI36IugVgg5liQ8H51fLQO");

INSERT INTO Product (id, name, status) VALUES
('kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', "Epic React Standard", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_a427eaf5-2abe-43af-a5ac-14884fc76f0e', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', 1, "prod_NJvu44Xno5stmu");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_af23cd3e-a6f9-4b6f-9785-a973f81c9008', 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', 'Epic React Standard', 1, 264);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_c19d9c1a-14b6-4e31-b8b4-cbfce4054de6', 'kcd_a427eaf5-2abe-43af-a5ac-14884fc76f0e', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_af23cd3e-a6f9-4b6f-9785-a973f81c9008", "price_1MZI36IugVgg5liQ4SSj94a0");

INSERT INTO Product (id, name, status) VALUES
('kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', "Epic React Basic", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_8082cc16-de5a-4646-af70-1a609273818d', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', 1, "prod_NJvu9ruwFuWsPE");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_0234be80-b95f-4418-8420-b6a2a6839d3d', 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', 'Epic React Basic', 1, 119);



INSERT INTO Product (id, name, status) VALUES
('kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b', "Full-Stack Workshop Series Vol 1", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_9ea5d6d2-57f9-43c1-b4d2-07f1693b464f', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b', 1, "prod_O7TG5fydlJVgna");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_c58128e5-0b93-4640-a0b4-a4bb73d9b0ec', 'kcd_product-f000186d-78c2-4b02-a763-85b2e5feec7b', 'Full-Stack Workshop Series Vol 1', 1, 1999);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_03412634-4ea0-4588-bb5d-eb72e23f63d7', 'kcd_merchant_product_9ea5d6d2-57f9-43c1-b4d2-07f1693b464f', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_price_c58128e5-0b93-4640-a0b4-a4bb73d9b0ec", "price_1NLEKNIugVgg5liQDAI8BlJ0");



INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_39db1207-07c1-469c-9851-f237ab3abe00', 'kcd_8082cc16-de5a-4646-af70-1a609273818d', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_0234be80-b95f-4418-8420-b6a2a6839d3d", "price_1MZI35IugVgg5liQ1YoDFak5");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_98808709-9950-4b58-ac9b-84efacd51303', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'pJ1sKDgx', '0.45', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_29baf5f1-5c7a-4add-86a6-b746977f69ea', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'm6kI6Gj8', '0.35', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_42ecf67b-8ce6-4eaf-b04e-edb343a0b10f', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'sO1TbQ8Z', '0.25', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_ed9e673c-5ad9-4099-bf9d-d62b87b7b718', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'am5iYCNv', '0.15', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_22cfe37c-219f-4e20-afc3-928e0adf26b1', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'vPZ42Evy', '0.1', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_2c70bcbe-e4ee-43b7-a739-b76030a62043', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'Oq3qZcss', '0.05', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_a30924b6-86d0-46bd-8cb2-c69bfcd2f088', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, '1tBcEV19', '0.95', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_65dcabd9-17bb-4661-9855-8c3bfb35e724', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'zRgQ1pGG', '0.9', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_f442fec7-0b56-4b7d-8ce2-eb7a31ee3a89', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'FmFfTJJW', '0.75', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_24a786a0-3bd1-4137-9756-6c56b8e64ec3', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'RzZP6MbL', '0.6', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_75e339f7-46d6-4a00-851e-c85529daea00', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'ZvOtKEkH', '0.5', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_9ae594f1-6de3-4f08-a58f-0ad991b0d51c', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'w6mqZqjq', '0.4', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_1bcc4ae9-6184-4696-ba09-3150174ad12a', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'bk1Dj5rz', '0.25', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_1e9eba36-0bd5-41e8-927e-1daac48bdc5b', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'uyIacivZ', '0.1', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_55c24acf-02cd-4e59-ab14-69ca522d785b', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, '2PKXtR4N', '0.75', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_32c0bd91-6edc-450a-8205-bccd49788fa1', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'Kc3I4BbF', '0.7', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_8c0e64f6-0082-4775-a161-96b6e5732696', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'VEAnwDn2', '0.65', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_84b75f45-7567-4b00-b7dc-4ac0e8c22280', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'usp1LL5u', '0.6', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_60cbe3f4-24ae-41bc-a813-67cc6d1868b9', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'bs0fD2mt', '0.55', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_d958918d-5a6d-4c27-bf3e-442a7eab9bec', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'IcuPJ8Wp', '0.5', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_a85d2df5-7d27-4013-a3ca-14a85229c137', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'E0pbpVCc', '0.45', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('kcd_03c59555-0ce1-4766-b53f-3a117b8c76e1', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'Bc3aGk05', '0.4', "ppp");

-- Full Stack Vol 1

INSERT INTO Product (id, name, status) VALUES
('kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002', 'Full Stack Vol 1', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_72cc00f9-24b8-4607-955f-c59714d3b1c8', 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002', 'Full Stack Vol 1', 1, 1299);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_902cb1c5-3498-4d65-8955-f178acf68a72', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002', 1, "prod_Omw9K6FIckP2v3");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd__merchant_price_b80ba93e-42fc-4b34-b303-e91b68286b09', 'kcd_merchant_product_902cb1c5-3498-4d65-8955-f178acf68a72', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_72cc00f9-24b8-4607-955f-c59714d3b1c8', 'price_1NzMGqIugVgg5liQ3aspMBWu');

-- Professional Web Forms

INSERT INTO Product (id, name, status) VALUES
('5ffdd0ef-a7a3-431e-b36b-f4232da7e454', 'Professional Web Forms', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_8bc1d2b9-35a0-4222-95cb-5a4d2e8b055a', '5ffdd0ef-a7a3-431e-b36b-f4232da7e454', 'Professional Web Forms', 1, 300);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_88f850b5-f57b-4cde-9c38-d4f55b9da1f7', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', '5ffdd0ef-a7a3-431e-b36b-f4232da7e454', 1, "prod_P8N6yyov9sfpCw");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_8bc1d2b9-35a0-4222-95cb-5a4d2e8b055a', 'kcd_merchant_product_88f850b5-f57b-4cde-9c38-d4f55b9da1f7', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_8bc1d2b9-35a0-4222-95cb-5a4d2e8b055a', 'price_1OK6MLIugVgg5liQ7KCDtWRq');

-- Data Modeling Deep Dive

INSERT INTO Product (id, name, status) VALUES
('2267e543-51fa-4d71-a02f-ad9ba71a1f8e', 'Data Modeling Deep Dive', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_c12abbc0-7866-4600-9820-689e05290c4c', '2267e543-51fa-4d71-a02f-ad9ba71a1f8e', 'Data Modeling Deep Dive', 1, 300);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_19eb2356-5907-45a6-b3b9-56c36fca9551', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', '2267e543-51fa-4d71-a02f-ad9ba71a1f8e', 1, "prod_P8NHPCgNkwEVE1");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_0f8a2884-cebb-43a7-8dee-d394b48fea0d', 'kcd_merchant_product_19eb2356-5907-45a6-b3b9-56c36fca9551', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_c12abbc0-7866-4600-9820-689e05290c4c', 'price_1OK6WyIugVgg5liQi5sC9kuS');

-- Authentication Strategies & Implementation

INSERT INTO Product (id, name, status) VALUES
('0143b3f6-d5dd-4f20-9898-38da609799ca', 'Authentication Strategies & Implementation', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_0cda4731-1c41-4e10-9554-b172edcacce2', '0143b3f6-d5dd-4f20-9898-38da609799ca', 'Authentication Strategies & Implementation', 1, 300);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_46c5097f-6c9a-406f-89dd-57773e7928fd', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', '0143b3f6-d5dd-4f20-9898-38da609799ca', 1, "prod_P8NLgE2wsEwVsq");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_0cda4731-1c41-4e10-9554-b172edcacce2', 'kcd_merchant_product_46c5097f-6c9a-406f-89dd-57773e7928fd', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_0cda4731-1c41-4e10-9554-b172edcacce2', 'price_1OK6aMIugVgg5liQMG2ahmp2');

-- Web Application Testing

INSERT INTO Product (id, name, status) VALUES
('2e5b2993-d069-4e43-a7f1-24cffa83f7ac', 'Web Application Testing', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_181ebe25-e37c-4f49-8a90-ceac246333ae', '2e5b2993-d069-4e43-a7f1-24cffa83f7ac', '2eWeb Application Testing', 1, 300);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_ce709ebb-c810-4b24-96b4-d0ccec6fa59c', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', '2e5b2993-d069-4e43-a7f1-24cffa83f7ac', 1, "prod_P8NSFz6XsNvwpc");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_3f16e3a1-7780-4ca3-9f6f-0ba6b8e3126e', 'kcd_merchant_product_ce709ebb-c810-4b24-96b4-d0ccec6fa59c', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_181ebe25-e37c-4f49-8a90-ceac246333ae', 'price_1OK6hcIugVgg5liQHXh0NrBV');

-- Full Stack Foundations

INSERT INTO Product (id, name, status) VALUES
('dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d', 'Full Stack Foundations', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_7bd2007b-21cc-4db5-99f7-fe0664089e0a', 'dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d', 'Full Stack Foundations', 1, 300);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_246add9d-2c2d-4492-b13c-df1bc8813906', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 'dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d', 1, "prod_P8NWizQSuTbPQo");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_merchant_price_6c0b1426-3fc9-4791-ae97-7e9f743a62d1', 'kcd_merchant_product_246add9d-2c2d-4492-b13c-df1bc8813906', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_7bd2007b-21cc-4db5-99f7-fe0664089e0a', 'price_1OK6loIugVgg5liQ2rDp5GKJ');

-- Coupons 

INSERT INTO MerchantCoupon (id, identifier, status, merchantAccountId, percentageDiscount, type) VALUES ('kcd_826d7635-0d9c-4f90-9199-6090ef5c4b1a', 'WqPGPHsJ', 1, 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 0.20, 'special');

INSERT INTO MerchantCoupon (id, identifier, status, merchantAccountId, percentageDiscount, type) VALUES ('kcd_487a9d2c-09e0-4bce-b436-ce3c69c4ea05', 'Xi9nwKG6', 1, 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 0.30, 'special');
