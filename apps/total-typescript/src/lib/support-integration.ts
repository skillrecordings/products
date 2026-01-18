/**
 * Support Platform Integration for Total TypeScript
 *
 * Implements the SupportIntegration interface from @skillrecordings/sdk
 * to enable the support agent to look up users, fetch purchases, and
 * perform actions like refunds and license transfers.
 */
import type {
  SupportIntegration,
  User,
  Purchase,
  ActionResult,
  ClaimedSeat,
} from '@skillrecordings/sdk/integration'
import {prisma} from '@skillrecordings/database'
import {createVerificationUrl} from '@skillrecordings/skill-api'
import {nextAuthOptions} from '../pages/api/auth/[...nextauth]'

/**
 * Map TT purchase status to SDK status
 */
function mapPurchaseStatus(
  status: string,
): 'active' | 'refunded' | 'transferred' {
  switch (status) {
    case 'Refunded':
      return 'refunded'
    case 'Transferred':
      return 'transferred'
    case 'Valid':
    case 'Restricted':
    case 'Pending':
    default:
      return 'active'
  }
}

/**
 * Total TypeScript SupportIntegration implementation
 */
export const integration: SupportIntegration = {
  /**
   * Look up user by email address
   */
  async lookupUser(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {email},
    })

    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
      createdAt: new Date(),
    }
  },

  /**
   * Fetch all purchases for a user
   */
  async getPurchases(userId: string): Promise<Purchase[]> {
    const purchases = await prisma.purchase.findMany({
      where: {userId},
      include: {
        product: true,
        merchantCharge: true,
      },
      orderBy: {createdAt: 'desc'},
    })

    return purchases.map((p) => ({
      id: p.id,
      productId: p.productId,
      productName: p.product?.name ?? 'Unknown Product',
      purchasedAt: new Date(p.createdAt),
      amount: Number(p.totalAmount) * 100, // Convert to cents for consistency
      currency: 'USD',
      stripeChargeId: p.merchantCharge?.identifier ?? undefined,
      status: mapPurchaseStatus(p.status ?? 'Valid'),
    }))
  },

  /**
   * Revoke access after refund
   *
   * Updates the purchase status to 'Refunded' and stores the refund reason.
   * The actual Stripe refund is processed by the app's Stripe webhook handler,
   * this just updates our internal state.
   */
  async revokeAccess({
    purchaseId,
    reason,
    refundId,
  }: {
    purchaseId: string
    reason: string
    refundId: string
  }): Promise<ActionResult> {
    try {
      await prisma.purchase.update({
        where: {id: purchaseId},
        data: {
          status: 'Refunded',
          // Store refund metadata in a way that's compatible with TT's schema
          // The merchantCharge already has refundAmount from Stripe webhook
        },
      })

      // Log the refund for audit trail
      console.log(
        `[support-integration] Access revoked for purchase ${purchaseId}. Reason: ${reason}. RefundId: ${refundId}`,
      )

      return {success: true}
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {success: false, error: message}
    }
  },

  /**
   * Transfer purchase to a different user
   *
   * TT has a PurchaseUserTransfer model with state machine.
   * For support platform transfers, we do a direct transfer since
   * the support agent has already verified the request.
   */
  async transferPurchase({
    purchaseId,
    fromUserId,
    toEmail,
  }: {
    purchaseId: string
    fromUserId: string
    toEmail: string
  }): Promise<ActionResult> {
    try {
      // Find or create the target user
      let targetUser = await prisma.user.findUnique({
        where: {email: toEmail},
      })

      if (!targetUser) {
        // Create a new user for the recipient
        targetUser = await prisma.user.create({
          data: {
            email: toEmail,
          },
        })
      }

      // Verify the purchase belongs to fromUserId
      const purchase = await prisma.purchase.findUnique({
        where: {id: purchaseId},
      })

      if (!purchase) {
        return {success: false, error: 'Purchase not found'}
      }

      if (purchase.userId !== fromUserId) {
        return {
          success: false,
          error: 'Purchase does not belong to source user',
        }
      }

      // Create transfer record for audit trail
      await prisma.purchaseUserTransfer.create({
        data: {
          purchaseId,
          sourceUserId: fromUserId,
          targetUserId: targetUser.id,
          transferState: 'COMPLETED',
          completedAt: new Date(),
        },
      })

      // Update purchase ownership
      await prisma.purchase.update({
        where: {id: purchaseId},
        data: {
          userId: targetUser.id,
          status: 'Valid', // Reset status in case it was 'Transferred'
        },
      })

      console.log(
        `[support-integration] Purchase ${purchaseId} transferred from ${fromUserId} to ${targetUser.id} (${toEmail})`,
      )

      return {success: true}
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {success: false, error: message}
    }
  },

  /**
   * Generate a magic link for passwordless login
   *
   * Uses skill-api's createVerificationUrl which creates a VerificationToken
   * and returns a NextAuth-compatible magic link URL.
   */
  async generateMagicLink({
    email,
    expiresIn,
  }: {
    email: string
    expiresIn: number
  }): Promise<{url: string}> {
    // Calculate expiration date
    const expiresAt = new Date(Date.now() + expiresIn * 1000)

    const verificationDetails = await createVerificationUrl({
      email,
      nextAuthOptions,
      expiresAt,
    })

    if (!verificationDetails) {
      throw new Error('Unable to create verification URL')
    }

    return {url: verificationDetails.url}
  },

  /**
   * Update user's email address
   */
  async updateEmail({
    userId,
    newEmail,
  }: {
    userId: string
    newEmail: string
  }): Promise<ActionResult> {
    try {
      // Check if email is already in use
      const existingUser = await prisma.user.findUnique({
        where: {email: newEmail},
      })

      if (existingUser && existingUser.id !== userId) {
        return {success: false, error: 'Email already in use by another user'}
      }

      await prisma.user.update({
        where: {id: userId},
        data: {email: newEmail},
      })

      console.log(
        `[support-integration] Email updated for user ${userId} to ${newEmail}`,
      )

      return {success: true}
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {success: false, error: message}
    }
  },

  /**
   * Update user's display name
   */
  async updateName({
    userId,
    newName,
  }: {
    userId: string
    newName: string
  }): Promise<ActionResult> {
    try {
      await prisma.user.update({
        where: {id: userId},
        data: {name: newName},
      })

      return {success: true}
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {success: false, error: message}
    }
  },

  /**
   * Get claimed seats for a team/bulk purchase
   *
   * In TT, bulk purchases use bulkCouponId. Users who redeem a seat
   * have a purchase with redeemedBulkCouponId pointing to the bulk coupon.
   */
  async getClaimedSeats(bulkCouponId: string): Promise<ClaimedSeat[]> {
    // Find all purchases that redeemed this bulk coupon
    const claimedPurchases = await prisma.purchase.findMany({
      where: {
        redeemedBulkCouponId: bulkCouponId,
      },
      include: {
        user: true,
      },
    })

    return claimedPurchases
      .filter((p) => p.user)
      .map((p) => ({
        userId: p.user!.id,
        email: p.user!.email,
        claimedAt: new Date(p.createdAt),
      }))
  },
}
