-- Testing JavaScript Upgradable Products
--   Basic:    kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff
--   Standard: kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3
--   Pro:      kcd_4f0b26ee-d61d-4245-a204-26f5774355a5
INSERT INTO `UpgradableProducts`(`upgradableFromId`, `upgradableToId`) VALUES
    -- Basic to Standard
    ("kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff", "kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3"),
    -- Basic to Pro
    ("kcd_da6ab36c-b091-4f6f-90aa-d7db2fc798ff", "kcd_4f0b26ee-d61d-4245-a204-26f5774355a5"),
    -- Standard to Pro
    ("kcd_fb976b99-0633-4329-bbfb-f5f76dc278b3", "kcd_4f0b26ee-d61d-4245-a204-26f5774355a5");
