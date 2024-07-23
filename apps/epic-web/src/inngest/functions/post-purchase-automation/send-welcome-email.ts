import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {sendTheEmail} from 'server/send-the-email'
import {WelcomeEmail} from 'emails/post-purchase-workshop-welcome-email'
import groq from 'groq'
import {z} from 'zod'
import {sanityClient} from '@skillrecordings/skill-lesson/utils/sanity-client'

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

    const product = await step.run('load product', async () => {
      const productToAnnounce = await sanityClient.fetch(
        groq`*[_type == "product" && productId == $productId][0] {
        title,
        productId,
        "slug": slug.current,
      }`,
        {productId},
      )

      return z
        .object({
          title: z.string(),
          productId: z.string(),
          slug: z.string(),
        })
        .parse(productToAnnounce)
    })

    try {
      const response = await step.run(
        'send welcome email to user',
        async () => {
          let userEmail = purchase?.user?.email
          if (!userEmail) throw new Error('User not found')

          const subject = `Welcome to ${product?.title} Workshop 🚀`

          return await sendTheEmail({
            Subject: subject,
            Component: WelcomeEmail,
            To: userEmail,
            componentProps: {
              name: purchase?.user?.name,
              product: [product],
            },
          })
        },
      )

      return response
    } catch (error) {
      console.error('Error sending welcome email:', error)
      throw error
    }
  },
)
