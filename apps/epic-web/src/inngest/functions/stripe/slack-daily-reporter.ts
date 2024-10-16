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
    const allRefunds: SimplifiedRefund[] = []
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

    // Fetch refunds
    hasMore = true
    startingAfter = undefined
    while (hasMore) {
      const fetchRefundPage: Awaited<ReturnType<typeof fetchRefunds>> =
        await step.run(
          `fetch-refunds${startingAfter ? `-${startingAfter}` : ''}`,
          async () => {
            return fetchRefunds({
              range: 'yesterday',
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

      const blocks: any[] = [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: "Yesterday's Charge and Refund Report 💰",
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Daily Report - ${new Date(
              Date.now() - 86400000,
            ).toLocaleDateString()}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ` ${
              allCharges.length
            } Transactions | Skill Fee: ${formatCurrency(
              totalSplits['Skill Fee'] || 0,
            )} | ${Object.entries(totalSplits)
              .filter(([name]) => name !== 'Subtotal' && name !== 'Skill Fee')
              .map(([name, amount]) => `${name}: ${formatCurrency(amount)}`)
              .join(' | ')}`,
          },
        },
        {
          type: 'divider',
        },
      ]

      Object.entries(groupedProducts).forEach(([groupName, products]) => {
        const groupProducts = Object.entries(products)
        const groupSplit = groupSplits[groupName]

        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*${groupName}*`,
          },
        })

        if (groupProducts.length === 1) {
          const [key, stats] = groupProducts[0]
          const productSplit = groupSplit?.products?.[key]

          blocks.push({
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `• *${stats.productName}*\n${stats.count} transactions | ${
                productSplit
                  ? `Skill Fee: ${formatCurrency(
                      productSplit.skillFee,
                    )} | ${Object.entries(productSplit.creatorSplits)
                      .map(
                        ([name, amount]) =>
                          `${name}: ${formatCurrency(amount)}`,
                      )
                      .join(' | ')}`
                  : 'Splits not found for this product'
              }`,
            },
          })
        } else {
          if (groupSplit) {
            const totalTransactions = groupProducts.reduce(
              (sum, [_, stats]) => sum + stats.count,
              0,
            )
            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `${totalTransactions} Transactions | Skill Fee: ${formatCurrency(
                  groupSplit.skillFee,
                )} | ${Object.entries(groupSplit.creatorSplits)
                  .map(([name, amount]) => `${name}: ${formatCurrency(amount)}`)
                  .join(' | ')}`,
              },
            })

            blocks.push({
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Individual Products:*',
              },
            })

            groupProducts.forEach(([key, stats]) => {
              const productSplit = groupSplit.products[key]
              blocks.push({
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `• *${stats.productName}*\n${
                    stats.count
                  } transactions | ${
                    productSplit
                      ? `Skill Fee: ${formatCurrency(
                          productSplit.skillFee,
                        )} | ${Object.entries(productSplit.creatorSplits)
                          .map(
                            ([name, amount]) =>
                              `${name}: ${formatCurrency(amount)}`,
                          )
                          .join(' | ')}`
                      : 'Splits not found for this product'
                  }`,
                },
              })
            })
          } else {
            blocks.push({
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: 'Splits not found for this group',
                },
              ],
            })
          }
        }

        blocks.push({
          type: 'divider',
        })
      })

      return postToSlack({
        channel: ANNOUNCE_CHANNEL,
        webClient: new WebClient(process.env.SLACK_TOKEN),
        text: `Yesterday's Charge and Refund Report`,
        blocks,
      })
    })
  },
)
