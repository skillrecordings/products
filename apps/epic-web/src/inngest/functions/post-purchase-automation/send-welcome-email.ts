import {inngest} from 'inngest/inngest.server'
import {STRIPE_CHECKOUT_COMPLETED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {sendTheEmail} from 'server/send-the-email'
import {WelcomeEmail} from 'emails/pixel-perfect-workshop-welcome-email'

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

      if (Boolean(!purchase)) throw new Error('Purchase not found')

      return purchase
    })

    const product = await step.run('load product', async () => {
      const product = await prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          name: true,
        },
      })

      if (Boolean(!product)) throw new Error(`Product ${productId} not found`)

      return product
    })

    await step.run('send welcome email to user', async () => {
      // TODO: Make this dynamic. Write welcome emails for other workshops
      if (productId !== process.env.PIXEL_PERFECT_PRODUCT_ID) return

      let userEmail = purchase?.user?.email
      if (!userEmail) throw new Error('User not found')

      const subject = `Welcome to ${product?.name}`

      return await sendTheEmail({
        Subject: subject,
        Component: WelcomeEmail,
        To: 'cree@egghead.io',
        componentProps: {
          name: purchase?.user?.name,
        },
      })
    })
  },
)
