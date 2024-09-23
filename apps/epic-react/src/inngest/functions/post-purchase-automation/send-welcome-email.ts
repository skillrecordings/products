import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import groq from 'groq'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'
import {inngest} from '@/inngest/inngest.server'
import {sendTheEmail} from '@/server/send-the-email'
import WelcomeEmail from '@/emails/post-purchase-welcome-email'

export const sendWelcomeEmail = inngest.createFunction(
  {id: 'send-welcome-email', name: 'Post-Purchase - Send Welcome Email'},
  {event: STRIPE_CHECKOUT_COMPLETED_EVENT},
  async ({event, step}) => {
    const {purchaseId, productId} = event.data
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

    let teamOwnerPurchases = []
    if (purchase.bulkCouponId !== null) {
      teamOwnerPurchases = await step.run(
        'load team owner purchases',
        async () => {
          const teamOwnerPurchases = await prisma.purchase.findMany({
            where: {
              userId: purchase.userId,
              productId: purchase.productId,
            },
          })

          return teamOwnerPurchases
        },
      )
    }

    const teamOwnerHasAccessToContent = teamOwnerPurchases.length > 1

    const product = await step.run('load product', async () => {
      const product = await sanityClient.fetch(
        groq`*[_type == "product" && productId == $productId][0] {
        title,
        productId,
        "slug": slug.current,
        type,
      }`,
        {productId},
      )

      return z
        .object({
          title: z.string(),
          productId: z.string(),
          slug: z.string(),
          type: z.string().nullish(),
        })
        .parse(product)
    })

    let liveEventDetails: any = null
    if (product.type == 'live') {
      liveEventDetails = await step.run('load live event details', async () => {
        const liveEventDetails = (await sanityClient.fetch(
          groq`*[_type == "event" && slug.current == $slug][0] {
            events[]{...},
            startsAt,
            endsAt,
            timezone,
          }`,
          {slug: `${product.slug}`},
        )) as any[]

        return z
          .object({
            events: z
              .array(
                z.object({
                  title: z.string(),
                  startsAt: z.string(),
                  endsAt: z.string(),
                }),
              )
              .nullable()
              .optional(),
            startsAt: z.string().nullable(),
            endsAt: z.string().nullable(),
            timezone: z.nullable(z.string().url()).optional(),
          })
          .parse(liveEventDetails)
      })
    }

    try {
      await step.sleep('wait for email to be sent', '5m')
      return await step.run('send welcome email to user', async () => {
        let userEmail = purchase?.user?.email
        if (!userEmail) throw new Error('User not found')

        const subject = `Welcome to ${product?.title} 🚀`

        return await sendTheEmail({
          Subject: subject,
          Component: WelcomeEmail,
          To: userEmail,
          componentProps: {
            name: purchase?.user?.name,
            product: product,
            purchaseStatus: purchase?.status,
            bulkCouponId: purchase?.bulkCouponId,
            merchantChargeId: purchase?.merchantChargeId,
            teamOwnerHasAccessToContent: teamOwnerHasAccessToContent,
            liveEventDetails: liveEventDetails,
          },
        })
      })
    } catch (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }
  },
)
