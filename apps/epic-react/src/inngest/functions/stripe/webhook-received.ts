import {inngest} from '@/inngest/inngest.server'
import {STRIPE_WEBHOOK_RECEIVED_EVENT} from '@skillrecordings/inngest'
import {prisma} from '@skillrecordings/database'
import {NonRetriableError} from 'inngest'
import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {paymentOptions} from '@/pages/api/skill/[...skillRecordings]'
import {z} from 'zod'

const stripe = paymentOptions.providers.stripe?.paymentClient

const CustomerSchema = z.object({id: z.string(), email: z.string()})

export const stripeWebhookReceived = inngest.createFunction(
  {id: `stripe-webhook-received`, name: 'Stripe Webhook Received'},
  {event: STRIPE_WEBHOOK_RECEIVED_EVENT},
  async ({event, step}) => {
    if (!stripe) {
      throw new NonRetriableError('Payment provider (Stripe) is missing')
    }

    const stripeAccountId = await step.run(
      'get stripe account id',
      async () => {
        const merchantAccount = await prisma.merchantAccount.findFirst({
          where: {
            label: 'stripe',
          },
          select: {
            identifier: true,
          },
        })

        if (!merchantAccount) {
          throw new NonRetriableError('no stripe account found')
        }

        return merchantAccount.identifier
      },
    )

    switch (event.data.type) {
      case 'invoice.sent':
      case 'invoice.overdue':
      case 'invoice.payment_succeeded':
        const invoice = await step.run('get invoice', async () => {
          return await stripe.invoices.retrieve(event.data.data.object.id)
        })

        if (!invoice) {
          throw new NonRetriableError('no invoice found')
        }

        const customer = await step.run('get customer', async () => {
          return CustomerSchema.parse(
            await stripe.customers.retrieve(invoice.customer as string),
          )
        })

        if (!customer) {
          throw new NonRetriableError('no customer found')
        }

        // await step.run('post invoice to slack', async () => {
        //   function getInvoiceMessageForType(type: string) {
        //     switch (type) {
        //       case 'invoice.sent':
        //         return {
        //           text: 'was sent',
        //           icon_emoji: ':envelope:',
        //         }
        //       case 'invoice.overdue':
        //         return {
        //           text: 'is overdue',
        //           icon_emoji: ':warning:',
        //         }
        //       case 'invoice.payment_succeeded':
        //         return {
        //           text: 'was paid',
        //           icon_emoji: ':moneybag:',
        //         }
        //       default:
        //         return {}
        //     }
        //   }

        //   const message = getInvoiceMessageForType(event.data.type)

        //   return await postToSlack({
        //     webClient: new WebClient(process.env.SLACK_TOKEN),
        //     channel: process.env.SLACK_INVOICE_POST_CHANNEL,
        //     username: 'Epic Web Invoices',
        //     icon_emoji: message.icon_emoji,
        //     text: `${customer.email} ${message.text}:`,
        //     attachments: [
        //       {
        //         mrkdwn_in: ['text'],
        //         text: `The invoice to <https://dashboard.stripe.com/customers/${
        //           customer.id
        //         }?account=${stripeAccountId}|${customer.email}> ${
        //           message.text
        //         } for ${
        //           invoice.amount_due / 100
        //         } ${invoice.currency.toUpperCase()} (<${
        //           invoice.hosted_invoice_url
        //         }|payment link>|<${
        //           invoice.invoice_pdf
        //         }|pdf>) \n\n- ${invoice.lines.data
        //           .map((line) => `*${line.description}*`)
        //           .join('\n- ')}`,
        //         color:
        //           process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
        //         title: `Invoice ${invoice.number} for ${
        //           invoice.amount_due / 100
        //         } ${invoice.currency.toUpperCase()} ${
        //           process.env.NODE_ENV === 'production' ? '' : '[DEV]'
        //         }`,
        //         title_link: `https://dashboard.stripe.com/invoices/${invoice.id}?account=${stripeAccountId}`,
        //       },
        //     ],
        //   })
        // })

        return {invoice, customer}
    }

    return 'yup, here we are'
  },
)
