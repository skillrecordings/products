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

const SEND_SINGLE_CHANNEL = true
const LC_CHANNEL_ID = 'C07RDAMQ7PG'

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
  saleAnnounceChannel: string
}

const OWNER_USER_ID = '4ef27e5f-00b4-4aa3-b3c4-4a58ae76f50b'

export const slackDailyReporter = inngest.createFunction(
  {
    id: 'stripe/slack-daily-reporter',
    name: 'Stripe Slack Daily Reporter',
  },
  {
    cron: 'TZ=America/Los_Angeles 0 10 * * *',
  },
  async ({step}) => {
    const allBalanceTransactionsYesterday: CombinedBalanceTransaction[] = []
    const allBalanceTransactionsThisMonth: CombinedBalanceTransaction[] = []
    let hasMore = true
    let startingAfter: string | undefined = undefined

    // Fetch balance transactions yesterday
    while (hasMore) {
      const fetchBalancePage: Awaited<
        ReturnType<typeof fetchCombinedBalanceTransactions>
      > = await step.run(
        `fetch-combined-transactions-yesterday${
          startingAfter ? `-${startingAfter}` : ''
        }`,
        async () => {
          return fetchCombinedBalanceTransactions({
            range: 'yesterday',
            starting_after: startingAfter,
          })
        },
      )
      allBalanceTransactionsYesterday.push(...fetchBalancePage.transactions)
      hasMore = fetchBalancePage.has_more
      startingAfter = fetchBalancePage.next_page_cursor || undefined
    }

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

    const {totals: totalsYesterday, refundTotals: refundTotalsYesterday} =
      await step.run('calculate-totals-yesterday', async () =>
        calculateTotals(allBalanceTransactionsYesterday),
      )

    const {totals: totalsThisMonth, refundTotals: refundTotalsThisMonth} =
      await step.run('calculate-totals-this-month', async () =>
        calculateTotals(allBalanceTransactionsThisMonth),
      )

    const splitsYesterday: Splits = await step.run(
      'load-splits-yesterday',
      async () => {
        const dbSplits = await prisma.productRevenueSplit.findMany({
          where: {
            productId: {
              in: Object.values(totalsYesterday.productGroups).map(
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
      'fetch-users-yesterday',
      async () => {
        const userIds = new Set<string>()
        Object.values(splitsYesterday).forEach((productSplits) => {
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

    const usersThisMonth: UserData = await step.run(
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

    const calculatedSplits = await step.run(
      'calculate-splits-yesterday',
      async () => calculateSplits(totalsYesterday, splitsYesterday, users),
    )

    const calculatedSplitsThisMonth = await step.run(
      'calculate-splits-this-month',
      async () =>
        calculateSplits(totalsThisMonth, splitsThisMonth, usersThisMonth),
    )

    const slackChannelIds = await step.run(
      'load slack channel ids for all users',
      async (): Promise<SlackChannelIds> => {
        const userIds = Object.keys(users)

        const query = groq`*[_type == "contributor" && userId in $userIds] {
      userId,
      saleAnnounceChannel
    }`

        const contributors: Contributor[] = await sanityClient.fetch(query, {
          userIds,
        })

        const slackChannelMap = contributors.reduce<SlackChannelIds>(
          (acc, contributor) => {
            if (contributor.userId && contributor.saleAnnounceChannel) {
              acc[contributor.userId] = contributor.saleAnnounceChannel
            }
            return acc
          },
          {},
        )

        const slackIds: SlackChannelIds = userIds.reduce<SlackChannelIds>(
          (acc, userId) => {
            if (userId === OWNER_USER_ID) {
              acc[userId] = process.env.SLACK_ANNOUNCE_CHANNEL_ID || null
            } else {
              acc[userId] = slackChannelMap[userId] || null
            }
            return acc
          },
          {},
        )

        return slackIds
      },
    )

    const generateChartUrl = (
      userProducts: Record<string, Record<string, ProductGroup>>,
      userSplits: Record<
        string,
        {
          creatorSplits: Record<string, number>
          products: Record<string, {creatorSplits: Record<string, number>}>
        }
      >,
      userName: string,
    ): string => {
      const productData: {[productName: string]: number} = {}

      for (const [groupName, groupProducts] of Object.entries(userProducts)) {
        for (const [productKey, product] of Object.entries(groupProducts)) {
          const creatorShare =
            userSplits[groupName]?.products[productKey]?.creatorSplits[
              userName
            ] || 0
          productData[product.productName] =
            (productData[product.productName] || 0) + creatorShare
        }
      }

      const entries = Object.entries(productData)
      const filteredEntries = entries.filter(([_, value]) => value > 0)
      const formattedLabels = filteredEntries.map(([name]) => name)
      const data = filteredEntries.map(([_, value]) => value / 100)
      const total = filteredEntries.reduce((sum, value) => sum + value[1], 0)
      const formattedTotal = formatCurrency(total)

      const currentMonth = new Date().toLocaleString('default', {month: 'long'})

      const chartData = {
        type: 'bar',
        data: {
          labels: formattedLabels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
                '#FF0000',
                '#008B8B',
                '#8B4513',
                '#FFFF00',
                '#008080',
                '#FF00FF',
                '#800000',
                '#00FFFF',
                '#006400',
                '#FFC0CB',
                '#808000',
                '#4B0082',
                '#A52A2A',
                '#40E0D0',
              ],
              maxBarThickness: 50,
              minBarLength: 2,
            },
          ],
        },
        options: {
          indexAxis: 'y',
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: `Revenue Breakdown by Product for ${currentMonth} to Date (Excluding Expenses)`,
              color: 'black',
              font: {
                size: 10,
              },
            },
            subtitle: {
              display: true,
              text: 'Estimated Royalty: ' + formattedTotal,
              color: 'black',
              font: {
                size: 10,
                weight: 'bold',
              },
              padding: {
                bottom: 10,
              },
            },
            datalabels: {
              formatter: function (value: any) {
                return '$' + value
              },
              align: 'right',
              anchor: 'end',
              color: 'black',
              font: {
                size: 8,
                weight: 'bold',
              },
              padding: 4,
            },
          },
          scales: {
            x: {
              display: false,
              min: 0,
              max: Math.max(...data) * 1.1,
              grid: {
                display: false,
              },
            },
            y: {
              grid: {
                display: true,
              },
              ticks: {
                color: 'black',
                font: {
                  size: 8,
                  style: 'normal',
                },
              },
            },
          },
          layout: {
            padding: {
              right: 30,
            },
          },
        },
      }

      const encodedChartData = encodeURIComponent(JSON.stringify(chartData))
      return `https://quickchart.io/chart?c=${encodedChartData}&backgroundColor=white&version=4`
    }

    await step.run('announce in slack', async () => {
      const {productGroups} = totalsYesterday
      const {groupSplits} = calculatedSplits
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

          // Filter yesterday's data for the text summary
          for (const [groupName, groupSplit] of Object.entries(groupSplits)) {
            if (
              userName &&
              groupSplit.creatorSplits &&
              groupSplit.creatorSplits[userName]
            ) {
              userSplits[groupName] = {
                creatorSplits: {[userName]: groupSplit.creatorSplits[userName]},
                products: {},
              }

              userProducts[groupName] = {}
              if (groupSplit.products) {
                for (const [productKey, productSplit] of Object.entries(
                  groupSplit.products,
                )) {
                  if (
                    productSplit.creatorSplits &&
                    productSplit.creatorSplits[userName]
                  ) {
                    userProducts[groupName][productKey] =
                      productGroups[productKey]
                    userSplits[groupName].products[productKey] = {
                      creatorSplits: {
                        [userName]: productSplit.creatorSplits[userName],
                      },
                    }
                  }
                }
              }
            }
          }

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

          // Calculate user-specific total splits and licenses sold count for yesterday
          let userTotalRevenue = 0
          let userTotalTransactions = 0
          const soldProducts: Array<{name: string; count: number}> = []

          for (const [groupName, groupProducts] of Object.entries(
            userProducts,
          )) {
            for (const [productName, product] of Object.entries(
              groupProducts,
            )) {
              if (product && product.count) {
                userTotalTransactions += product.count
                soldProducts.push({name: productName, count: product.count})
              }
              if (
                userSplits[groupName] &&
                userSplits[groupName].products[productName] &&
                userSplits[groupName].products[productName].creatorSplits[
                  userName
                ]
              ) {
                userTotalRevenue +=
                  userSplits[groupName].products[productName].creatorSplits[
                    userName
                  ]
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

          if (soldProducts.length > 0) {
            let chartUrl = null
            if (soldProducts.length > 1) {
              chartUrl = generateChartUrl(
                monthlyUserProducts,
                monthlyUserSplits,
                userName,
              )
            }
            let summaryMessage = 'Yesterday you sold '
            const productStrings = soldProducts.map(
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

            summaryMessage += ` for an estimated royalty of ${formatCurrency(
              userTotalRevenue,
            )}.`

            const blocks: any[] = [
              {
                type: 'header',
                text: {
                  type: 'plain_text',
                  text: `Daily Revenue Report for ${userName} 💰`,
                  emoji: true,
                },
              },
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Report Date: ${new Date(
                    Date.now() - 86400000,
                  ).toLocaleDateString()}*`,
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
                  text: 'Revenue Distribution To Date (Excluding Expenses)',
                },
                image_url: chartUrl,
                alt_text: 'Revenue Distribution Chart',
              })
            } else {
              const currentMonth = new Date().toLocaleString('default', {
                month: 'long',
              })
              blocks.push({
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: `*Estimated Royalty For ${currentMonth} to Date (Before Expenses): ${formatCurrency(
                    userTotalRevenueThisMonth,
                  )}*`,
                },
              })
            }

            try {
              await postToSlack({
                channel: targetChannelId,
                webClient,
                text: `Daily Revenue Report for ${userName}`,
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
