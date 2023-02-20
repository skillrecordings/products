INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("ti_27d60702-57f9-448a-ba89-681949a92861", 1, "acct_1IPB1QCewVnh9oKR", "stripe");

INSERT INTO Product (id, name, status) VALUES
('ti_d8224940-1ef9-4ec4-bea6-bb1c7a44c238', "Technical Interviews", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('ti_d95ff4a2-6d15-494c-8165-c40eb63cf785', "ti_27d60702-57f9-448a-ba89-681949a92861", 'ti_d8224940-1ef9-4ec4-bea6-bb1c7a44c238', 1, "prod_NMycnqnViKsmRt");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('ti_757aba67-65f8-4c2b-81b4-76e4a5306192', 'ti_d8224940-1ef9-4ec4-bea6-bb1c7a44c238', 'Technical Interviews', 1, 29);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('ti_90ae210d-5820-408a-8d2a-e33ac323c7ab', 'ti_d95ff4a2-6d15-494c-8165-c40eb63cf785', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, "ti_757aba67-65f8-4c2b-81b4-76e4a5306192", "price_1McEemCewVnh9oKRLwTwkU7j");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_7cc79117-c97b-449c-a33c-9ab87aa940e8', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'EwRnPoOZ', '0.45', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_b73c89c6-f2ab-479a-a65d-347989dfb745', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'uvPUJkQN', '0.35', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_18306015-1acb-4e44-be95-87055059ddd1', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'cknn2Mr0', '0.25', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_46673a2f-fcdd-4ea5-8dab-337e19fab2d1', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'tLRdrUto', '0.15', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_cfd8452c-af2d-40f4-ab04-dc6504f4ae22', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'P6pTAFP9', '0.1', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_696dddf9-c516-4ec9-99db-7d426128a33c', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'iyN4AgcR', '0.05', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_4bb4ffe1-e9cd-4326-bd0f-94b026579146', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'jmiSzk6t', '0.95', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_99407155-dfcc-4122-9c0d-a860490379e4', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'h3S7EEU6', '0.9', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_957b4720-b3b1-4b64-9675-99d330166b21', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'U7M6HxjO', '0.75', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_ff4167ed-da78-469c-8736-6c6424e6d2fa', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, '8OYh6H4i', '0.6', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_ca54e439-5058-4690-940d-48581529da8b', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'bwT2rmmT', '0.5', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_1fbeabe4-f944-4da5-bbb7-2393adbbdb54', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'lHI9iUN1', '0.4', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_0d96d705-f106-4a7c-8c98-9a07027f97a6', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'dFNUKYeK', '0.25', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_6dd61c70-e918-4c3b-ac58-ca4f9f6c6c90', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'HBtaSlhc', '0.1', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_7e5ba206-731e-4788-8743-617691eda766', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'H3ZynKYQ', '0.75', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_89c38015-b70c-459f-ab52-b206264537a8', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'y9RURQzt', '0.7', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_03e72b88-3a6e-4de3-b2a8-2a24a15418e2', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'aY0z4nvQ', '0.65', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_f71d8483-4dcc-4b9d-84c7-b54e723bda46', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, '5825dsDQ', '0.6', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_5d5ffbe5-6d14-4a36-b25e-bd07b168e01c', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'oGBet9HP', '0.55', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_4e861d2c-ab5b-4a01-8963-2cc65b15117b', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'ZNeSG2rl', '0.5', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_965423ba-8ec4-41df-bc99-5bdc122cf306', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'YmELBxJ2', '0.45', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('ti_272de68d-87b2-4655-b0b0-d756ba28b295', 'ti_27d60702-57f9-448a-ba89-681949a92861', 1, 'o2LouGhp', '0.4', "ppp");
