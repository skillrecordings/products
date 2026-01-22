import {inngest} from 'inngest/inngest.server'
import {NEW_PURCHASE_CREATED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import groq from 'groq'

export const liveEventBundle = inngest.createFunction(
  {
    id: 'live-event-bundle',
    name: 'Post-Purchase - Live Event Bundle',
  },
  {
    event: NEW_PURCHASE_CREATED_EVENT,
  },
  async ({event, step}) => {
    const {purchaseId, productId} = event.data

    // Load the purchase
    const purchase = await step.run('load purchase', async () => {
      const purchase = await prisma.purchase.findUnique({
        where: {
          id: purchaseId,
        },
        include: {
          user: true,
        },
      })

      if (!purchase) throw new Error('Purchase not found')

      return purchase
    })

    // Skip if this is a team/bulk purchase
    const isNotTeamPurchase = purchase.bulkCouponId === null

    if (!isNotTeamPurchase) {
      return {message: 'Skipping team purchase'}
    }

    // Load the product from Sanity to check if it's a live bundle
    const product = await step.run('load product from sanity', async () => {
      const product = await sanityClient.fetch(
        groq`*[_type == "product" && productId == $productId][0] {
          _id,
          _type,
          productId,
          type,
          title,
          "slug": slug.current,
          "modules": modules[]->{
            _id,
            _type,
            "slug": slug.current,
            title
          }
        }`,
        {productId},
      )

      return product
    })

    if (!product) {
      return {message: 'Product not found in Sanity'}
    }

    // Check if this is a live product
    if (product.type !== 'live') {
      return {message: 'Not a live product'}
    }

    // Filter modules to only events
    const eventModules = (product.modules || []).filter(
      (module: any) => module._type === 'event',
    )

    // Check if this is a bundle (has more than 1 event)
    if (eventModules.length <= 1) {
      return {message: 'Not a bundle (has 1 or fewer events)'}
    }

    // Filter out the bundle event itself
    // The bundle event is the one that matches the bundle product's slug
    // OR the one that doesn't have an individual product (only has bundle products)
    const individualEventModules = []

    for (const eventModule of eventModules) {
      // Check if this event has an individual product (exactly 1 event in modules)
      const hasIndividualProduct = await step.run(
        `check if event has individual product: ${
          eventModule.title || eventModule.slug
        }`,
        async () => {
          const individualProduct = await sanityClient.fetch(
            groq`*[_type == "product" 
              && type == "live" 
              && references($eventId)
              && count(modules[@->._type == "event"]) == 1
            ][0] {
              _id,
              productId
            }`,
            {eventId: eventModule._id},
          )

          return !!individualProduct
        },
      )

      // Only include events that have individual products (skip the bundle event itself)
      if (hasIndividualProduct) {
        individualEventModules.push(eventModule)
      } else {
        console.log(
          `Skipping bundle event: ${
            eventModule.title || eventModule.slug
          } (no individual product found)`,
        )
      }
    }

    // For each individual event, find the individual product and create a purchase
    const results: Array<{
      event: string
      product?: string
      status: string
      reason?: string
      purchaseId?: string
    }> = []

    for (const eventModule of individualEventModules) {
      await step.run(
        `process event: ${eventModule.title || eventModule.slug}`,
        async () => {
          // Find the individual product for this event
          // Individual product = product that references this event AND has only 1 event in modules
          const individualProduct = await sanityClient.fetch(
            groq`*[_type == "product" 
              && type == "live" 
              && references($eventId)
              && count(modules[@->._type == "event"]) == 1
            ][0] {
              _id,
              productId,
              title,
              "slug": slug.current
            }`,
            {eventId: eventModule._id},
          )

          if (!individualProduct || !individualProduct.productId) {
            console.warn(
              `No individual product found for event: ${
                eventModule.title || eventModule.slug
              }`,
            )
            results.push({
              event: eventModule.title || eventModule.slug,
              status: 'skipped',
              reason: 'no_individual_product',
            })
            return
          }

          // Check if user already has a purchase for this individual product
          const existingPurchase = await prisma.purchase.findFirst({
            where: {
              userId: purchase.userId,
              productId: individualProduct.productId,
              status: {
                in: ['Valid', 'Restricted'],
              },
            },
          })

          if (existingPurchase) {
            console.log(
              `User already has purchase for ${individualProduct.title}`,
            )
            results.push({
              event: eventModule.title || eventModule.slug,
              product: individualProduct.title,
              status: 'skipped',
              reason: 'duplicate_purchase',
            })
            return
          }

          // Create purchase record for the individual product
          const newPurchaseId = `${purchaseId}~${individualProduct.productId}`

          await prisma.purchase.create({
            data: {
              id: newPurchaseId,
              userId: purchase.userId,
              redeemedBulkCouponId: purchase.redeemedBulkCouponId,
              productId: individualProduct.productId,
              totalAmount: 0,
              status: purchase.status,
              country: purchase.country,
              state: purchase.state,
              city: purchase.city,
              couponId: purchase.couponId,
            },
          })

          results.push({
            event: eventModule.title || eventModule.slug,
            product: individualProduct.title,
            status: 'created',
            purchaseId: newPurchaseId,
          })
        },
      )
    }

    const finalResult = {
      message: 'Live event bundle processed',
      bundleProduct: product.title,
      results,
      summary: {
        totalEventModules: eventModules.length,
        individualEventModules: individualEventModules.length,
        purchasesCreated: results.filter((r) => r.status === 'created').length,
        purchasesSkipped: results.filter((r) => r.status === 'skipped').length,
      },
    }

    return finalResult
  },
)
