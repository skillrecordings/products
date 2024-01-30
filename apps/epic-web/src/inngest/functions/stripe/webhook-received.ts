import {inngest} from 'inngest/inngest.server'
import {STRIPE_WEBHOOK_RECEIVED_EVENT} from '@skillrecordings/inngest'
import {Redis} from '@upstash/redis'
import {prisma} from '@skillrecordings/database'
import {NonRetriableError} from 'inngest'
import {stripe} from '@skillrecordings/commerce-server'
import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {Stripe} from 'stripe'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const stripeWebhookReceived = inngest.createFunction(
  {id: `stripe-webhook-received`, name: 'Stripe Webhook Received'},
  {event: STRIPE_WEBHOOK_RECEIVED_EVENT},
  async ({event, step}) => {
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
          return (await stripe.customers.retrieve(
            invoice.customer as string,
          )) as Stripe.Customer
        })

        if (!customer) {
          throw new NonRetriableError('no customer found')
        }

        await step.run('post invoice to slack', async () => {
          function getInvoiceMessageForType(type: string) {
            switch (type) {
              case 'invoice.sent':
                return {
                  text: 'was sent',
                  icon_emoji: ':envelope:',
                }
              case 'invoice.overdue':
                return {
                  text: 'is overdue',
                  icon_emoji: ':warning:',
                }
              case 'invoice.payment_succeeded':
                return {
                  text: 'was paid',
                  icon_emoji: ':moneybag:',
                }
              default:
                return {}
            }
          }

          const message = getInvoiceMessageForType(event.data.type)

          return await postToSlack({
            webClient: new WebClient(process.env.SLACK_TOKEN),
            channel: process.env.SLACK_INVOICE_POST_CHANNEL,
            username: 'Epic Web Invoices',
            icon_emoji: message.icon_emoji,
            text: `${customer.email} ${message.text}:`,
            attachments: [
              {
                mrkdwn_in: ['text'],
                text: `The invoice to <https://dashboard.stripe.com/customers/${
                  customer.id
                }?account=${stripeAccountId}|${customer.email}> ${
                  message.text
                } for ${
                  invoice.amount_due / 100
                } ${invoice.currency.toUpperCase()} (<${
                  invoice.hosted_invoice_url
                }|payment link>|<${
                  invoice.invoice_pdf
                }|pdf>) \n\n- ${invoice.lines.data
                  .map((line) => `*${line.description}*`)
                  .join('\n- ')}`,
                color:
                  process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
                title: `Invoice ${invoice.number} for ${
                  invoice.amount_due / 100
                } ${invoice.currency.toUpperCase()} ${
                  process.env.NODE_ENV === 'production' ? '' : '[DEV]'
                }`,
                title_link: `https://dashboard.stripe.com/invoices/${invoice.id}?account=${stripeAccountId}`,
              },
            ],
          })
        })

        return {invoice, customer}
    }

    return 'yup, here we are'
  },
)
