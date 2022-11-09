INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae", 1, "acct_1LFP5yAozSgJZBRP", "stripe");

INSERT INTO Product (id, name, status) VALUES
('tt_cd59affe-ccc3-41ec-b7f6-7e0c816dff6a', "Total TypeScript Vol. 1", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_61b88dc4-8004-487b-81b3-0a35d88c02e1', "tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae", 'tt_cd59affe-ccc3-41ec-b7f6-7e0c816dff6a', 1, "prod_MlWOKsn7m29PjC");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_c68ae76b-3579-4a56-8417-32de56e54fd8', 'tt_cd59affe-ccc3-41ec-b7f6-7e0c816dff6a', 'Total TypeScript Vol. 1', 1, 799);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_a3c78294-84ea-4e6c-b0dd-798f84da982c', 'prod_MlWOKsn7m29PjC', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, "tt_c68ae76b-3579-4a56-8417-32de56e54fd8", "price_1M1zLVAozSgJZBRPbtm67xWX");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_33d9422e-5fb4-4323-bf34-3e57b4a77429', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '8M0LQt2k', '0.45', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_c52e764d-f706-419b-a687-b59e830b5a1a', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'CDDkwbeB', '0.35', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_21f9c04f-7347-472f-b07b-f42465e8bc93', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'DM81Y6XH', '0.25', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_b2f8bb4e-216c-4370-b6f1-c0c276055301', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'lyu3E7Cp', '0.15', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_a55fd253-20c8-43fd-b5d8-698e5e68de49', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'MXQXifFw', '0.1', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_fd64a007-d61b-4662-ae23-51aee1f9aa76', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'HSxsmB03', '0.05', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_e24bf5a2-c4b0-49eb-ac54-433ff85941d6', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '8Zt8gXNR', '0.95', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_f2f0ccb4-6cbc-44dc-9d9b-3d7923347ea5', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'ls8xRtqQ', '0.9', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_870c4c18-63d1-4af0-bda5-4e8afa9b2690', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'OoxAUXIT', '0.75', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_b521fba9-e089-4878-91ee-ee96375bc4cf', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'YtTedtfI', '0.6', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_29a7f989-5643-4059-b547-3d8d5cdd451e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'fcsiPxCs', '0.5', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_ccb59c77-cde0-4278-be91-3bf2f56a404e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'Ae8p2peS', '0.4', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_c9f0773f-5131-4ffa-998a-32ff65cd9a78', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 't6wtag0L', '0.25', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_19c9717e-b72b-45b8-8006-b127c56263c1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'Our27cg4', '0.1', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_92628e07-01eb-496e-9557-5d0a929cb56b', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'axKqK2Fa', '0.75', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_3be91266-fea1-4f4b-9417-8865942a34ec', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '4Wu9Q6CP', '0.7', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_3e1f4f50-c85e-46fa-b128-fde69219a02f', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'rtHlGd6U', '0.65', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_da5c156a-f05b-40b0-b57a-2d0a63567a4f', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '5Lozpfh7', '0.6', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_63c6fe55-244a-424f-a205-fc272c15ad5e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'dJ2F6CAs', '0.55', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_4459388e-33cd-48ed-a7f6-ad3666fa3138', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '6RiqK8sH', '0.5', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_1a86f7f1-9d74-45ec-8374-e592ddad5a75', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'ZihdUCUK', '0.45', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_6d254bcf-50fc-430f-aecf-b127f3ce6b83', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'oHR9dq3p', '0.4', "ppp");
