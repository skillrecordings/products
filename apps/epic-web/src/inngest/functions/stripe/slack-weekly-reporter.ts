import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {inngest} from 'inngest/inngest.server'
import {
  fetchCombinedBalanceTransactions,
  CombinedBalanceTransaction,
} from 'lib/transactions'
import {prisma} from '@skillrecordings/database'
import {
  calculateTotals,
  ProductGroup,
} from 'components/calculations/calculate-totals'
import {calculateSplits} from 'components/calculations/calculate-splits'
import {sanityClient} from 'utils/sanity-client'
import groq from 'groq'

const SEND_SINGLE_CHANNEL = false
const LC_CHANNEL_ID = 'C03QFFWHT7D'

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

interface UserData {
  [userId: string]: string
}

interface SlackChannelIds {
  [userId: string]: string | null
}

interface Contributor {
  userId: string
  slackChannel: string
}

export const slackWeeklyReporter = inngest.createFunction(
  {
    id: 'stripe/slack-weekly-reporter',
    name: 'Stripe Slack Weekly Reporter',
  },
  {
    cron: 'TZ=America/Los_Angeles 0 10 * * 1',
  },
  async ({step}) => {
    const allBalanceTransactionsThisMonth: CombinedBalanceTransaction[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    // Fetch balance transactions this month
    hasMore = true
    startingAfter = undefined
    while (hasMore) {
      const fetchBalancePage: Awaited<
        ReturnType<typeof fetchCombinedBalanceTransactions>
      > = await step.run(
        `fetch-combined-transactions-this-month${
          startingAfter ? `-${startingAfter}` : ''
        }`,
        async () => {
          return fetchCombinedBalanceTransactions({
            range: 'month-so-far',
            starting_after: startingAfter,
          })
        },
      )
      allBalanceTransactionsThisMonth.push(...fetchBalancePage.transactions)
      hasMore = fetchBalancePage.has_more
      startingAfter = fetchBalancePage.next_page_cursor || undefined
    }

    const {totals: totalsThisMonth, refundTotals: refundTotalsThisMonth} =
      await step.run('calculate-totals-this-month', async () =>
        calculateTotals(allBalanceTransactionsThisMonth),
      )

    const splitsThisMonth: Splits = await step.run(
      'load-splits-this-month',
      async () => {
        const dbSplits = await prisma.productRevenueSplit.findMany({
          where: {
            productId: {
              in: Object.values(totalsThisMonth.productGroups).map(
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
      },
    )

    const users: UserData = await step.run(
      'fetch-users-this-month',
      async () => {
        const userIds = new Set<string>()
        Object.values(splitsThisMonth).forEach((productSplits) => {
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
      },
    )

    const calculatedSplitsThisMonth = await step.run(
      'calculate-splits-this-month',
      async () => calculateSplits(totalsThisMonth, splitsThisMonth, users),
    )

    const slackChannelIds = await step.run(
      'load slack channel ids for all users',
      async (): Promise<SlackChannelIds> => {
        const userIds = Object.keys(users)

        const query = groq`*[_type == "contributor" && userId in $userIds] {
      userId,
      slackChannel
    }`

        const contributors: Contributor[] = await sanityClient.fetch(query, {
          userIds,
        })

        const slackIds: SlackChannelIds = contributors.reduce<SlackChannelIds>(
          (acc, contributor) => {
            if (contributor.userId && contributor.slackChannel) {
              acc[contributor.userId] = contributor.slackChannel
            } else {
              acc[contributor.userId] = null
            }
            return acc
          },
          {},
        )

        return slackIds
      },
    )

    await step.run('announce in slack', async () => {
      const monthlyProductGroups = totalsThisMonth.productGroups
      const monthlyGroupSplits = calculatedSplitsThisMonth.groupSplits

      const webClient = new WebClient(process.env.SLACK_TOKEN)
      const results: Array<{
        userId: string
        channelId: string
        success: boolean
        error?: string
      }> = []

      for (const [userId, channelId] of Object.entries(slackChannelIds)) {
        const targetChannelId = SEND_SINGLE_CHANNEL ? LC_CHANNEL_ID : channelId

        if (targetChannelId) {
          const userName = users[userId]
          const userSplits: Record<
            string,
            {
              creatorSplits: Record<string, number>
              products: Record<string, {creatorSplits: Record<string, number>}>
            }
          > = {}
          const userProducts: Record<string, Record<string, ProductGroup>> = {}

          // Monthly data structures
          const monthlyUserSplits: Record<
            string,
            {
              creatorSplits: Record<string, number>
              products: Record<string, {creatorSplits: Record<string, number>}>
            }
          > = {}
          const monthlyUserProducts: Record<
            string,
            Record<string, ProductGroup>
          > = {}

          // Filter monthly data for the chart
          for (const [groupName, groupSplit] of Object.entries(
            monthlyGroupSplits,
          )) {
            if (
              userName &&
              groupSplit.creatorSplits &&
              groupSplit.creatorSplits[userName]
            ) {
              monthlyUserSplits[groupName] = {
                creatorSplits: {[userName]: groupSplit.creatorSplits[userName]},
                products: {},
              }

              monthlyUserProducts[groupName] = {}
              if (groupSplit.products) {
                for (const [productKey, productSplit] of Object.entries(
                  groupSplit.products,
                )) {
                  if (
                    productSplit.creatorSplits &&
                    productSplit.creatorSplits[userName]
                  ) {
                    monthlyUserProducts[groupName][productKey] =
                      monthlyProductGroups[productKey]
                    monthlyUserSplits[groupName].products[productKey] = {
                      creatorSplits: {
                        [userName]: productSplit.creatorSplits[userName],
                      },
                    }
                  }
                }
              }
            }
          }

          // Calculate user-specific total splits and licenses sold count for this month
          let userTotalRevenueThisMonth = 0
          let userTotalTransactionsThisMonth = 0
          const soldProductsThisMonth: Array<{name: string; count: number}> = []

          for (const [groupName, groupProducts] of Object.entries(
            monthlyUserProducts,
          )) {
            for (const [productName, product] of Object.entries(
              groupProducts,
            )) {
              if (product && product.count) {
                userTotalTransactionsThisMonth += product.count
                soldProductsThisMonth.push({
                  name: productName,
                  count: product.count,
                })
              }
              if (
                monthlyUserSplits[groupName] &&
                monthlyUserSplits[groupName].products[productName] &&
                monthlyUserSplits[groupName].products[productName]
                  .creatorSplits[userName]
              ) {
                userTotalRevenueThisMonth +=
                  monthlyUserSplits[groupName].products[productName]
                    .creatorSplits[userName]
              }
            }
          }

          if (soldProductsThisMonth.length > 0) {
            let chartUrl = null
            let summaryMessage = 'So far this month, you have sold '
            const productStrings = soldProductsThisMonth.map(
              (product) =>
                `${product.count} license${product.count > 1 ? 's' : ''} of ${
                  product.name
                }`,
            )

            if (productStrings.length === 1) {
              summaryMessage += productStrings[0]
            } else if (productStrings.length > 1) {
              const lastProduct = productStrings.pop()
              summaryMessage += `${productStrings.join(
                ', ',
              )}, and ${lastProduct}`
            }

            const monthYearText = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              1,
            ).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})

            summaryMessage += ` for an estimated royalty of ${formatCurrency(
              userTotalRevenueThisMonth,
            )}.`

            const blocks: any[] = [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `Weekly Revenue Report for ${userName} 💰`,
                  emoji: true,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Month-to-date Report - ${monthYearText}*`,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: summaryMessage,
                },
              },
            ]

            if (chartUrl) {
              blocks.push({
                type: 'image',
                title: {
                  type: 'plain_text',
                  text: 'Revenue Distribution To Date (Before Expenses)',
                },
                image_url: chartUrl,
                alt_text: 'Revenue Distribution Chart',
              })
            }

            try {
              await postToSlack({
                channel: targetChannelId,
                webClient,
                text: `Weekly Revenue Report for ${userName}`,
                blocks,
              })
              results.push({userId, channelId: targetChannelId, success: true})
            } catch (error) {
              console.error(
                `Failed to send message to channel ${targetChannelId} for user ${userId}:`,
                error,
              )
              results.push({
                userId,
                channelId: targetChannelId,
                success: false,
                error: error instanceof Error ? error.message : String(error),
              })
            }
          }
        }
      }

      return {
        totalSent: results.filter((r) => r.success).length,
        totalFailed: results.filter((r) => !r.success).length,
        details: results,
      }
    })
  },
)
