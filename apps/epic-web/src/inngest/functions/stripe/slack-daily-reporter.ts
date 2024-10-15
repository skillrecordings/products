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

function getWebsiteGroup(
  productName: string,
): 'Epic React' | 'Testing JavaScript' | 'Epic Web' {
  if (productName.includes('Epic React')) return 'Epic React'
  if (productName.includes('Testing JavaScript')) return 'Testing JavaScript'
  return 'Epic Web'
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
          group.amount -= group.refunded
          group.net = group.amount - group.fee
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
      type ProductSplit = {
        skillFee: number
        subtotal: number
        creatorSplits: Record<string, number>
      }

      type SplitTotals = ProductSplit & {
        products: Record<string, ProductSplit>
      }

      type GroupSplits = Record<string, SplitTotals>

      let totalSplits: Record<string, number> = {}
      let groupSplits: GroupSplits = {
        'Epic React': {
          skillFee: 0,
          subtotal: 0,
          creatorSplits: {},
          products: {},
        },
        'Testing JavaScript': {
          skillFee: 0,
          subtotal: 0,
          creatorSplits: {},
          products: {},
        },
        'Epic Web': {skillFee: 0, subtotal: 0, creatorSplits: {}, products: {}},
      }

      Object.entries(totals.productGroups).forEach(([key, stats]) => {
        const productGrossTotal = stats.amount
        const websiteGroup = getWebsiteGroup(stats.productName)
        const groupSplit = groupSplits[websiteGroup]

        if (splits[stats.productId]) {
          let skillFee = 0
          let subtotal = 0
          const productSplits = splits[stats.productId]

          // Calculate skill fee
          const skillSplit = Object.values(productSplits).find(
            (split) => split.type === 'skill' && !split.userId,
          )
          if (skillSplit) {
            skillFee = Math.round(productGrossTotal * skillSplit.percent)
          }

          // Calculate subtotal
          subtotal = productGrossTotal - skillFee - stats.fee

          groupSplit.skillFee += skillFee
          groupSplit.subtotal += subtotal

          if (!totalSplits['Skill Fee']) totalSplits['Skill Fee'] = 0
          totalSplits['Skill Fee'] += skillFee

          if (!totalSplits['Subtotal']) totalSplits['Subtotal'] = 0
          totalSplits['Subtotal'] += subtotal

          const productSplit: ProductSplit = {
            skillFee,
            subtotal,
            creatorSplits: {},
          }

          // Check if there's a contributor
          const hasContributor = Object.values(productSplits).some(
            (split) => split.type === 'contributor',
          )

          if (hasContributor) {
            // Calculate the total percentage for non-skill splits
            const totalNonSkillPercent = Object.values(productSplits)
              .filter((split) => split.type !== 'skill')
              .reduce((sum, split) => sum + split.percent, 0)

            // Distribute the subtotal based on adjusted percentages
            Object.values(productSplits).forEach((splitData: SplitData) => {
              if (splitData.userId) {
                const userName =
                  users[splitData.userId] ||
                  `Unknown User (ID: ${splitData.userId})`
                // Adjust the percentage relative to the non-skill total
                const adjustedPercent = splitData.percent / totalNonSkillPercent
                const splitAmount = Math.round(subtotal * adjustedPercent)

                productSplit.creatorSplits[userName] = splitAmount

                if (!groupSplit.creatorSplits[userName]) {
                  groupSplit.creatorSplits[userName] = 0
                }
                groupSplit.creatorSplits[userName] += splitAmount

                if (!totalSplits[userName]) totalSplits[userName] = 0
                totalSplits[userName] += splitAmount
              }
            })
          } else {
            // If no contributor, give 100% of subtotal to the owner
            const ownerSplit = Object.values(productSplits).find(
              (split) => split.type === 'owner',
            )
            if (ownerSplit && ownerSplit.userId) {
              const userName =
                users[ownerSplit.userId] ||
                `Unknown User (ID: ${ownerSplit.userId})`
              productSplit.creatorSplits[userName] = subtotal

              if (!groupSplit.creatorSplits[userName]) {
                groupSplit.creatorSplits[userName] = 0
              }
              groupSplit.creatorSplits[userName] += subtotal

              if (!totalSplits[userName]) totalSplits[userName] = 0
              totalSplits[userName] += subtotal
            }
          }

          groupSplit.products[key] = productSplit
        }
      })

      return {totalSplits, groupSplits}
    })

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

      const websiteAttachments = Object.entries(groupedProducts).map(
        ([groupName, products]) => {
          const groupProducts = Object.entries(products)
          const groupSplit = groupSplits[groupName]

          let groupText
          if (groupProducts.length === 1) {
            const [key, stats] = groupProducts[0]
            const productSplit = groupSplit?.products?.[key]
            groupText = `• *${stats.productName}*
${stats.count} transactions
Gross: *${formatCurrency(stats.amount)}*
Refunded: *${formatCurrency(stats.refunded)}*
Fees: *${formatCurrency(stats.fee)}*
Net: *${formatCurrency(stats.net)}*

Split Totals:
${
  productSplit
    ? `Skill Fee: *${formatCurrency(productSplit.skillFee)}*
${Object.entries(productSplit.creatorSplits)
  .map(([name, amount]) => `${name}: *${formatCurrency(amount)}*`)
  .join('\n')}`
    : 'Splits not found for this product'
}`
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

            groupText = `*Group Totals:*
Gross: *${formatCurrency(groupTotals.gross)}*
Refunded: *${formatCurrency(groupTotals.refunded)}*
Fees: *${formatCurrency(groupTotals.fees)}*
Net: *${formatCurrency(groupTotals.net)}*

${
  groupSplit
    ? `*Split Totals:*
Skill Fee: *${formatCurrency(groupSplit.skillFee)}*
${Object.entries(groupSplit.creatorSplits)
  .map(([name, amount]) => `${name}: *${formatCurrency(amount)}*`)
  .join('\n')}`
    : '*Splits not found for this group*'
}

*Individual Products:*
${groupProducts
  .map(([key, stats]) => {
    const productSplit = groupSplit?.products?.[key]
    return `• *${stats.productName} (ID: ${stats.productId})*
${stats.count} transactions
Gross: *${formatCurrency(stats.amount)}*
Refunded: *${formatCurrency(stats.refunded)}*
Fees: *${formatCurrency(stats.fee)}*
Net: *${formatCurrency(stats.net)}*

Split Totals:
${
  productSplit
    ? `Skill Fee: *${formatCurrency(productSplit.skillFee)}*
${Object.entries(productSplit.creatorSplits)
  .map(([name, amount]) => `${name}: *${formatCurrency(amount)}*`)
  .join('\n')}`
    : 'Splits not found for this product'
}`
  })
  .join('\n\n')}`
          }

          return {
            mrkdwn_in: ['text'],
            color: '#4893c9',
            title: `${groupName}\n${'-'.repeat(groupName.length + 5)}`,
            text: groupText,
          }
        },
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
${Object.entries(totalSplits)
  .filter(([name]) => name !== 'Subtotal')
  .sort(([, a], [, b]) => b - a)
  .map(([name, amount]) => {
    const percentage = (amount / totalNet) * 100
    return `${name}: *${formatCurrency(amount)}*`
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
