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
    },
    purchaseUserTransfer: {
      create: jest.fn(),
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
})
