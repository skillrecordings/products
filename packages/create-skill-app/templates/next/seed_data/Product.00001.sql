-- TODO: Change MerchantAccount to your Stripe account

INSERT INTO MerchantAccount (id, status, identifier, label) VALUES
("kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e", 1, "acct_1HzmnqIugVgg5liQ", "stripe");

-- Placeholder Product

INSERT INTO Product (id, name, status) VALUES
('placeholder-product-id-1', 'Full Stack Vol 1', 1);

INSERT INTO Price (id, productId, nickname, status, unitAmount ) VALUES
('kcd_price_72cc00f9-24b8-4607-955f-c59714d3b1c8', 'placeholder-product-id-1', 'Full Stack Vol 1', 1, 1299);

INSERT INTO MerchantProduct (id, merchantAccountId, productId, status, identifier) VALUES
('kcd_merchant_product_902cb1c5-3498-4d65-8955-f178acf68a72', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 'placeholder-product-id-1', 1, "prod_Omw9K6FIckP2v3");

INSERT INTO MerchantPrice (id, merchantProductId, merchantAccountId, status, priceId, identifier ) VALUES
('kcd__merchant_price_b80ba93e-42fc-4b34-b303-e91b68286b09', 'kcd_merchant_product_902cb1c5-3498-4d65-8955-f178acf68a72', 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 1, 'kcd_price_72cc00f9-24b8-4607-955f-c59714d3b1c8', 'price_1NzMGqIugVgg5liQ3aspMBWu');

-- Coupons 

INSERT INTO MerchantCoupon (id, identifier, status, merchantAccountId, percentageDiscount, type) VALUES ('kcd_826d7635-0d9c-4f90-9199-6090ef5c4b1a', 'WqPGPHsJ', 1, 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 0.20, 'special');

INSERT INTO MerchantCoupon (id, identifier, status, merchantAccountId, percentageDiscount, type) VALUES ('kcd_487a9d2c-09e0-4bce-b436-ce3c69c4ea05', 'Xi9nwKG6', 1, 'kcd_ff532118-69fe-4263-85a5-50b7b03a4b1e', 0.30, 'special');
