import {inngest} from 'inngest/inngest.server'
import {prisma} from '@skillrecordings/database'
import {v4} from 'uuid'
import {loadSanityProduct} from './index'
import {SANITY_WEBHOOK_EVENT} from '../sanity-inngest-events'
import {paymentOptions} from 'pages/api/skill/[...skillRecordings]'
import {NonRetriableError} from 'inngest'

const stripe = paymentOptions.providers.stripe?.paymentClient

export const sanityProductUpdated = inngest.createFunction(
  {
    id: `product-update`,
    name: 'Update Product in Database',
    concurrency: 1,
    debounce: {
      key: 'event.data._id + "-" + event.data.event',
      period: '30s',
    },
  },
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.update"',
  },
  async ({event, step}) => {
    if (!stripe) {
      throw new NonRetriableError('Payment provider (Stripe) is missing')
    }

    const sanityProduct = await step.run('get sanity product', async () => {
      return loadSanityProduct(event.data._id)
    })

    const {
      productId,
      title,
      quantityAvailable,
      unitAmount,
      slug,
      image,
      upgradableTo,
      state,
      type,
      instructor,
    } = sanityProduct

    if (!productId) {
      throw new NonRetriableError(`Product id not found`)
    }

    const product = await step.run('get product in database', async () => {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        include: {
          prices: true,
        },
      })

      if (!product) {
        throw new Error(`Product not found [${productId}]`)
      }

      return product
    })

    const merchantProduct = await step.run('get merchant product', async () => {
      const merchantProduct = await prisma.merchantProduct.findFirst({
        where: {
          productId,
        },
      })

      if (!merchantProduct) {
        throw new Error(
          `Merchant Product not found for product id [${productId}]`,
        )
      }

      return merchantProduct
    })

    const currentProductUpgrades = await step.run(
      'get product upgrades',
      async () => {
        return await prisma.upgradableProducts.findMany({
          where: {
            upgradableFromId: product.id,
          },
        })
      },
    )

    const upgradeToIds = upgradableTo?.map(
      (upgradeToProduct) => upgradeToProduct.productId,
    )
    const currentProductUpgradeIds = currentProductUpgrades?.map(
      (currentProductUpgrade) => currentProductUpgrade.upgradableToId,
    )
    const upgradeToIdsMatch = upgradeToIds?.every((id) =>
      currentProductUpgradeIds?.includes(id),
    )

    if (!upgradeToIdsMatch) {
      await step.run('delete product upgrades', async () => {
        return await prisma.upgradableProducts.deleteMany({
          where: {
            upgradableFromId: product.id,
          },
        })
      })

      if (upgradableTo) {
        await step.run('create product upgrades', async () => {
          return await prisma.upgradableProducts.createMany({
            data: upgradableTo.map((upgradeToProduct) => ({
              upgradableFromId: product.id,
              upgradableToId: upgradeToProduct.productId,
            })),
          })
        })
      }
    }

    const stripeProduct = await step.run('get stripe product', async () => {
      if (!merchantProduct?.identifier) {
        throw new NonRetriableError('Merchant Product not found')
      }

      return await stripe.products.retrieve(merchantProduct.identifier)
    })

    const priceChanged = !product.prices
      .map((price) => Number(price.unitAmount))
      .includes(unitAmount)

    if (priceChanged) {
      const currentMerchantPrice = await step.run(
        'get current merchant price',
        async () => {
          return await prisma.merchantPrice.findFirst({
            where: {
              priceId: product.prices[0].id,
            },
          })
        },
      )

      const currentStripePrice = await step.run(
        'get stripe price',
        async () => {
          if (!currentMerchantPrice?.identifier) {
            throw new Error('Merchant Price not found')
          }
          return await stripe.prices.retrieve(currentMerchantPrice.identifier)
        },
      )

      const newStripePrice = await step.run(
        'create new stripe price',
        async () => {
          return await stripe.prices.create({
            unit_amount: Math.floor(Number(unitAmount) * 100),
            currency: 'usd',
            product: stripeProduct.id,
            active: true,
          })
        },
      )

      await step.run('set stripeProduct default price', async () => {
        return await stripe.products.update(stripeProduct.id, {
          default_price: newStripePrice.id,
        })
      })

      await step.run('create new merchant price', async () => {
        const newMerchantPriceId = v4()
        return await prisma.merchantPrice.create({
          data: {
            id: newMerchantPriceId,
            merchantProductId: merchantProduct.id,
            priceId: product.prices[0].id,
            merchantAccountId: merchantProduct.merchantAccountId,
            identifier: newStripePrice.id,
            status: 1,
          },
        })
      })

      if (currentMerchantPrice) {
        await step.run('deactivate old merchant price', async () => {
          return await prisma.merchantPrice.update({
            where: {
              id: currentMerchantPrice.id,
            },
            data: {
              status: 0,
            },
          })
        })
      }

      await step.run('update price in database', async () => {
        return await prisma.price.update({
          where: {
            id: product.prices[0].id,
          },
          data: {
            nickname: title,
            unitAmount,
          },
        })
      })

      if (currentStripePrice) {
        await step.run('deactivate stripe price', async () => {
          return await stripe.prices.update(currentStripePrice.id, {
            active: false,
          })
        })
      }
    }

    const updatedStripeProduct = await step.run(
      'update stripe product',
      async () => {
        return await stripe.products.update(stripeProduct.id, {
          name: title,
          active: true,
          ...(image && {images: [image.url]}),
          metadata: {
            slug,
          },
        })
      },
    )

    const updatedProduct = await step.run(
      'update product in database',
      async () => {
        return await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            name: title,
            quantityAvailable,
            status: state === 'active' ? 1 : 0,
            productType: type,
          },
          include: {
            prices: true,
            merchantProducts: true,
          },
        })
      },
    )

    const currentSplits = await step.run('get current splits', async () => {
      return await prisma.productRevenueSplit.findMany({
        where: {
          productId: product.id,
        },
      })
    })

    const splitsNeedUpdate = (
      currentSplits: any[],
      instructor: any,
      type: string,
    ): boolean => {
      const OWNER_ID = '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b'

      const currentContributorSplit = currentSplits.find(
        (split) => split.type === 'contributor',
      )

      const isOwnerInstructor = instructor?.userId === OWNER_ID
      const wasOwnerInstructor = !currentContributorSplit

      if (isOwnerInstructor !== wasOwnerInstructor) {
        return true
      }

      if (
        currentContributorSplit &&
        instructor?.userId !== currentContributorSplit.userId
      ) {
        return true
      }

      const currentProductType =
        currentSplits.length > 0 ? (currentSplits[0] as any).productType : null

      if (currentProductType !== type) {
        return true
      }

      return false
    }

    const needsSplitUpdate = await step.run(
      'check if splits need update',
      async () => {
        return splitsNeedUpdate(currentSplits, instructor, type)
      },
    )

    type SplitInfo = {
      type: string
      percent: number
      userId: string | undefined | null
    }

    type Splits = {
      skill: SplitInfo
      owner: SplitInfo
      contributor?: SplitInfo
    }

    if (needsSplitUpdate) {
      const defineSplits = await step.run(
        'define splits',
        async (): Promise<Splits> => {
          const OWNER_ID = '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b'
          const isOwnerInstructor = instructor?.userId === OWNER_ID
          const isSelfPaced = type === 'self-paced'

          let splits: Splits = {
            skill: {
              type: 'skill',
              percent: 0,
              userId: null,
            },
            owner: {
              type: 'owner',
              percent: 0,
              userId: OWNER_ID,
            },
          }

          if (isOwnerInstructor) {
            if (isSelfPaced) {
              splits.skill.percent = 0.4
              splits.owner.percent = 0.6
            } else {
              splits.skill.percent = 0.15
              splits.owner.percent = 0.85
            }
          } else {
            if (isSelfPaced) {
              splits.skill.percent = 0.5
              splits.owner.percent = 0.2
              splits.contributor = {
                type: 'contributor',
                percent: 0.3,
                userId: instructor?.userId,
              }
            } else {
              splits.skill.percent = 0.15
              splits.owner.percent = 0.15
              splits.contributor = {
                type: 'contributor',
                percent: 0.7,
                userId: instructor?.userId,
              }
            }
          }

          return splits
        },
      )

      await step.run('update splits in database', async () => {
        await prisma.productRevenueSplit.deleteMany({
          where: {
            productId: product.id,
          },
        })

        const skillSplit = await prisma.productRevenueSplit.create({
          data: {
            id: v4(),
            type: defineSplits.skill.type,
            productId: product.id,
            percent: defineSplits.skill.percent,
            userId: defineSplits.skill.userId,
          },
        })

        const ownerSplit = await prisma.productRevenueSplit.create({
          data: {
            id: v4(),
            type: defineSplits.owner.type,
            productId: product.id,
            percent: defineSplits.owner.percent,
            userId: defineSplits.owner.userId,
          },
        })

        let contributorSplit = null
        if (defineSplits.contributor) {
          contributorSplit = await prisma.productRevenueSplit.create({
            data: {
              id: v4(),
              type: defineSplits.contributor.type,
              productId: product.id,
              percent: defineSplits.contributor.percent,
              userId: defineSplits.contributor.userId,
            },
          })
        }

        return {
          skillSplit,
          ownerSplit,
          contributorSplit,
        }
      })
    }

    return {updatedProduct, updatedStripeProduct}
  },
)
