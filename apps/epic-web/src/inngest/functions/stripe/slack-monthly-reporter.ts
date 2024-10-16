import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {inngest} from 'inngest/inngest.server'
import {
  fetchCharges,
  fetchRefunds,
  SimplifiedCharge,
  SimplifiedRefund,
} from 'lib/transactions'
import {prisma} from '@skillrecordings/database'
import {calculateTotals} from 'components/calculations/calculate-totals'
import {calculateSplits} from 'components/calculations/calculate-splits'

const ANNOUNCE_CHANNEL = 'C07RDAMQ7PG'

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100)
}

type SplitData = {
  percent: number
  userId: string | null
  type: string
}

type ProductSplits = Record<string, SplitData>

type Splits = Record<string, ProductSplits>

type UserData = Record<string, string>

export const slackMonthlyReporter = inngest.createFunction(
  {
    id: 'stripe/slack-monthly-reporter',
    name: 'Stripe Slack Monthly Reporter',
  },
  {
    cron: 'TZ=America/Los_Angeles 0 10 2 * *',
  },
  async ({step}) => {
    const allCharges: SimplifiedCharge[] = []
    const allRefunds: SimplifiedRefund[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    while (hasMore) {
      const fetchChargePage: Awaited<ReturnType<typeof fetchCharges>> =
        await step.run(
          `fetch-charges${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchCharges({
              range: 'last-month',
              starting_after: startingAfter,
            })
          },
        )

      allCharges.push(...fetchChargePage.charges)
      hasMore = fetchChargePage.has_more
      startingAfter = fetchChargePage.next_page_cursor || undefined
    }

    // Fetch refunds
    hasMore = true
    startingAfter = undefined
    while (hasMore) {
      const fetchRefundPage: Awaited<ReturnType<typeof fetchRefunds>> =
        await step.run(
          `fetch-refunds${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchRefunds({
              range: 'last-month',
              starting_after: startingAfter,
            })
          },
        )
      allRefunds.push(...fetchRefundPage.refunds)
      hasMore = fetchRefundPage.has_more
      startingAfter = fetchRefundPage.next_page_cursor || undefined
    }

    const {totals, refundTotals} = await step.run(
      'calculate-totals',
      async () => calculateTotals(allCharges, allRefunds),
    )

    const splits: Splits = await step.run('load splits', async () => {
      const dbSplits = await prisma.productRevenueSplit.findMany({
        where: {
          productId: {
            in: Object.values(totals.productGroups).map(
              (group) => group.productId,
            ),
          },
        },
      })

      return dbSplits.reduce<Splits>((acc: any, split: any) => {
        if (!acc[split.productId]) {
          acc[split.productId] = {}
        }
        acc[split.productId][split.id] = {
          percent: split.percent,
          userId: split.userId,
          type: split.type,
        }
        return acc
      }, {})
    })

    const users: UserData = await step.run('fetch users', async () => {
      const userIds = new Set<string>()
      Object.values(splits).forEach((productSplits) => {
        Object.values(productSplits).forEach((split) => {
          if (split.userId) userIds.add(split.userId)
        })
      })

      const dbUsers = await prisma.user.findMany({
        where: {
          id: {
            in: Array.from(userIds),
          },
        },
        select: {
          id: true,
          name: true,
        },
      })

      return dbUsers.reduce((acc, user) => {
        acc[user.id] = user.name || 'Unnamed User'
        return acc
      }, {} as UserData)
    })

    const calculatedSplits = await step.run('calculate splits', async () =>
      calculateSplits(totals, splits, users),
    )

    await step.run('announce in slack', async () => {
      const {totalGross, totalRefunded, totalNet, totalFee, productGroups} =
        totals
      const {totalSplits, groupSplits} = calculatedSplits

      function getWebsiteGroup(productName: string): string {
        if (productName.includes('Epic React')) return 'Epic React'
        if (productName.includes('Testing JavaScript'))
          return 'Testing JavaScript'
        if (productName === 'Unknown Product') return 'Other Products'
        return 'Epic Web'
      }

      const groupedProducts = Object.entries(productGroups).reduce(
        (acc, [key, product]) => {
          const group = getWebsiteGroup(product.productName)
          if (!acc[group]) acc[group] = {}
          acc[group][key] = product
          return acc
        },
        {} as Record<
          string,
          Record<string, (typeof productGroups)[keyof typeof productGroups]>
        >,
      )

      const monthYearText = new Date(
        new Date().getFullYear(),
        new Date().getMonth() - 1,
        1,
      ).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})

      const blocks: any[] = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: "Last Month's Charge  💰",
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Monthly Charge Report - ${monthYearText}*`,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Transactions:* ${allCharges.length}`,
            },
            {
              type: 'mrkdwn',
              text: `*Total Gross:* ${formatCurrency(totalGross)}`,
            },
            {
              type: 'mrkdwn',
              text: `*Total Refunded:* ${formatCurrency(totalRefunded)}`,
            },
            {
              type: 'mrkdwn',
              text: `*Total Fees:* ${formatCurrency(totalFee)}`,
            },
            {
              type: 'mrkdwn',
              text: `*Total Net:* ${formatCurrency(totalNet)}`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {type: 'mrkdwn', text: `*Refund Summary:*`},
            {
              type: 'mrkdwn',
              text: '\u200B',
            },
            {
              type: 'mrkdwn',
              text: `Total Refunds: *${refundTotals.refundCount}*\n`,
            },
            {
              type: 'mrkdwn',
              text: `Total Refund Amount: *${formatCurrency(
                refundTotals.totalRefundAmount,
              )}*`,
            },
          ],
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: '*Revenue Splits Summary:*',
            },
            {
              type: 'mrkdwn',
              text: '\u200B',
            },
            ...Object.entries(totalSplits)
              .filter(([name]) => name !== 'Subtotal')
              .sort(([, a], [, b]) => b - a)
              .map(([name, amount]) => ({
                type: 'mrkdwn',
                text: `${name}: *${formatCurrency(amount)}*`,
              })),
          ],
        },
        {type: 'divider'},
      ]

      for (const [groupName, products] of Object.entries(groupedProducts)) {
        const groupProducts = Object.entries(products)
        const groupSplit = groupSplits[groupName]

        if (groupProducts.length === 1) {
          const [key, stats] = groupProducts[0]
          const productSplit = groupSplit?.products?.[key]
          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                `*${groupName}*\n\n` +
                `• *${stats.productName}*\n` +
                `${stats.count} transactions\n` +
                `Gross: *${formatCurrency(stats.amount)}*\n` +
                `Refunded: *${formatCurrency(stats.refunded)}*\n` +
                `Fees: *${formatCurrency(stats.fee)}*\n` +
                `Net: *${formatCurrency(stats.net)}*\n\n` +
                `Split Totals:\n` +
                (productSplit
                  ? `Skill Fee: *${formatCurrency(productSplit.skillFee)}*\n` +
                    Object.entries(productSplit.creatorSplits)
                      .map(
                        ([name, amount]) =>
                          `${name}: *${formatCurrency(amount)}*`,
                      )
                      .join('\n')
                  : 'Splits not found for this product'),
            },
          })
        } else {
          const groupTotals = groupProducts.reduce(
            (totals, [_, stats]) => ({
              gross: totals.gross + stats.amount,
              refunded: totals.refunded + stats.refunded,
              fees: totals.fees + stats.fee,
              net: totals.net + stats.net,
            }),
            {gross: 0, refunded: 0, fees: 0, net: 0},
          )

          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text:
                `*${groupName}*\n\n` +
                `Gross: *${formatCurrency(groupTotals.gross)}*\n` +
                `Refunded: *${formatCurrency(groupTotals.refunded)}*\n` +
                `Fees: *${formatCurrency(groupTotals.fees)}*\n` +
                `Net: *${formatCurrency(groupTotals.net)}*`,
            },
          })

          if (groupSplit) {
            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  '*Split Totals:*\n' +
                  `Skill Fee: *${formatCurrency(groupSplit.skillFee)}*\n` +
                  Object.entries(groupSplit.creatorSplits)
                    .map(
                      ([name, amount]) =>
                        `${name}: *${formatCurrency(amount)}*`,
                    )
                    .join('\n'),
              },
            })
          }

          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Individual Products:*',
            },
          })

          for (const [key, stats] of groupProducts) {
            const productSplit = groupSplit?.products?.[key]
            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  `*• ${stats.productName}*\n` +
                  `${stats.count} transactions | Gross: *${formatCurrency(
                    stats.amount,
                  )}* | ` +
                  `Refunded: *${formatCurrency(stats.refunded)}* | ` +
                  `Fees: *${formatCurrency(
                    stats.fee,
                  )}* | Net: *${formatCurrency(stats.net)}*\n` +
                  (productSplit
                    ? `*Split Totals:* Skill Fee: *${formatCurrency(
                        productSplit.skillFee,
                      )}* | ` +
                      Object.entries(productSplit.creatorSplits)
                        .map(
                          ([name, amount]) =>
                            `${name}: *${formatCurrency(amount)}*`,
                        )
                        .join(' | ')
                    : 'Splits not found for this product'),
              },
            })
          }
        }

        blocks.push({type: 'divider'})
      }

      return postToSlack({
        channel: ANNOUNCE_CHANNEL,
        webClient: new WebClient(process.env.SLACK_TOKEN),
        text: `Last Month's Charge `,
        blocks,
      })
    })
  },
)
