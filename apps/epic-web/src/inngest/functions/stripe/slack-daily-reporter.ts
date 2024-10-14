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

type ProductGroup = {
  productName: string
  productId: string
  count: number
  amount: number
  net: number
  fee: number
  refunded: number
}

type Totals = {
  totalGross: number
  totalRefunded: number
  totalNet: number
  totalFee: number
  productGroups: Record<string, ProductGroup>
}

type RefundTotals = {
  totalRefundAmount: number
  refundCount: number
  refundsByProduct: Record<
    string,
    {
      count: number
      amount: number
    }
  >
}

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
              range: 'october-10',
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
              range: 'october-10',
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
      async () => {
        const refundTotals: RefundTotals = {
          totalRefundAmount: allRefunds.reduce(
            (sum, refund) => sum + refund.amount,
            0,
          ),
          refundCount: allRefunds.length,
          refundsByProduct: allRefunds.reduce((acc, refund) => {
            if (!acc[refund.product]) {
              acc[refund.product] = {count: 0, amount: 0}
            }
            acc[refund.product].count++
            acc[refund.product].amount += refund.amount
            return acc
          }, {} as Record<string, {count: number; amount: number}>),
        }

        const productGroups = allCharges.reduce((groups, charge) => {
          const product = charge.product || 'Unknown Product'
          const productId = charge.productId || 'unknown-id'
          if (!groups[product]) {
            groups[product] = {
              productName: product,
              productId: productId,
              count: 0,
              amount: 0,
              net: 0,
              fee: 0,
              refunded: 0,
            }
          }
          groups[product].count++
          groups[product].amount += charge.amount
          groups[product].fee += charge.fee
          return groups
        }, {} as Record<string, ProductGroup>)

        // Add products that only have refunds to the productGroups
        Object.entries(refundTotals.refundsByProduct).forEach(
          ([product, {amount}]) => {
            if (!productGroups[product]) {
              productGroups[product] = {
                productName: product,
                productId: 'unknown-id',
                count: 0,
                amount: 0,
                net: 0,
                fee: 0,
                refunded: 0,
              }
            }
          },
        )

        // Apply refunds to all products
        Object.entries(refundTotals.refundsByProduct).forEach(
          ([product, {amount}]) => {
            if (productGroups[product]) {
              productGroups[product].refunded += amount
            }
          },
        )

        // Calculate net and adjust gross for each product
        Object.values(productGroups).forEach((group) => {
          group.amount -= group.refunded // Adjust gross amount
          group.net = group.amount - group.fee // Recalculate net
        })

        const totalGross = Object.values(productGroups).reduce(
          (sum, group) => sum + group.amount,
          0,
        )
        const totalFee = Object.values(productGroups).reduce(
          (sum, group) => sum + group.fee,
          0,
        )
        const totalNet = Object.values(productGroups).reduce(
          (sum, group) => sum + group.net,
          0,
        )

        return {
          totals: {
            totalGross,
            totalRefunded: refundTotals.totalRefundAmount,
            totalNet,
            totalFee,
            productGroups,
          },
          refundTotals,
        }
      },
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

    const calculatedSplits = await step.run('calculate splits', async () => {
      let totalSplits: Record<string, number> = {}

      Object.entries(totals.productGroups).forEach(([key, stats]) => {
        console.log('========================')
        const productGrossTotal = stats.amount
        const productNetTotal = stats.net

        console.log(`Processing product: ${key}`)
        console.log(
          `Gross Total: ${productGrossTotal}, Net Total: ${productNetTotal}`,
        )

        if (splits[stats.productId]) {
          let skillFee = 0
          let creatorSplit = 0

          const skillSplit = Object.values(splits[stats.productId]).find(
            (split) => split.type === 'skill' && !split.userId,
          )
          if (skillSplit) {
            skillFee = Math.round(productGrossTotal * skillSplit.percent)
            console.log(`Skill Fee for ${key}: ${skillFee}`)
          }

          const creatorSplitData = Object.values(splits[stats.productId]).find(
            (split) => split.userId,
          )
          if (creatorSplitData) {
            creatorSplit = Math.round(
              productNetTotal * creatorSplitData.percent,
            )
            console.log(`Creator Split for ${key}: ${creatorSplit}`)
          }

          Object.values(splits[stats.productId]).forEach(
            (splitData: SplitData) => {
              let amount = 0
              let userName = 'Unknown User'

              if (splitData.type === 'skill' && !splitData.userId) {
                userName = 'Skill Fee'
                amount = skillFee
              } else if (splitData.userId) {
                userName =
                  users[splitData.userId] ||
                  `Unknown User (ID: ${splitData.userId})`
                amount = creatorSplit
              }

              console.log(`Split Data for ${userName}: ${amount}`)

              if (!totalSplits[userName]) totalSplits[userName] = 0
              totalSplits[userName] += amount
              console.log(
                `Total Splits for ${userName}: ${totalSplits[userName]}`,
              )
            },
          )
        } else {
          console.log(`No splits found for product: ${key}`)
        }
      })

      console.log('Final calculated splits:', totalSplits)
      return totalSplits
    })

    await step.run('announce in slack', async () => {
      const {totalGross, totalRefunded, totalNet, totalFee, productGroups} =
        totals

      function getWebsiteGroup(
        productName: string,
      ): 'Epic React' | 'Testing JavaScript' | 'Epic Web' {
        if (productName.includes('Epic React')) return 'Epic React'
        if (productName.includes('Testing JavaScript'))
          return 'Testing JavaScript'
        return 'Epic Web'
      }

      const websiteGroups: Record<
        'Epic React' | 'Testing JavaScript' | 'Epic Web',
        any[]
      > = {
        'Epic React': [],
        'Testing JavaScript': [],
        'Epic Web': [],
      }

      // Group existing product data into website categories
      Object.entries(productGroups).forEach(([key, stats]) => {
        const websiteGroup = getWebsiteGroup(stats.productName)
        websiteGroups[websiteGroup].push({key, stats})
      })

      const websiteAttachments = Object.entries(websiteGroups).map(
        ([groupName, products]) => ({
          mrkdwn_in: ['text'],
          color: '#4893c9',
          title: groupName,
          text: products
            .map(({key, stats}) => {
              const productGrossTotal = stats.amount
              const productNetTotal = stats.net

              let splitInfo = 'No split information available'
              if (splits[stats.productId]) {
                splitInfo = Object.values(splits[stats.productId])
                  .map((splitData: SplitData) => {
                    let amount = 0
                    let userName = 'Unknown User'

                    if (splitData.type === 'skill' && !splitData.userId) {
                      userName = 'Skill Fee'
                      amount = Math.round(productGrossTotal * splitData.percent)
                    } else if (splitData.userId) {
                      userName =
                        users[splitData.userId] ||
                        `Unknown User (ID: ${splitData.userId})`
                      amount = Math.round(productNetTotal * splitData.percent)
                    }

                    return `${userName}: *${formatCurrency(amount)}*`
                  })
                  .join('\n')
              }

              return `*${stats.productName} (ID: ${stats.productId})*
• ${stats.count} transactions
Gross: *${formatCurrency(productGrossTotal)}*
Refunded: *${formatCurrency(stats.refunded)}*
Fees: *${formatCurrency(stats.fee)}*
Net: *${formatCurrency(productNetTotal)}*
${splitInfo}`
            })
            .join('\n\n'),
        }),
      )

      const summaryAttachment = {
        mrkdwn_in: ['text'],
        color: process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
        title: `Daily Charge Report - ${new Date(
          Date.now() - 86400000,
        ).toLocaleDateString()}`,
        text: `*${allCharges.length}* transactions
Total Gross: *${formatCurrency(totalGross)}*
Total Refunded: *${formatCurrency(totalRefunded)}*
Total Fees: *${formatCurrency(totalFee)}*
Total Net: *${formatCurrency(totalNet)}*

Refund Summary:
Total Refunds: *${refundTotals.refundCount}*
Total Refund Amount: *${formatCurrency(refundTotals.totalRefundAmount)}*

Revenue Splits Summary:
${Object.entries(calculatedSplits)
  .sort(([, a], [, b]) => b - a)
  .map(([name, amount]) => {
    const percentage = (amount / totalNet) * 100
    return `${name}: *${formatCurrency(amount)}* (${percentage.toFixed(
      1,
    )}% of Net)`
  })
  .join('\n')}`,
      }

      const attachments = [summaryAttachment, ...websiteAttachments]

      return postToSlack({
        channel: ANNOUNCE_CHANNEL,
        webClient: new WebClient(process.env.SLACK_TOKEN),
        text: `Yesterday's Charge and Refund Report`,
        // @ts-ignore
        attachments,
      })
    })
  },
)
