INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("pt_d99e565c-c58b-4514-bcd8-2840930ed001", 1, "acct_1KoAP2KXqbBrKxVR", "stripe");

INSERT INTO Product (id, name, status) VALUES
('pt_f452e1fb-a36a-4b19-8cf0-5f2114a00a68', "Multi-Style Tailwind Components Workshop", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('pt_27df20cf-24ac-4e81-959c-9c126a6c2065', "pt_d99e565c-c58b-4514-bcd8-2840930ed001", 'pt_f452e1fb-a36a-4b19-8cf0-5f2114a00a68', 1, "prod_N6XWQtN1itHCSg");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('pt_634f67f6-8e05-4372-b9ef-0d2e674bcacf', 'pt_f452e1fb-a36a-4b19-8cf0-5f2114a00a68', 'Multi-Style Tailwind Components Workshop', 1, 79);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('pt_4d94ce1c-440f-4423-b2f2-a91be924e72e', 'pt_27df20cf-24ac-4e81-959c-9c126a6c2065', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, "pt_634f67f6-8e05-4372-b9ef-0d2e674bcacf", "price_1MMKRRKXqbBrKxVRIPPtJOR7");
INSERT INTO Product (id, name, status) VALUES
('pt_60eb2f82-80ad-4bcf-8434-f34e81df7bbf', "Tailwind Multi-Theme Strategy Workshop", 1);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('pt_fbe733b1-f0fa-42b8-b6d8-98709759c111', "pt_d99e565c-c58b-4514-bcd8-2840930ed001", 'pt_60eb2f82-80ad-4bcf-8434-f34e81df7bbf', 1, "prod_N6XWE5fG4owCxK");

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('pt_3c210496-417e-48c9-a9ca-5e5809acdd9b', 'pt_60eb2f82-80ad-4bcf-8434-f34e81df7bbf', 'Tailwind Multi-Theme Strategy Workshop', 1, 79);

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('pt_04ccd0d0-21d8-4417-a81e-af6006e2384f', 'pt_fbe733b1-f0fa-42b8-b6d8-98709759c111', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, "pt_3c210496-417e-48c9-a9ca-5e5809acdd9b", "price_1MMKRQKXqbBrKxVRGcUW074A");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_2be8f9e8-62e6-43ef-8f2a-57474b0ee2f3', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'ra9yssMe', '0.45', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_c4cce5f6-aeb5-4e08-b40d-e66c8bd8d4ca', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'cCrEoWJK', '0.35', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_fc00f2eb-cb40-4a65-a0c6-1c3b0a5ee1ed', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'Oqze9AGI', '0.25', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_2414a3fb-8698-4cdc-b833-f7bd8c68b9f8', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'i56YdLxf', '0.15', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_12c1a69b-fa32-40e9-bbcf-2bcd005e43d8', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'sl0MW9vO', '0.1', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_00a76850-0b82-47cf-860f-0ccb8d7abde8', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'cDiGtBeD', '0.05', "bulk");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_9e8b11f5-528d-48ba-9a9f-6b8c3c6b5a7f', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'oibzj7o0', '0.95', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_830e6099-c692-4518-8388-867fc321b1fb', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'UkIkdEQG', '0.9', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_719ed462-8ef5-40b4-8c46-e1c92d54daf5', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, '1JwsI9bA', '0.75', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_a544fa87-6775-4764-8790-d6a3ea4e75f5', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'OgPfyegO', '0.6', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_0c957ad3-8b3b-48eb-96e3-af1330854d1a', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'BbmzBHAB', '0.5', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_c9383e64-7876-4234-b8a3-84b38bf53da7', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'aBgBzmed', '0.4', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_4a7b6c2a-74be-4344-bb0b-d5fa5a6d7cad', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'ndvieCD9', '0.25', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_c749e037-9e0f-4d2a-ba9e-d821f0e14b65', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'R5qzefd4', '0.1', "special");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_93695d60-ff37-43d5-8af6-a7a042e914ec', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'oRytTLt6', '0.75', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_e648181b-15be-4a07-bafb-1ae29816c97a', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, '1lQDZpmw', '0.7', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_a1d7c26f-5fbe-4233-a99a-318d99cba2f5', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'vp874gvQ', '0.65', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_b06b717c-6c9b-464b-b2a8-e444d1f7f99c', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'DTxkqJ8R', '0.6', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_eb21c961-9f08-493b-93ee-58ec7eb60e9e', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'ksULhOSQ', '0.55', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_c2ebbf77-703f-4487-b8bb-bf29df3ad439', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'WZ5D0lA8', '0.5', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_d59ec745-5bfd-4a42-bca1-ce3cc827a96b', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 'NaffVvMF', '0.45', "ppp");

INSERT INTO MerchantCoupon (id, merchantAccountId, status, identifier, percentageDiscount, type) VALUES
('pt_70de4448-fc44-48e9-9683-ca4b98e44a2b', 'pt_d99e565c-c58b-4514-bcd8-2840930ed001', 1, 't6683AST', '0.4', "ppp");

