INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
('tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'acct_1LFP5yAozSgJZBRP', 'stripe');

-- Core Volume

INSERT INTO Product (id, name, productType, status) VALUES
('tt_00c02ac7-6f95-4ad4-8aac-999b243df6c1', 'Core Volume', 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_61b88dc4-8004-487b-81b3-0a35d88c02e1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_00c02ac7-6f95-4ad4-8aac-999b243df6c1', 1, 'prod_MlWOKsn7m29PjC');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_c68ae76b-3579-4a56-8417-32de56e54fd8', 'tt_00c02ac7-6f95-4ad4-8aac-999b243df6c1', 'Core Volume', 1, 590);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_a3c78294-84ea-4e6c-b0dd-798f84da982c', 'tt_61b88dc4-8004-487b-81b3-0a35d88c02e1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_c68ae76b-3579-4a56-8417-32de56e54fd8', 'price_1MVib6AozSgJZBRPdB5txBl5');

-- Advanced Patterns Workshop

INSERT INTO Product (id, name, productType, status) VALUES
('tt_c5e2d746-d95d-4f94-8609-7149cc62c667', 'Advanced Patterns Workshop', 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_0614e8f9-0dea-4c4a-8193-7151462e74f1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_c5e2d746-d95d-4f94-8609-7149cc62c667', 1, 'prod_NGBH3qA2HQuT8q');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_24a6e6be-1668-4f0f-a723-ccd076c6f78f', 'tt_c5e2d746-d95d-4f94-8609-7149cc62c667', 'Advanced Patterns Workshop', 1, 250);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_c333ec1a-88e6-47ec-a913-e0c8dd0d67e5', 'tt_0614e8f9-0dea-4c4a-8193-7151462e74f1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_24a6e6be-1668-4f0f-a723-ccd076c6f78f', 'price_1MVeuXAozSgJZBRPigmVNj02');

-- Generics Workshop

INSERT INTO Product (id, name, productType, status) VALUES
('tt_89661c99-6fa2-4b97-912a-7ac415eae606', 'Generics Workshop','self-paced',  1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_01a85f33-532f-4c66-a1da-515e0fb555e2', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_89661c99-6fa2-4b97-912a-7ac415eae606', 1, 'prod_NGBHeNSOj0XozY');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_a7a11412-3712-4b4b-944e-bffcedc88ea6', 'tt_89661c99-6fa2-4b97-912a-7ac415eae606', 'Generics Workshop', 1, 250);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_1bd7dfac-a40a-453f-a39f-1389c7b3acfe', 'tt_01a85f33-532f-4c66-a1da-515e0fb555e2', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_a7a11412-3712-4b4b-944e-bffcedc88ea6', 'price_1MVeuXAozSgJZBRPrxFrf1hq');

-- Type Transforms Workshop

INSERT INTO Product (id, name, productType, status) VALUES
('tt_63500c2e-c1db-4a07-95e5-7018fd71a295', 'Type Transforms Workshop', 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_e21bb064-dc5d-4916-aab2-928775a30bc9', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_63500c2e-c1db-4a07-95e5-7018fd71a295', 1, 'prod_NGBHIn3XjtLGxE');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_7f4ac3a4-c6a1-4a03-8a8e-0dba3f83109a', 'tt_63500c2e-c1db-4a07-95e5-7018fd71a295', 'Type Transforms Workshop', 1, 250);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_7914c0cd-bb8d-4732-891c-244182e14a6a', 'tt_e21bb064-dc5d-4916-aab2-928775a30bc9', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_7f4ac3a4-c6a1-4a03-8a8e-0dba3f83109a', 'price_1MVeuWAozSgJZBRPMpFxeS10');

-- Complete Volume

INSERT INTO Product (id, name, productType, status) VALUES
('tt_product_clxjgl7fg000108l8eifn69dt', 'Complete Volume', 'self-paced', 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('tt_merchant_product_clxjgkeaj000008l8ho3t6xos', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 'tt_product_clxjgl7fg000108l8eifn69dt', 1, 'prod_QJkqxmPdPLIdG8');

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('tt_price_clxjgnv6h000308l81g9chb9n', 'tt_product_clxjgl7fg000108l8eifn69dt', 'Complete Volume', 1, 499);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('tt_merchant_price_clxjgp7ra000408l8ebjcaz4w', 'tt_merchant_product_clxjgkeaj000008l8ho3t6xos', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'tt_price_clxjgnv6h000308l81g9chb9n', 'price_1PYVMpAozSgJZBRPBMF58hSS');

-- Coupons

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_33d9422e-5fb4-4323-bf34-3e57b4a77429', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '8M0LQt2k', '0.45', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_c52e764d-f706-419b-a687-b59e830b5a1a', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'CDDkwbeB', '0.35', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_21f9c04f-7347-472f-b07b-f42465e8bc93', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'DM81Y6XH', '0.25', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_b2f8bb4e-216c-4370-b6f1-c0c276055301', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'lyu3E7Cp', '0.15', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_a55fd253-20c8-43fd-b5d8-698e5e68de49', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'MXQXifFw', '0.1', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_fd64a007-d61b-4662-ae23-51aee1f9aa76', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'HSxsmB03', '0.05', 'bulk');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_e24bf5a2-c4b0-49eb-ac54-433ff85941d6', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '8Zt8gXNR', '0.95', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_f2f0ccb4-6cbc-44dc-9d9b-3d7923347ea5', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'ls8xRtqQ', '0.9', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_870c4c18-63d1-4af0-bda5-4e8afa9b2690', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'OoxAUXIT', '0.75', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_b521fba9-e089-4878-91ee-ee96375bc4cf', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'YtTedtfI', '0.6', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_29a7f989-5643-4059-b547-3d8d5cdd451e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'fcsiPxCs', '0.5', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_ccb59c77-cde0-4278-be91-3bf2f56a404e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'Ae8p2peS', '0.4', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_c9f0773f-5131-4ffa-998a-32ff65cd9a78', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 't6wtag0L', '0.25', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_6e879ed7-2c68-43a9-a026-7910bf5f402a', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 't8eoLx7m', '0.20', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_19c9717e-b72b-45b8-8006-b127c56263c1', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'Our27cg4', '0.1', 'special');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_92628e07-01eb-496e-9557-5d0a929cb56b', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'axKqK2Fa', '0.75', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_3be91266-fea1-4f4b-9417-8865942a34ec', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '4Wu9Q6CP', '0.7', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_3e1f4f50-c85e-46fa-b128-fde69219a02f', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'rtHlGd6U', '0.65', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_da5c156a-f05b-40b0-b57a-2d0a63567a4f', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '5Lozpfh7', '0.6', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_63c6fe55-244a-424f-a205-fc272c15ad5e', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'dJ2F6CAs', '0.55', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_4459388e-33cd-48ed-a7f6-ad3666fa3138', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, '6RiqK8sH', '0.5', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_1a86f7f1-9d74-45ec-8374-e592ddad5a75', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'ZihdUCUK', '0.45', 'ppp');

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('tt_6d254bcf-50fc-430f-aecf-b127f3ce6b83', 'tt_cc7acfa7-f60b-4315-ae51-3cbd305e23ae', 1, 'oHR9dq3p', '0.4', 'ppp');
