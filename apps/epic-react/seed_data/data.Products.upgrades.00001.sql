-- Epic React Upgradable Products
--   Basic:    kcd_910c9191-5a69-4019-ad1d-c55bea7e9714
--   Standard: kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61
--   Pro:      kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38
INSERT INTO `UpgradableProducts`(`upgradableFromId`, `upgradableToId`) VALUES
    -- Basic to Standard
    ("kcd_910c9191-5a69-4019-ad1d-c55bea7e9714", "kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61"),
    -- Basic to Pro
    ("kcd_910c9191-5a69-4019-ad1d-c55bea7e9714", "kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38"),
    -- Standard to Pro
    ("kcd_8acc60f1-8c3f-4093-b20d-f60fc6e0cf61", "kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38");
