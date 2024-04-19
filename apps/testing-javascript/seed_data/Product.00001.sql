INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 1, "acct_1HzmnqIugVgg5liQ", "stripe");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', "Testing JavaScript Pro", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_47479d9f-10a0-4725-a6ee-5eac6299067a', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', 1, "prod_NJvuoglTLIYE60");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_0a823046-d7d0-43d1-a39d-896cd76baff2', 'kcd_4f0b26ee-d61d-4245-a204-26f5774355a5', 'Testing JavaScript Pro', 1, 332);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_99c9b532-6f12-4662-a93e-ac69bea7306a', 'kcd_47479d9f-10a0-4725-a6ee-5eac6299067a', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_0a823046-d7d0-43d1-a39d-896cd76baff2", "price_1MZI37IugVgg5liQOBPzPBQv");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', "Testing JavaScript Standard", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_85b2ceb9-6b6b-4545-af1e-826fd5bacfd2', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', 1, "prod_NJvuQnX13D2e7n");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_4a502214-ae2b-4256-a575-789fc82d8c7b', 'kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3', 'Testing JavaScript Standard', 1, 136);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_9c47a9ff-8d04-4649-bece-e69c93dbc6cc', 'kcd_85b2ceb9-6b6b-4545-af1e-826fd5bacfd2', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_4a502214-ae2b-4256-a575-789fc82d8c7b", "price_1MZI37IugVgg5liQVGX0IspL");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', "Testing JavaScript Basic", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_34e6140e-77e1-46ca-95f9-ef96a096aa9e', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', 1, "prod_NJvur3aADf36J8");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_1a194e9c-9eff-430e-a295-531d38ed6086', 'kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff', 'Testing JavaScript Basic', 1, 67);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_29062dfd-818e-4f55-a2d5-905ea1407a42', 'kcd_34e6140e-77e1-46ca-95f9-ef96a096aa9e', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_1a194e9c-9eff-430e-a295-531d38ed6086", "price_1MZI36IugVgg5liQd7hJqnfD");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', "Epic React Pro", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_754b9122-5f02-4789-ad66-fe792eef1b5c', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', 1, "prod_NJvu5JtYQvqHdc");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_3bd9544d-9ed0-4dae-97d5-118e51ca6df5', 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38', 'Epic React Pro', 1, 599);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_9d63d7fe-6620-4df8-963e-5ee8db317e6f', 'kcd_754b9122-5f02-4789-ad66-fe792eef1b5c', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_3bd9544d-9ed0-4dae-97d5-118e51ca6df5", "price_1MZI36IugVgg5liQ8H51fLQO");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', "Epic React Standard", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_a427eaf5-2abe-43af-a5ac-14884fc76f0e', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', 1, "prod_NJvu44Xno5stmu");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_af23cd3e-a6f9-4b6f-9785-a973f81c9008', 'kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61', 'Epic React Standard', 1, 264);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd_c19d9c1a-14b6-4e31-b8b4-cbfce4054de6', 'kcd_a427eaf5-2abe-43af-a5ac-14884fc76f0e', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, "kcd_af23cd3e-a6f9-4b6f-9785-a973f81c9008", "price_1MZI36IugVgg5liQ4SSj94a0");

INSERT INTO Product (id, name, productType, status) VALUES
('kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', "Epic React Basic", 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_8082cc16-de5a-4646-af70-1a609273818d', "kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', 1, "prod_NJvu9ruwFuWsPE");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_0234be80-b95f-4418-8420-b6a2a6839d3d', 'kcd_910c9191-5a69-4019-ad1d-c55bea7e9714', 'Epic React Basic', 1, 119);

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
