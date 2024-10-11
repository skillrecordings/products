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
        (sum, charge) =>
          sum + charge.amount - charge.amountRefunded - charge.fee,
        0,
      )
      const totalRefunded = allCharges.reduce(
        (sum, charge) => sum + charge.amountRefunded,
        0,
      )
      const totalNet = allCharges.reduce((sum, charge) => sum + charge.net, 0)
      const totalFee = allCharges.reduce((sum, charge) => sum + charge.fee, 0)

      // Group charges by product
      const productGroups = allCharges.reduce((groups, charge) => {
        const product = charge.product || 'Unknown Product'
        if (!groups[product]) {
          groups[product] = {count: 0, amount: 0, net: 0, fee: 0, refunded: 0}
        }
        groups[product].count++
        groups[product].amount +=
          charge.amount - charge.amountRefunded - charge.fee
        groups[product].net += charge.net - charge.amountRefunded
        groups[product].fee += charge.fee
        groups[product].refunded += charge.amountRefunded
        return groups
      }, {} as Record<string, {count: number; amount: number; net: number; fee: number; refunded: number}>)

      const summaryAttachment = {
        mrkdwn_in: ['text'],
        color: process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
        title: `Daily Charge Report - ${new Date(
          Date.now() - 86400000,
        ).toLocaleDateString()}`,
        text: `*${allCharges.length}* sales for *$${(totalAmount / 100).toFixed(
          2,
        )}*`,
      }

      const productAttachments = Object.entries(productGroups)
        .filter(([_, stats]) => stats.amount > 0)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .map(([product, stats]) => ({
          mrkdwn_in: ['text'],
          color: '#36a64f',
          title: product,
          text: `• ${stats.count} sold for *$${(stats.amount / 100).toFixed(
            2,
          )}*`,
        }))

      const attachments = [summaryAttachment, ...productAttachments]

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
