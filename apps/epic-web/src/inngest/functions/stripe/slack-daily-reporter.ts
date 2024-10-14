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
  totalAmount: number
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
        const totalGross = allCharges.reduce(
          (sum, charge) => sum + charge.amount,
          0,
        )
        const totalFee = allCharges.reduce((sum, charge) => sum + charge.fee, 0)

        const refundTotals: RefundTotals = {
          totalRefundAmount: allRefunds.reduce(
            (sum, refund) => sum + refund.amount,
            0,
          ),
          refundCount: allRefunds.length,
          refundsByProduct: allRefunds.reduce((acc, refund) => {
            console.log('Processing refund:', JSON.stringify(refund))
            if (!acc[refund.product]) {
              acc[refund.product] = {count: 0, amount: 0}
            }
            acc[refund.product].count++
            acc[refund.product].amount += refund.amount
            return acc
          }, {} as Record<string, {count: number; amount: number}>),
        }

        console.log(
          'Refunds by Product:',
          JSON.stringify(refundTotals.refundsByProduct),
        )

        const totalNet = totalGross - refundTotals.totalRefundAmount - totalFee

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

        // Adjust product groups with refund data
        Object.entries(refundTotals.refundsByProduct).forEach(
          ([product, {amount}]) => {
            if (productGroups[product]) {
              productGroups[product].refunded += amount
            } else {
              // Handle refunds for products not in charges
              productGroups[product] = {
                productName: product,
                productId: 'unknown-id',
                count: 0,
                amount: 0,
                net: 0,
                fee: 0,
                refunded: amount,
              }
            }
          },
        )

        // Calculate net for each product
        Object.values(productGroups).forEach((group) => {
          group.net = group.amount - group.refunded - group.fee
        })

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
          acc[split.productId] = []
        }
        acc[split.productId].push({
          percent: split.percent,
          userId: split.userId,
          type: split.type,
        })
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

    await step.run('announce in slack', async () => {
      const {totalGross, totalRefunded, totalNet, totalFee, productGroups} =
        totals

      let totalSplits: Record<string, number> = {}

      const productAttachments = Object.entries(productGroups)
        .filter(([_, stats]) => stats.amount > 0)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .map(([key, stats]) => {
          const productGrossTotal = stats.amount
          const productNetTotal = stats.net

          let splitInfo = 'No split information available'

          if (splits[stats.productId]) {
            let skillFee = 0
            let ownerShare = 0

            const skillSplit = Object.values(splits[stats.productId]).find(
              (split) => split.type === 'skill' && !split.userId,
            )
            if (skillSplit) {
              skillFee = Math.round(productGrossTotal * skillSplit.percent)
            }

            splitInfo = Object.values(splits[stats.productId])
              .map((splitData: SplitData) => {
                let amount = 0
                let userName = 'Unknown User'

                if (splitData.type === 'skill' && !splitData.userId) {
                  userName = 'Skill Fee'
                  amount = skillFee
                } else if (splitData.userId) {
                  userName =
                    users[splitData.userId] ||
                    `Unknown User (ID: ${splitData.userId})`
                  amount = productNetTotal - skillFee
                  ownerShare = amount
                }

                if (!totalSplits[userName]) totalSplits[userName] = 0
                totalSplits[userName] += amount

                return `${userName}: *${formatCurrency(amount)}*`
              })
              .join('\n')
          }

          return {
            mrkdwn_in: ['text'],
            color: '#36a64f',
            title: `${stats.productName} (ID: ${stats.productId})`,
            text: `• ${stats.count} transactions
Gross: *${formatCurrency(productGrossTotal)}*
Refunded: *${formatCurrency(stats.refunded)}*
Fees: *${formatCurrency(stats.fee)}*
Net: *${formatCurrency(productNetTotal)}*
${splitInfo}`,
          }
        })

      const totalSplitsInfo = Object.entries(totalSplits)
        .sort(([, a], [, b]) => b - a)
        .map(([name, amount]) => {
          const percentage = (amount / totalNet) * 100
          return `${name}: *${formatCurrency(amount)}* (${percentage.toFixed(
            1,
          )}% of Net)`
        })
        .join('\n')

      //       const refundAttachment = {
      //         mrkdwn_in: ['text'],
      //         color: '#FF0000',
      //         title: 'Refund Summary',
      //         text: `Total Refunds: *${refundTotals.refundCount}*
      // Total Refund Amount: *${formatCurrency(refundTotals.totalRefundAmount)}*

      // Refunds by Product:
      // ${Object.entries(refundTotals.refundsByProduct)
      //   .map(
      //     ([product, {count, amount}]) =>
      //       `• ${product}: ${count} refund${
      //         count !== 1 ? 's' : ''
      //       }, *${formatCurrency(amount)}*`,
      //   )
      //   .join('\n')}`,
      //       }

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

Revenue Splits Summary:
${totalSplitsInfo}

Refund Summary:
Total Refunds: *${refundTotals.refundCount}*
Total Refund Amount: *${formatCurrency(refundTotals.totalRefundAmount)}*`,
      }

      const attachments = [
        summaryAttachment,
        // refundAttachment,
        ...productAttachments,
      ]

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
