import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {inngest} from 'inngest/inngest.server'
import {fetchCharges, SimplifiedCharge} from 'lib/transactions'

const ANNOUNCE_CHANNEL = 'C03QFFWHT7D'

export const slackDailyReporter = inngest.createFunction(
  {
    id: 'stripe/slack-daily-reporter',
    name: 'Stripe Slack Daily Reporter',
  },
  {
    cron: 'TZ=America/Los_Angeles 0 10 * * *',
  },
  async ({step}) => {
    const allCharges: SimplifiedCharge[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    while (hasMore) {
      const fetchChargePage: Awaited<ReturnType<typeof fetchCharges>> =
        await step.run(
          `fetch-charges${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchCharges({
              range: 'yesterday',
              starting_after: startingAfter,
            })
          },
        )

      allCharges.push(...fetchChargePage.charges)
      hasMore = fetchChargePage.has_more
      startingAfter = fetchChargePage.next_page_cursor || undefined
    }

    await step.run('announce in slack', async () => {
      const totalAmount = allCharges.reduce(
        (sum, charge) => sum + charge.amount,
        0,
      )
      const totalNet = allCharges.reduce((sum, charge) => sum + charge.net, 0)
      const totalFee = allCharges.reduce((sum, charge) => sum + charge.fee, 0)

      // Group charges by product
      const productGroups = allCharges.reduce((groups, charge) => {
        const product = charge.product || 'Unknown Product'
        if (!groups[product]) {
          groups[product] = {count: 0, amount: 0, net: 0, fee: 0}
        }
        groups[product].count++
        groups[product].amount += charge.amount
        groups[product].net += charge.net
        groups[product].fee += charge.fee
        return groups
      }, {} as Record<string, {count: number; amount: number; net: number; fee: number}>)

      const productSummaries = Object.entries(productGroups)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .map(
          ([product, stats]) =>
            `• *${product}*: ${stats.count} charge${
              stats.count !== 1 ? 's' : ''
            }, $${(stats.amount / 100).toFixed(2)} total ($${(
              stats.net / 100
            ).toFixed(2)} net)`,
        )
        .join('\n')

      const attachments = [
        {
          mrkdwn_in: ['text'],
          color: process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
          title: `Daily Charge Report - ${new Date(
            Date.UTC(new Date().getUTCDate() - 1),
          ).toLocaleDateString()}`,
          text: `*Summary*\n• Total Charges: ${
            allCharges.length
          }\n• Total Amount: $${(totalAmount / 100).toFixed(
            2,
          )}\n• Total Net: $${(totalNet / 100).toFixed(2)}\n• Total Fees: $${(
            totalFee / 100
          ).toFixed(2)}\n\n*Product Breakdown*\n${productSummaries}`,
        },
      ]

      return postToSlack({
        channel: ANNOUNCE_CHANNEL,
        webClient: new WebClient(process.env.SLACK_TOKEN),
        text: `Yesterday's Charge Report`,
        // @ts-ignore
        attachments,
      })
    })
  },
)
