-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `context` JSON NULL,
    `updatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LessonProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `lessonSlug` VARCHAR(191) NOT NULL,
    `lessonVersion` VARCHAR(191) NULL,
    `completedAt` DATETIME(3) NULL,
    `updatedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` BIGINT NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,
    `oauth_token_secret` VARCHAR(191) NULL,
    `oauth_token` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NOT NULL,
    `refresh_token_expires_in` INTEGER NULL,

    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupon` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expires` DATETIME(3) NULL,
    `maxUses` INTEGER NOT NULL DEFAULT -1,
    `default` BOOLEAN NOT NULL DEFAULT false,
    `merchantCouponId` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `usedCount` INTEGER NOT NULL DEFAULT 0,
    `percentageDiscount` DECIMAL(3, 2) NOT NULL,
    `restrictedToProductId` VARCHAR(191) NULL,
    `bulkPurchaseId` VARCHAR(191) NULL,

    UNIQUE INDEX `Coupon_code_key`(`code`),
    UNIQUE INDEX `Coupon_bulkPurchaseId_key`(`bulkPurchaseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantAccount` (
    `id` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `label` VARCHAR(191) NULL,
    `identifier` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantCharge` (
    `id` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `identifier` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `merchantAccountId` VARCHAR(191) NOT NULL,
    `merchantProductId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `merchantCustomerId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `MerchantCharge_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantCoupon` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `merchantAccountId` VARCHAR(191) NOT NULL,
    `percentageDiscount` DECIMAL(3, 2) NOT NULL,
    `type` VARCHAR(191) NULL,

    UNIQUE INDEX `MerchantCoupon_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantCustomer` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `merchantAccountId` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NULL DEFAULT 0,

    UNIQUE INDEX `MerchantCustomer_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantPrice` (
    `id` VARCHAR(191) NOT NULL,
    `merchantAccountId` VARCHAR(191) NOT NULL,
    `merchantProductId` VARCHAR(191) NOT NULL,
    `status` INTEGER NULL DEFAULT 0,
    `identifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `priceId` VARCHAR(191) NULL,

    UNIQUE INDEX `MerchantPrice_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MerchantProduct` (
    `id` VARCHAR(191) NOT NULL,
    `merchantAccountId` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `identifier` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `MerchantProduct_identifier_key`(`identifier`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Price` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `unitAmount` DECIMAL(10, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `key` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UpgradableProducts` (
    `upgradableToId` VARCHAR(191) NOT NULL,
    `upgradableFromId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`upgradableToId`, `upgradableFromId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `totalAmount` DECIMAL(65, 30) NOT NULL,
    `ip_address` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `couponId` VARCHAR(191) NULL,
    `productId` VARCHAR(191) NOT NULL,
    `merchantChargeId` VARCHAR(191) NULL,
    `upgradedFromId` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'Valid',

    UNIQUE INDEX `Purchase_upgradedFromId_key`(`upgradedFromId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `expires` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `roles` VARCHAR(191) NOT NULL DEFAULT 'User',

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `token` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
