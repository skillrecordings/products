import {inngest} from 'inngest/inngest.server'
import {v4} from 'uuid'
import {prisma} from '@skillrecordings/database'
import {stripe} from '@skillrecordings/commerce-server'
import {loadSanityProduct} from './index'
import {sanityWriteClient} from 'utils/sanity-server'
import {SANITY_WEBHOOK_EVENT} from '../sanity-inngest-events'

export const sanityProductCreated = inngest.createFunction(
  {id: `product-create`, name: 'Create Product in Database'},
  {
    event: SANITY_WEBHOOK_EVENT,
    if: 'event.data.event == "product.create"',
  },
  async ({event, step}) => {
    const sanityProduct = await step.run('get sanity product', async () => {
      return loadSanityProduct(event.data._id)
    })

    const {
      title,
      quantityAvailable,
      unitAmount,
      slug,
      image,
      features,
      upgradableTo,
      state,
    } = sanityProduct

    const product = await step.run('create product in database', async () => {
      const newProductId = v4()
      return await prisma.product.create({
        data: {
          id: newProductId,
          name: title,
          quantityAvailable,
          status: state === 'active' ? 1 : 0,
        },
      })
    })

    await step.run('update productId in sanity', async () => {
      return await sanityWriteClient
        .patch(event.data._id)
        .set({
          productId: product.id,
          ...(!features && {features: getDefaultProductFeatures()}),
        })
        .commit()
    })

    const price = await step.run('create price in database', async () => {
      const newPriceId = v4()
      return await prisma.price.create({
        data: {
          id: newPriceId,
          unitAmount,
          productId: product.id,
          nickname: title,
        },
      })
    })

    const merchantAccount = await step.run('get merchant account', async () => {
      return await prisma.merchantAccount.findFirst({
        where: {
          label: 'stripe',
        },
      })
    })

    if (merchantAccount) {
      const stripeProduct = await step.run(
        'create stripe product',
        async () => {
          return await stripe.products.create({
            name: product.name,
            ...(image && {images: [image.url]}),
            metadata: {
              slug,
            },
          })
        },
      )

      const stripePrice = await step.run('create stripe price', async () => {
        return await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: Math.floor(Number(unitAmount) * 100),
          currency: 'usd',
          nickname: title,
          metadata: {
            slug,
          },
        })
      })

      const merchantProduct = await step.run(
        'create merchant product in database',
        async () => {
          const newMerchantProductId = v4()
          return await prisma.merchantProduct.create({
            data: {
              id: newMerchantProductId,
              productId: product.id,
              merchantAccountId: merchantAccount.id,
              identifier: stripeProduct.id,
            },
          })
        },
      )

      const merchantPrice = await step.run(
        'create merchant product in database',
        async () => {
          const newMerchantPriceId = v4()
          return await prisma.merchantPrice.create({
            data: {
              id: newMerchantPriceId,
              merchantProductId: merchantProduct.id,
              priceId: price.id,
              merchantAccountId: merchantAccount.id,
              identifier: stripePrice.id,
            },
          })
        },
      )

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

      return {
        product,
        merchantProduct,
        merchantPrice,
        price,
        stripeProduct,
        stripePrice,
      }
    } else {
      throw new Error('No merchant account found')
    }
  },
)

const getDefaultProductFeatures = () =>
  [
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M6.75146 12.1765C6.58598 12.1764 6.42728 12.1107 6.31028 11.9936L3.1902 8.87356C3.1306 8.81599 3.08306 8.74714 3.05036 8.671C3.01765 8.59487 3.00044 8.51299 2.99972 8.43013C2.999 8.34728 3.01479 8.26511 3.04616 8.18842C3.07754 8.11173 3.12387 8.04205 3.18247 7.98346C3.24106 7.92487 3.31073 7.87854 3.38742 7.84716C3.46411 7.81579 3.54628 7.8 3.62913 7.80072C3.71199 7.80144 3.79387 7.81865 3.87001 7.85135C3.94614 7.88406 4.015 7.9316 4.07256 7.9912L6.6641 10.5821L11.8547 3.08518C11.9004 3.01568 11.9595 2.95603 12.0287 2.90973C12.0978 2.86343 12.1754 2.83142 12.2571 2.81557C12.3388 2.79972 12.4228 2.80036 12.5042 2.81745C12.5856 2.83453 12.6628 2.86773 12.7311 2.91507C12.7995 2.96242 12.8578 3.02296 12.9024 3.09314C12.9471 3.16332 12.9773 3.24172 12.9912 3.32373C13.0051 3.40574 13.0025 3.48971 12.9835 3.57069C12.9645 3.65168 12.9295 3.72805 12.8806 3.79531L7.26441 11.9075C7.21268 11.9831 7.14494 12.0464 7.06599 12.0929C6.98705 12.1394 6.89884 12.1679 6.80763 12.1765C6.78891 12.1765 6.77018 12.1765 6.75146 12.1765Z" fill="#3A80F5"/> </svg>',
      value: '1 Self-Paced Workshop',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8 8.00001C9.364 9.36401 11.068 10.727 12.773 10.727C14.279 10.727 15.5 9.50601 15.5 8.00001C15.5 6.49401 14.279 5.27301 12.773 5.27301C11.068 5.27301 9.364 6.63601 8 8.00001ZM8 8.00001C6.636 6.63601 4.932 5.27301 3.227 5.27301C1.721 5.27301 0.5 6.49401 0.5 8.00001C0.5 9.50601 1.721 10.727 3.227 10.727C4.932 10.727 6.636 9.36401 8 8.00001Z" stroke="#3A80F5" stroke-miterlimit="10" stroke-linecap="square" stroke-linejoin="round"/> </svg>',
      value: 'Lifetime Access',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M9.5 15.5V10.5H14.5" stroke="#3A80F5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> <path d="M9.5 15.5H1.5V0.5H14.5V10.5L9.5 15.5Z" stroke="#3A80F5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
      value: 'Customizable invoice',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_664_2048)"> <path d="M4.5 15.5H11.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.5 3.5L11.5 6.5L6.5 9.5V3.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M15.5 0.5H0.5V12.5H15.5V0.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <clipPath id="clip0_664_2048"> <rect width="16" height="16" fill="white"/> </clipPath> </defs> </svg>',
      value: 'Streaming 4K Video',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.5 13.5H15.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M0.5 1.5L6.5 7.5L0.5 13.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
      value: '30 Interactive Exercises',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <g clip-path="url(#clip0_664_2054)"> <path d="M8 15.5C12.1421 15.5 15.5 12.1421 15.5 8C15.5 3.85786 12.1421 0.5 8 0.5C3.85786 0.5 0.5 3.85786 0.5 8C0.5 12.1421 3.85786 15.5 8 15.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.833 5.738C6.50006 5.57448 6.13286 5.49288 5.762 5.5C3.976 5.5 3.5 6.81 3.5 8C3.5 9.19 3.976 10.5 5.762 10.5C6.13286 10.5071 6.50006 10.4255 6.833 10.262" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.833 5.738C11.5001 5.57448 11.1329 5.49288 10.762 5.5C8.976 5.5 8.5 6.81 8.5 8C8.5 9.19 8.976 10.5 10.762 10.5C11.1329 10.5071 11.5001 10.4255 11.833 10.262" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> </g> <defs> <clipPath id="clip0_664_2054"> <rect width="16" height="16" fill="white"/> </clipPath> </defs> </svg>',
      value: 'English Transcripts & Subtitles',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 14.5L13 1.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M4.5 6.5C5.88071 6.5 7 5.38071 7 4C7 2.61929 5.88071 1.5 4.5 1.5C3.11929 1.5 2 2.61929 2 4C2 5.38071 3.11929 6.5 4.5 6.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11.5 14.5C12.8807 14.5 14 13.3807 14 12C14 10.6193 12.8807 9.5 11.5 9.5C10.1193 9.5 9 10.6193 9 12C9 13.3807 10.1193 14.5 11.5 14.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
      value: 'Progress Tracking',
    },
    {
      icon: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M8.5 13.5V10.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M6.5 13.5H10.5C11.0304 13.5 11.5391 13.7107 11.9142 14.0858C12.2893 14.4609 12.5 14.9696 12.5 15.5H4.5C4.5 14.9696 4.71071 14.4609 5.08579 14.0858C5.46086 13.7107 5.96957 13.5 6.5 13.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M12.5 1.5H15.5V4.5C15.5 5.29565 15.1839 6.05871 14.6213 6.62132C14.0587 7.18393 13.2956 7.5 12.5 7.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M4.5 1.5H1.5V4.5C1.5 5.29565 1.81607 6.05871 2.37868 6.62132C2.94129 7.18393 3.70435 7.5 4.5 7.5" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> <path d="M4.5 0.5H12.5V6.5C12.5 7.56087 12.0786 8.57828 11.3284 9.32843C10.5783 10.0786 9.56087 10.5 8.5 10.5C7.43913 10.5 6.42172 10.0786 5.67157 9.32843C4.92143 8.57828 4.5 7.56087 4.5 6.5V0.5Z" stroke="#3A80F5" stroke-linecap="round" stroke-linejoin="round"/> </svg>',
      value: 'Completion Certificate',
    },
  ].map((feature) => ({
    ...feature,
    _key: v4(),
    _type: 'feature',
  }))
