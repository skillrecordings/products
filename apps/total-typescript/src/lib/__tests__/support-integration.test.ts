/**
 * Unit tests for Support Platform Integration
 *
 * Tests each method of the SupportIntegration implementation.
 * Mocks Prisma client to isolate database operations.
 */
import {integration} from '../support-integration'

// Mock Prisma client
jest.mock('@skillrecordings/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    purchase: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    purchaseUserTransfer: {
      create: jest.fn(),
    },
    coupon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    lessonProgress: {
      findMany: jest.fn(),
    },
    product: {
      findFirst: jest.fn(),
    },
  },
}))

// Mock skill-api createVerificationUrl
jest.mock('@skillrecordings/skill-api', () => ({
  createVerificationUrl: jest.fn(),
}))

// Mock NextAuth options
jest.mock('../../pages/api/auth/[...nextauth]', () => ({
  nextAuthOptions: {},
}))

// Mock sanityClient
jest.mock('@skillrecordings/skill-lesson/utils/sanity-client', () => ({
  sanityClient: {
    fetch: jest.fn(),
  },
}))

import {prisma} from '@skillrecordings/database'
import {createVerificationUrl} from '@skillrecordings/skill-api'

const mockPrisma = prisma as jest.Mocked<typeof prisma>
const mockCreateVerificationUrl = createVerificationUrl as jest.MockedFunction<
  typeof createVerificationUrl
>

describe('SupportIntegration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('lookupUser', () => {
    it('returns user when found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date('2024-01-01'),
      }

      mockPrisma.user.findUnique.mockResolvedValue(mockUser as any)

      const result = await integration.lookupUser('test@example.com')

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: expect.any(Date),
      })
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: {email: 'test@example.com'},
      })
    })

    it('returns null when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null)

      const result = await integration.lookupUser('unknown@example.com')

      expect(result).toBeNull()
    })
  })

  describe('getPurchases', () => {
    it('returns mapped purchases for user', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          productId: 'prod-1',
          createdAt: new Date('2024-01-15'),
          totalAmount: 299,
          status: 'Valid',
          product: {name: 'Total TypeScript Pro'},
          merchantCharge: {identifier: 'ch_123abc'},
        },
        {
          id: 'purchase-2',
          productId: 'prod-2',
          createdAt: new Date('2024-02-01'),
          totalAmount: 99,
          status: 'Refunded',
          product: {name: 'TypeScript Fundamentals'},
          merchantCharge: null,
        },
      ]

      mockPrisma.purchase.findMany.mockResolvedValue(mockPurchases as any)

      const result = await integration.getPurchases('user-123')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'purchase-1',
        productId: 'prod-1',
        productName: 'Total TypeScript Pro',
        purchasedAt: expect.any(Date),
        amount: 29900, // Converted to cents
        currency: 'USD',
        stripeChargeId: 'ch_123abc',
        status: 'active',
      })
      expect(result[1].status).toBe('refunded')
    })

    it('returns empty array when no purchases', async () => {
      mockPrisma.purchase.findMany.mockResolvedValue([])

      const result = await integration.getPurchases('user-456')

      expect(result).toEqual([])
    })
  })

  describe('revokeAccess', () => {
    it('updates purchase status to Refunded', async () => {
      mockPrisma.purchase.update.mockResolvedValue({} as any)

      const result = await integration.revokeAccess({
        purchaseId: 'purchase-1',
        reason: 'Customer requested refund',
        refundId: 're_abc123',
      })

      expect(result).toEqual({success: true})
      expect(mockPrisma.purchase.update).toHaveBeenCalledWith({
        where: {id: 'purchase-1'},
        data: {status: 'Refunded'},
      })
    })

    it('returns error on failure', async () => {
      mockPrisma.purchase.update.mockRejectedValue(new Error('DB error'))

      const result = await integration.revokeAccess({
        purchaseId: 'purchase-1',
        reason: 'Refund',
        refundId: 're_123',
      })

      expect(result).toEqual({success: false, error: 'DB error'})
    })
  })

  describe('transferPurchase', () => {
    it('transfers purchase to existing user', async () => {
      const sourceUser = {id: 'user-1', email: 'source@example.com'}
      const targetUser = {id: 'user-2', email: 'target@example.com'}
      const purchase = {id: 'purchase-1', userId: 'user-1'}

      mockPrisma.user.findUnique.mockResolvedValueOnce(targetUser as any) // First call finds target user
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase as any)
      mockPrisma.purchaseUserTransfer.create.mockResolvedValue({} as any)
      mockPrisma.purchase.update.mockResolvedValue({} as any)

      const result = await integration.transferPurchase({
        purchaseId: 'purchase-1',
        fromUserId: 'user-1',
        toEmail: 'target@example.com',
      })

      expect(result).toEqual({success: true})
      expect(mockPrisma.purchaseUserTransfer.create).toHaveBeenCalled()
      expect(mockPrisma.purchase.update).toHaveBeenCalledWith({
        where: {id: 'purchase-1'},
        data: {userId: 'user-2', status: 'Valid'},
      })
    })

    it('creates new user if target does not exist', async () => {
      const newUser = {id: 'new-user', email: 'new@example.com'}
      const purchase = {id: 'purchase-1', userId: 'user-1'}

      mockPrisma.user.findUnique.mockResolvedValue(null)
      mockPrisma.user.create.mockResolvedValue(newUser as any)
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase as any)
      mockPrisma.purchaseUserTransfer.create.mockResolvedValue({} as any)
      mockPrisma.purchase.update.mockResolvedValue({} as any)

      const result = await integration.transferPurchase({
        purchaseId: 'purchase-1',
        fromUserId: 'user-1',
        toEmail: 'new@example.com',
      })

      expect(result).toEqual({success: true})
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {email: 'new@example.com'},
      })
    })

    it('fails if purchase belongs to different user', async () => {
      const purchase = {id: 'purchase-1', userId: 'user-2'} // Different user

      mockPrisma.user.findUnique.mockResolvedValue({id: 'target'} as any)
      mockPrisma.purchase.findUnique.mockResolvedValue(purchase as any)

      const result = await integration.transferPurchase({
        purchaseId: 'purchase-1',
        fromUserId: 'user-1', // Doesn't match purchase.userId
        toEmail: 'target@example.com',
      })

      expect(result).toEqual({
        success: false,
        error: 'Purchase does not belong to source user',
      })
    })
  })

  describe('generateMagicLink', () => {
    it('creates verification URL and returns magic link', async () => {
      mockCreateVerificationUrl.mockResolvedValue({
        url: 'http://localhost:3016/api/auth/callback/email?token=abc123',
        token: 'abc123',
        expires: new Date(),
      })

      const result = await integration.generateMagicLink({
        email: 'user@example.com',
        expiresIn: 3600,
      })

      expect(result).toEqual({
        url: 'http://localhost:3016/api/auth/callback/email?token=abc123',
      })
      expect(mockCreateVerificationUrl).toHaveBeenCalledWith({
        email: 'user@example.com',
        nextAuthOptions: {},
        expiresAt: expect.any(Date),
      })
    })

    it('throws if createVerificationUrl returns undefined', async () => {
      mockCreateVerificationUrl.mockResolvedValue(undefined as any)

      await expect(
        integration.generateMagicLink({
          email: 'user@example.com',
          expiresIn: 3600,
        }),
      ).rejects.toThrow('Unable to create verification URL')
    })
  })

  describe('updateEmail', () => {
    it('updates user email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null) // Email not in use
      mockPrisma.user.update.mockResolvedValue({} as any)

      const result = await integration.updateEmail!({
        userId: 'user-1',
        newEmail: 'newemail@example.com',
      })

      expect(result).toEqual({success: true})
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: {id: 'user-1'},
        data: {email: 'newemail@example.com'},
      })
    })

    it('fails if email already in use by another user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'different-user',
      } as any)

      const result = await integration.updateEmail!({
        userId: 'user-1',
        newEmail: 'taken@example.com',
      })

      expect(result).toEqual({
        success: false,
        error: 'Email already in use by another user',
      })
    })
  })

  describe('updateName', () => {
    it('updates user name', async () => {
      mockPrisma.user.update.mockResolvedValue({} as any)

      const result = await integration.updateName!({
        userId: 'user-1',
        newName: 'New Name',
      })

      expect(result).toEqual({success: true})
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: {id: 'user-1'},
        data: {name: 'New Name'},
      })
    })
  })

  describe('getClaimedSeats', () => {
    it('returns claimed seats for bulk coupon', async () => {
      const mockClaims = [
        {
          id: 'purchase-1',
          createdAt: new Date('2024-01-15'),
          user: {id: 'user-1', email: 'seat1@example.com'},
        },
        {
          id: 'purchase-2',
          createdAt: new Date('2024-01-16'),
          user: {id: 'user-2', email: 'seat2@example.com'},
        },
      ]

      mockPrisma.purchase.findMany.mockResolvedValue(mockClaims as any)

      const result = await integration.getClaimedSeats!('bulk-coupon-123')

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        userId: 'user-1',
        email: 'seat1@example.com',
        claimedAt: expect.any(Date),
      })
      expect(mockPrisma.purchase.findMany).toHaveBeenCalledWith({
        where: {redeemedBulkCouponId: 'bulk-coupon-123'},
        include: {user: true},
      })
    })
  })

  // ── Agent Intelligence Methods (SDK v0.5.0) ─────────────────────────

  describe('getActivePromotions', () => {
    it('returns active coupons as promotions', async () => {
      const mockCoupons = [
        {
          id: 'coupon-1',
          code: 'SUMMER2025',
          createdAt: new Date('2025-06-01'),
          expires: new Date('2025-08-31'),
          status: 1,
          percentageDiscount: 0.3,
          restrictedToProductId: null,
          merchantCouponId: 'mc-1',
          merchantCoupon: {id: 'mc-1', percentageDiscount: 0.3},
          product: null,
        },
        {
          id: 'coupon-2',
          code: null,
          createdAt: new Date('2025-01-01'),
          expires: null,
          status: 1,
          percentageDiscount: 0.15,
          restrictedToProductId: 'prod-1',
          merchantCouponId: 'mc-2',
          merchantCoupon: {id: 'mc-2', percentageDiscount: 0.15},
          product: {name: 'TypeScript Pro'},
        },
      ]

      mockPrisma.coupon.findMany.mockResolvedValue(mockCoupons as any)

      const result = await integration.getActivePromotions!()

      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({
        id: 'coupon-1',
        name: 'Coupon: SUMMER2025',
        code: 'SUMMER2025',
        discountType: 'percent',
        discountAmount: 30,
        validFrom: expect.any(String),
        validUntil: expect.any(String),
        active: true,
        conditions: undefined,
      })
      expect(result[1]).toEqual({
        id: 'coupon-2',
        name: 'TypeScript Pro discount',
        code: undefined,
        discountType: 'percent',
        discountAmount: 15,
        validFrom: expect.any(String),
        validUntil: undefined,
        active: true,
        conditions: 'Restricted to product: TypeScript Pro',
      })
    })

    it('returns empty array when no active promotions', async () => {
      mockPrisma.coupon.findMany.mockResolvedValue([])

      const result = await integration.getActivePromotions!()

      expect(result).toEqual([])
    })
  })

  describe('getCouponInfo', () => {
    it('returns valid coupon info', async () => {
      const mockCoupon = {
        id: 'coupon-1',
        code: 'SUMMER2025',
        status: 0,
        expires: new Date('2026-12-31'),
        maxUses: 100,
        usedCount: 25,
        percentageDiscount: 0.3,
        merchantCouponId: 'mc-1',
        merchantCoupon: {id: 'mc-1', type: 'general', percentageDiscount: 0.3},
      }

      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon as any)

      const result = await integration.getCouponInfo!('SUMMER2025')

      expect(result).toEqual({
        code: 'SUMMER2025',
        valid: true,
        discountType: 'percent',
        discountAmount: 30,
        restrictionType: 'general',
        usageCount: 25,
        maxUses: 100,
        expiresAt: expect.any(String),
      })
    })

    it('returns null for unknown code', async () => {
      mockPrisma.coupon.findUnique.mockResolvedValue(null)

      const result = await integration.getCouponInfo!('DOESNOTEXIST')

      expect(result).toBeNull()
    })

    it('marks expired coupon as invalid', async () => {
      const mockCoupon = {
        id: 'coupon-1',
        code: 'EXPIRED2024',
        status: 0,
        expires: new Date('2024-01-01'), // Past date
        maxUses: -1,
        usedCount: 10,
        percentageDiscount: 0.2,
        merchantCouponId: null,
        merchantCoupon: null,
      }

      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon as any)

      const result = await integration.getCouponInfo!('EXPIRED2024')

      expect(result).not.toBeNull()
      expect(result!.valid).toBe(false)
    })

    it('identifies PPP coupon restriction type', async () => {
      const mockCoupon = {
        id: 'coupon-ppp',
        code: 'PPP_IN',
        status: 0,
        expires: null,
        maxUses: -1,
        usedCount: 5,
        percentageDiscount: 0.6,
        merchantCouponId: 'mc-ppp',
        merchantCoupon: {id: 'mc-ppp', type: 'ppp', percentageDiscount: 0.6},
      }

      mockPrisma.coupon.findUnique.mockResolvedValue(mockCoupon as any)

      const result = await integration.getCouponInfo!('PPP_IN')

      expect(result!.restrictionType).toBe('ppp')
    })
  })

  describe('getRefundPolicy', () => {
    it('returns static refund policy', async () => {
      const result = await integration.getRefundPolicy!()

      expect(result).toEqual({
        autoApproveWindowDays: 30,
        manualApproveWindowDays: 60,
        noRefundAfterDays: 90,
        specialConditions: expect.arrayContaining([
          expect.stringContaining('Lifetime access'),
        ]),
        policyUrl: 'https://www.totaltypescript.com/privacy',
      })
    })
  })

  describe('getContentAccess', () => {
    it('returns full access for valid purchases', async () => {
      const mockPurchases = [
        {
          id: 'purchase-1',
          productId: 'prod-1',
          status: 'Valid',
          createdAt: new Date('2024-01-01'),
          product: {name: 'Total TypeScript Pro'},
          redeemedBulkCouponId: null,
          redeemedBulkCoupon: null,
        },
      ]

      mockPrisma.purchase.findMany.mockResolvedValue(mockPurchases as any)

      const result = await integration.getContentAccess!('user-1')

      expect(result).toEqual({
        userId: 'user-1',
        products: [
          {
            productId: 'prod-1',
            productName: 'Total TypeScript Pro',
            accessLevel: 'full',
          },
        ],
        teamMembership: undefined,
      })
    })

    it('includes team membership for redeemed bulk coupon', async () => {
      const mockPurchases = [
        {
          id: 'purchase-team',
          productId: 'prod-1',
          status: 'Valid',
          createdAt: new Date('2024-01-01'),
          product: {name: 'Total TypeScript Pro'},
          redeemedBulkCouponId: 'bulk-coupon-1',
          redeemedBulkCoupon: {
            id: 'bulk-coupon-1',
            bulkPurchaseId: 'purchase-admin',
            bulkPurchase: {id: 'purchase-admin'},
          },
        },
      ]

      mockPrisma.purchase.findMany.mockResolvedValue(mockPurchases as any)
      mockPrisma.purchase.findUnique.mockResolvedValue({
        id: 'purchase-admin',
        user: {email: 'admin@company.com'},
      } as any)

      const result = await integration.getContentAccess!('user-1')

      expect(result.teamMembership).toEqual({
        teamId: 'bulk-coupon-1',
        teamName: 'Team license (admin@company.com)',
        role: 'member',
        seatClaimedAt: expect.any(String),
      })
    })
  })

  describe('getRecentActivity', () => {
    it('returns activity with lesson progress', async () => {
      const now = new Date()
      const mockAllProgress = [
        {id: '1', completedAt: now, userId: 'user-1'},
        {id: '2', completedAt: now, userId: 'user-1'},
        {id: '3', completedAt: now, userId: 'user-1'},
      ]

      const mockRecentProgress = [
        {
          id: '3',
          userId: 'user-1',
          lessonSlug: 'typescript-generics',
          completedAt: now,
          updatedAt: now,
          createdAt: now,
        },
        {
          id: '2',
          userId: 'user-1',
          lessonSlug: 'mapped-types',
          completedAt: now,
          updatedAt: now,
          createdAt: now,
        },
      ]

      // First call: all completed progress
      mockPrisma.lessonProgress.findMany.mockResolvedValueOnce(
        mockAllProgress as any,
      )
      // Second call: recent progress
      mockPrisma.lessonProgress.findMany.mockResolvedValueOnce(
        mockRecentProgress as any,
      )

      const result = await integration.getRecentActivity!('user-1')

      expect(result.userId).toBe('user-1')
      expect(result.lessonsCompleted).toBe(3)
      expect(result.lastActiveAt).toBeDefined()
      expect(result.recentItems).toHaveLength(2)
      expect(result.recentItems[0].type).toBe('lesson_completed')
      expect(result.recentItems[0].title).toBe('typescript-generics')
    })

    it('returns empty activity for user with no progress', async () => {
      mockPrisma.lessonProgress.findMany.mockResolvedValue([])

      const result = await integration.getRecentActivity!('user-no-progress')

      expect(result.userId).toBe('user-no-progress')
      expect(result.lessonsCompleted).toBe(0)
      expect(result.recentItems).toEqual([])
    })
  })

  describe('getLicenseInfo', () => {
    it('returns individual license for non-bulk purchase', async () => {
      const mockPurchase = {
        id: 'purchase-1',
        userId: 'user-1',
        createdAt: new Date('2024-01-01'),
        bulkCoupon: null,
        user: {id: 'user-1', email: 'user@example.com'},
        product: {name: 'Total TypeScript Pro'},
      }

      mockPrisma.purchase.findUnique.mockResolvedValue(mockPurchase as any)

      const result = await integration.getLicenseInfo!('purchase-1')

      expect(result).toEqual({
        purchaseId: 'purchase-1',
        licenseType: 'individual',
        totalSeats: 1,
        claimedSeats: 1,
        availableSeats: 0,
        claimedBy: [
          {
            email: 'user@example.com',
            claimedAt: expect.any(String),
          },
        ],
        adminEmail: 'user@example.com',
      })
    })

    it('returns team license info for bulk purchase', async () => {
      const mockPurchase = {
        id: 'purchase-bulk',
        userId: 'admin-1',
        createdAt: new Date('2024-01-01'),
        bulkCoupon: {
          id: 'bulk-coupon-1',
          maxUses: 10,
        },
        user: {id: 'admin-1', email: 'admin@company.com'},
        product: {name: 'Total TypeScript Pro Team'},
      }

      const mockClaimedPurchases = [
        {
          id: 'claimed-1',
          createdAt: new Date('2024-01-15'),
          user: {id: 'member-1', email: 'member1@company.com'},
        },
        {
          id: 'claimed-2',
          createdAt: new Date('2024-01-16'),
          user: {id: 'member-2', email: 'member2@company.com'},
        },
      ]

      mockPrisma.purchase.findUnique.mockResolvedValue(mockPurchase as any)
      mockPrisma.purchase.findMany.mockResolvedValue(
        mockClaimedPurchases as any,
      )

      const result = await integration.getLicenseInfo!('purchase-bulk')

      expect(result).toEqual({
        purchaseId: 'purchase-bulk',
        licenseType: 'team',
        totalSeats: 10,
        claimedSeats: 2,
        availableSeats: 8,
        claimedBy: [
          {email: 'member1@company.com', claimedAt: expect.any(String)},
          {email: 'member2@company.com', claimedAt: expect.any(String)},
        ],
        adminEmail: 'admin@company.com',
      })
    })

    it('returns null for non-existent purchase', async () => {
      mockPrisma.purchase.findUnique.mockResolvedValue(null)

      const result = await integration.getLicenseInfo!('nonexistent')

      expect(result).toBeNull()
    })

    it('returns enterprise license for large seat count', async () => {
      const mockPurchase = {
        id: 'purchase-enterprise',
        userId: 'admin-1',
        createdAt: new Date('2024-01-01'),
        bulkCoupon: {
          id: 'bulk-coupon-enterprise',
          maxUses: 100,
        },
        user: {id: 'admin-1', email: 'admin@bigcorp.com'},
        product: {name: 'Enterprise License'},
      }

      mockPrisma.purchase.findUnique.mockResolvedValue(mockPurchase as any)
      mockPrisma.purchase.findMany.mockResolvedValue([])

      const result = await integration.getLicenseInfo!('purchase-enterprise')

      expect(result!.licenseType).toBe('enterprise')
      expect(result!.totalSeats).toBe(100)
    })
  })

  describe('getAppInfo', () => {
    it('returns Total TypeScript app info', async () => {
      const result = await integration.getAppInfo!()

      expect(result).toEqual({
        name: 'Total TypeScript',
        instructorName: 'Matt Pocock',
        supportEmail: 'team@totaltypescript.com',
        websiteUrl: 'https://www.totaltypescript.com',
        invoicesUrl: 'https://www.totaltypescript.com/invoices',
        discordUrl: 'https://totaltypescript.com/discord',
        refundPolicyUrl: 'https://www.totaltypescript.com/privacy',
      })
    })
  })
})
