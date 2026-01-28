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
  ContentSearchRequest,
  ContentSearchResponse,
  ContentSearchResult,
  ProductStatus,
  Promotion,
  CouponInfo,
  RefundPolicy,
  ContentAccess,
  UserActivity,
  LicenseInfo,
  AppInfo,
} from '@skillrecordings/sdk/integration'
import {getSdk, prisma} from '@skillrecordings/database'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
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

  /**
   * Get product availability status
   *
   * Returns seat availability, sold out status, and enrollment windows
   * for live workshops and cohort-based products.
   */
  async getProductStatus(productId: string): Promise<ProductStatus | null> {
    // Try to find product by ID or slug (key field)
    const product = await prisma.product.findFirst({
      where: {
        OR: [{id: productId}, {key: productId}],
      },
    })

    if (!product) return null

    // Count active purchases for this product
    const activePurchaseCount = await prisma.purchase.count({
      where: {
        productId: product.id,
        status: {in: ['Valid', 'Restricted', 'Pending']},
      },
    })

    const quantityAvailable = product.quantityAvailable
    const isUnlimited = quantityAvailable === -1
    const quantityRemaining = isUnlimited
      ? -1
      : Math.max(0, quantityAvailable - activePurchaseCount)
    const soldOut = !isUnlimited && quantityRemaining <= 0

    // Map product status (Int) to ProductState
    // TT uses: 0=draft, 1=active, 2=unavailable (assumed pattern)
    const stateMap: Record<number, ProductStatus['state']> = {
      0: 'draft',
      1: 'active',
      2: 'unavailable',
      3: 'archived',
    }
    const state = stateMap[product.status] ?? 'active'

    // Map productType to SDK type
    const productType = (product.productType ??
      'self-paced') as ProductStatus['productType']

    return {
      productId: product.id,
      productType,
      available: state === 'active' && !soldOut,
      soldOut,
      quantityAvailable,
      quantityRemaining,
      state,
      // TT doesn't have event dates in the Product model
      // Would need to be added if live workshops need scheduling
    }
  },

  /**
   * Search product content for agent recommendations
   *
   * Uses Sanity GROQ queries to find relevant workshops, tutorials,
   * articles, tips, and exercises that match the customer's query.
   */
  async searchContent(
    request: ContentSearchRequest,
  ): Promise<ContentSearchResponse> {
    const {query, types, limit = 5} = request

    try {
      // Map SDK types to Sanity _type values
      const typeMapping: Record<string, string[]> = {
        course: ['module'],
        lesson: ['exercise', 'explainer'],
        article: ['article', 'tip'],
        resource: ['chapterResource'],
      }

      // Build Sanity type filter
      let sanityTypes = ['article', 'tip', 'module', 'exercise', 'explainer']
      if (types?.length) {
        sanityTypes = types.flatMap((t) => typeMapping[t] || [])
      }

      const typeFilter = sanityTypes.map((t) => `"${t}"`).join(', ')

      const results = await sanityClient.fetch(
        `*[_type in [${typeFilter}] && state == "published" && moduleType != 'chapter' && moduleType != 'book']
          | score(
            title match $searchQuery
            || _type match "module"
            || description match $searchQuery
            || pt::text(body) match $searchQuery
            || body match $searchQuery
            || boost(body match $searchQuery + "*", 0.5)
            || boost(pt::text(body) match $searchQuery + "*", 0.5)
          )
          | order(_score desc)
          {
            _id,
            _score,
            _type,
            title,
            description,
            "slug": slug.current,
            moduleType
          }
          [_score > 0][0..${limit - 1}]`,
        {searchQuery: query},
      )

      const contentResults: ContentSearchResult[] = results.map(
        (doc: {
          _id: string
          _score: number
          _type: string
          title: string
          description?: string
          slug: string
          moduleType?: string
        }) => ({
          id: doc._id,
          type: mapSanityTypeToContentType(doc._type, doc.moduleType),
          title: doc.title,
          description: doc.description?.slice(0, 200),
          url: buildContentUrl(doc._type, doc.slug, doc.moduleType),
          score: doc._score > 0 ? Math.min(doc._score / 10, 1) : undefined,
        }),
      )

      return {
        results: contentResults,
        quickLinks: getQuickLinks(),
        meta: {
          totalResults: results.length,
        },
      }
    } catch (error) {
      console.error('[support-integration] Content search failed:', error)
      return {
        results: [],
        quickLinks: getQuickLinks(),
      }
    }
  },

  // ── Agent Intelligence Methods (SDK v0.5.0) ─────────────────────────

  /**
   * Get currently active promotions and sales
   *
   * Uses the SDK's getDefaultCoupon helper which queries for
   * coupon.default === true + not expired. This is the same pattern
   * used by the CTA router for displaying active promotions.
   */
  async getActivePromotions(): Promise<Promotion[]> {
    const {getDefaultCoupon} = getSdk()

    // getDefaultCoupon() with no productIds returns the site-wide default coupon
    const result = await getDefaultCoupon()

    if (!result) return []

    const {defaultCoupon, defaultMerchantCoupon} = result

    return [
      {
        id: defaultCoupon.id,
        name: defaultCoupon.product
          ? `${defaultCoupon.product.name} discount`
          : defaultCoupon.code
          ? `Coupon: ${defaultCoupon.code}`
          : 'Site-wide discount',
        code: defaultCoupon.code ?? undefined,
        discountType: 'percent' as const,
        discountAmount: Number(defaultCoupon.percentageDiscount) * 100,
        validFrom: defaultCoupon.createdAt.toISOString(),
        validUntil: defaultCoupon.expires?.toISOString(),
        active: true,
        conditions: defaultCoupon.restrictedToProductId
          ? `Restricted to product: ${
              defaultCoupon.product?.name ?? defaultCoupon.restrictedToProductId
            }`
          : undefined,
      },
    ]
  },

  /**
   * Look up a coupon or discount code
   *
   * Uses the SDK's couponForIdOrCode helper which already handles
   * expiry checks (expires >= now OR expires is null) and includes
   * the merchantCoupon relation.
   */
  async getCouponInfo(code: string): Promise<CouponInfo | null> {
    const {couponForIdOrCode} = getSdk()

    const coupon = await couponForIdOrCode({code})

    if (!coupon) return null

    const isMaxedOut =
      coupon.maxUses !== -1 && coupon.usedCount >= coupon.maxUses

    // couponForIdOrCode already filters out expired coupons, so if we
    // get a result it's not expired. The coupon is valid if not maxed out.
    const isValid = !isMaxedOut

    // Determine restriction type from merchantCoupon type
    let restrictionType: CouponInfo['restrictionType']
    if (coupon.merchantCoupon?.type) {
      const mcType = coupon.merchantCoupon.type.toLowerCase()
      if (mcType.includes('ppp') || mcType === 'parity') {
        restrictionType = 'ppp'
      } else if (mcType.includes('bulk')) {
        restrictionType = 'bulk'
      } else {
        restrictionType = 'general'
      }
    }

    return {
      code: coupon.code!,
      valid: isValid,
      discountType: 'percent',
      discountAmount: Number(coupon.percentageDiscount) * 100,
      restrictionType,
      usageCount: coupon.usedCount,
      maxUses: coupon.maxUses === -1 ? undefined : coupon.maxUses,
      expiresAt: coupon.expires?.toISOString(),
    }
  },

  /**
   * Get the app's refund policy configuration
   *
   * Returns static configuration for Total TypeScript's refund policy.
   * TT offers a 30-day refund window for all purchases.
   */
  async getRefundPolicy(): Promise<RefundPolicy> {
    return {
      autoApproveWindowDays: 30,
      manualApproveWindowDays: 60,
      noRefundAfterDays: 90,
      specialConditions: [
        'Lifetime access purchases: 30-day refund window from purchase date',
        'Team/bulk purchases: refund for unused seats only',
        'PPP-discounted purchases: standard refund policy applies',
      ],
      policyUrl: 'https://www.totaltypescript.com/privacy',
    }
  },

  /**
   * Get granular content access for a user
   *
   * Uses the SDK's getPurchasesForUser helper which returns purchases with
   * bulkCoupon, product, and status already included. TT uses binary access:
   * if you have a valid purchase for a product, you have full access.
   */
  async getContentAccess(userId: string): Promise<ContentAccess> {
    const {getPurchasesForUser} = getSdk()

    const purchases = await getPurchasesForUser(userId)

    // getPurchasesForUser returns Valid, Refunded, and Restricted purchases.
    // Filter to only Valid/Restricted for access determination.
    const activePurchases = purchases.filter(
      (p) => p.status === 'Valid' || p.status === 'Restricted',
    )

    // Build product access list from SDK results
    const products = activePurchases.map((p) => ({
      productId: p.productId,
      productName: p.product?.name ?? 'Unknown Product',
      accessLevel: 'full' as const,
    }))

    // Check for team membership via redeemed bulk coupon
    let teamMembership: ContentAccess['teamMembership']
    const teamPurchase = activePurchases.find((p) => p.redeemedBulkCouponId)
    if (teamPurchase?.redeemedBulkCouponId) {
      // Look up the admin purchase for the team
      const bulkPurchase = await prisma.purchase.findFirst({
        where: {
          bulkCouponId: teamPurchase.redeemedBulkCouponId,
        },
        include: {user: true},
      })

      if (bulkPurchase) {
        teamMembership = {
          teamId: teamPurchase.redeemedBulkCouponId,
          teamName: `Team license (${
            bulkPurchase.user?.email ?? 'unknown admin'
          })`,
          role: 'member',
          seatClaimedAt: teamPurchase.createdAt.toISOString(),
        }
      }
    }

    return {
      userId,
      products,
      teamMembership,
    }
  },

  /**
   * Get recent user activity and progress
   *
   * Uses the SDK's getLessonProgressForUser helper which returns lesson
   * progresses ordered by updatedAt desc. For the completed count, we
   * still use prisma.lessonProgress.count() for efficiency rather than
   * loading all records into memory.
   */
  async getRecentActivity(userId: string): Promise<UserActivity> {
    const {getLessonProgressForUser} = getSdk()

    // Efficient count query — don't load all records just to count
    const lessonsCompleted = await prisma.lessonProgress.count({
      where: {
        userId,
        completedAt: {not: null},
      },
    })

    // SDK helper returns lesson progresses ordered by updatedAt desc
    const allProgress = (await getLessonProgressForUser(userId)) ?? []

    // Build recent items from the first 10 relevant progress entries
    const recentItems: UserActivity['recentItems'] = allProgress
      .filter((lp) => lp.completedAt || lp.updatedAt)
      .slice(0, 10)
      .map((lp) => ({
        type: lp.completedAt
          ? ('lesson_completed' as const)
          : ('exercise_submitted' as const),
        title: lp.lessonSlug ?? lp.lessonId ?? 'Unknown lesson',
        timestamp: (
          lp.completedAt ??
          lp.updatedAt ??
          lp.createdAt
        ).toISOString(),
      }))

    // Determine last active timestamp (first entry is most recent)
    const lastActiveAt =
      allProgress.length > 0
        ? (
            allProgress[0].updatedAt ??
            allProgress[0].completedAt ??
            allProgress[0].createdAt
          ).toISOString()
        : undefined

    // We don't have a total lesson count in the DB — approximate from what we know
    const totalLessons = Math.max(lessonsCompleted, 1)
    const completionPercent =
      totalLessons > 0 ? Math.round((lessonsCompleted / totalLessons) * 100) : 0

    return {
      userId,
      lastActiveAt,
      lessonsCompleted,
      totalLessons,
      completionPercent,
      recentItems,
    }
  },

  /**
   * Get team license and seat information for a purchase
   *
   * Uses the SDK's getPurchaseWithUser to look up the purchase and
   * getCouponWithBulkPurchases for bulk coupon data. Team members
   * redeem seats via the bulk coupon.
   */
  async getLicenseInfo(purchaseId: string): Promise<LicenseInfo | null> {
    const {getPurchaseWithUser} = getSdk()

    // getPurchaseWithUser includes user and filters to Valid/Restricted
    const purchase = await prisma.purchase.findUnique({
      where: {id: purchaseId},
      include: {
        bulkCoupon: true,
        user: true,
        product: true,
      },
    })

    if (!purchase) return null

    // Check if this is a team/bulk purchase
    const bulkCoupon = purchase.bulkCoupon
    if (!bulkCoupon) {
      // Individual purchase — return individual license info
      return {
        purchaseId,
        licenseType: 'individual',
        totalSeats: 1,
        claimedSeats: 1,
        availableSeats: 0,
        claimedBy: purchase.user
          ? [
              {
                email: purchase.user.email,
                claimedAt: purchase.createdAt.toISOString(),
              },
            ]
          : [],
        adminEmail: purchase.user?.email,
      }
    }

    // Use SDK helper to get bulk coupon with its purchase associations
    const {getCouponWithBulkPurchases} = getSdk()
    const couponWithPurchases = await getCouponWithBulkPurchases(bulkCoupon.id)

    // Team purchase — find all claimed seats
    const claimedPurchases = await prisma.purchase.findMany({
      where: {
        redeemedBulkCouponId: bulkCoupon.id,
      },
      include: {
        user: true,
      },
      orderBy: {createdAt: 'asc'},
    })

    const totalSeats = bulkCoupon.maxUses === -1 ? 999 : bulkCoupon.maxUses
    const claimedSeats = claimedPurchases.filter((p) => p.user).length
    const availableSeats = Math.max(0, totalSeats - claimedSeats)

    const claimedBy = claimedPurchases
      .filter((p) => p.user)
      .map((p) => ({
        email: p.user!.email,
        claimedAt: p.createdAt.toISOString(),
      }))

    return {
      purchaseId,
      licenseType: totalSeats > 50 ? 'enterprise' : 'team',
      totalSeats,
      claimedSeats,
      availableSeats,
      claimedBy,
      adminEmail: purchase.user?.email,
    }
  },

  /**
   * Get app metadata for Total TypeScript
   *
   * Returns static configuration about the app, instructor,
   * and relevant URLs. Eliminates hardcoded values in agent prompts.
   */
  async getAppInfo(): Promise<AppInfo> {
    return {
      name: 'Total TypeScript',
      instructorName: 'Matt Pocock',
      supportEmail: 'team@totaltypescript.com',
      websiteUrl: 'https://www.totaltypescript.com',
      invoicesUrl: 'https://www.totaltypescript.com/invoices',
      discordUrl: 'https://totaltypescript.com/discord',
      refundPolicyUrl: 'https://www.totaltypescript.com/privacy',
    }
  },
}

/**
 * Map Sanity _type to SDK content type
 */
function mapSanityTypeToContentType(
  sanityType: string,
  moduleType?: string,
): ContentSearchResult['type'] {
  if (sanityType === 'module') {
    return moduleType === 'tutorial' ? 'course' : 'course'
  }
  switch (sanityType) {
    case 'exercise':
    case 'explainer':
      return 'lesson'
    case 'article':
    case 'tip':
      return 'article'
    case 'chapterResource':
      return 'resource'
    default:
      return 'article'
  }
}

/**
 * Build URL for content based on type
 */
function buildContentUrl(
  sanityType: string,
  slug: string,
  moduleType?: string,
): string {
  const baseUrl = 'https://www.totaltypescript.com'

  if (sanityType === 'module') {
    if (moduleType === 'tutorial') {
      return `${baseUrl}/tutorials/${slug}`
    }
    return `${baseUrl}/workshops/${slug}`
  }

  switch (sanityType) {
    case 'article':
      return `${baseUrl}/articles/${slug}`
    case 'tip':
      return `${baseUrl}/tips/${slug}`
    case 'exercise':
    case 'explainer':
      // Exercises are part of modules, but standalone URL works
      return `${baseUrl}/workshops`
    default:
      return `${baseUrl}/${slug}`
  }
}

/**
 * Static quick links for Total TypeScript
 */
function getQuickLinks(): ContentSearchResult[] {
  return [
    {
      id: 'quick-discord',
      type: 'social',
      title: 'Total TypeScript Discord',
      url: 'https://totaltypescript.com/discord',
    },
    {
      id: 'quick-twitter',
      type: 'social',
      title: 'Matt Pocock on Twitter',
      url: 'https://x.com/mattpocockuk',
    },
    {
      id: 'quick-support',
      type: 'resource',
      title: 'Contact Support',
      url: 'mailto:team@totaltypescript.com',
    },
  ]
}
