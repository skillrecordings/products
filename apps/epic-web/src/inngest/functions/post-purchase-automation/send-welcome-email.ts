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

      if (!purchase) throw new Error('Purchase not found')

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

      if (!product) throw new Error(`Product ${productId} not found`)

      return product
    })

    try {
      const response = await step.run(
        'send welcome email to user',
        async () => {
          if (productId !== '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8') {
            return
          }

          let userEmail = purchase?.user?.email
          if (!userEmail) throw new Error('User not found')

          const subject = `Welcome to ${product?.name}, Figma Invite for DevMode`

          return await sendTheEmail({
            Subject: subject,
            Component: WelcomeEmail,
            To: userEmail,
            componentProps: {
              name: purchase?.user?.name,
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
