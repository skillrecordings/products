import {postToSlack} from '@skillrecordings/skill-api'
import {WebClient} from '@slack/web-api'
import {inngest} from 'inngest/inngest.server'
import {fetchCharges, SimplifiedCharge} from 'lib/transactions'
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

// Define types for our data structures
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
              range: 'october-10',
              starting_after: startingAfter,
            })
          },
        )

      allCharges.push(...fetchChargePage.charges)
      hasMore = fetchChargePage.has_more
      startingAfter = fetchChargePage.next_page_cursor || undefined
    }

    const totals: Totals = await step.run('calculate-totals', async () => {
      const totalAmount = allCharges.reduce(
        (sum, charge) => sum + charge.amount - charge.amountRefunded,
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
        groups[product].amount +=
          charge.amount - charge.amountRefunded - charge.fee
        groups[product].net += charge.net - charge.amountRefunded
        groups[product].fee += charge.fee
        groups[product].refunded += charge.amountRefunded
        return groups
      }, {} as Record<string, ProductGroup>)

      return {
        totalAmount,
        totalRefunded,
        totalNet,
        totalFee,
        productGroups,
      }
    })

    const splits: Splits = await step.run('load splits', async () => {
      const dbSplits = await prisma.ProductRevenueSplit.findMany({
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
      const {totalAmount, totalRefunded, totalNet, totalFee, productGroups} =
        totals

      let totalSplits: Record<string, number> = {}

      const productAttachments = Object.entries(productGroups)
        .filter(([_, stats]) => stats.amount > 0)
        .sort(([, a], [, b]) => b.amount - a.amount)
        .map(([key, stats]) => {
          const productGrossTotal = stats.amount + stats.fee

          const productNetTotal = stats.amount

          let splitInfo = 'No split information available'

          if (splits[stats.productId]) {
            let skillFee = 0
            let ownerShare = 0

            // First, calculate the skill fee
            const skillSplit = Object.values(splits[stats.productId]).find(
              (split) => split.type === 'skill' && !split.userId,
            )
            if (skillSplit) {
              skillFee = Math.round(productGrossTotal * skillSplit.percent)
            }

            // Then, calculate the owner's share and generate split info
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
                  // Owner share is gross - fees - skillFee
                  amount = productGrossTotal - stats.fee - skillFee
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
Net (Stripe): *${formatCurrency(productNetTotal)}*
${splitInfo}`,
          }
        })

      const totalSplitsInfo = Object.entries(totalSplits)
        .sort(([, a], [, b]) => b - a)
        .map(([name, amount]) => {
          const percentage = (amount / totalAmount) * 100
          return `${name}: *${formatCurrency(amount)}* (${percentage.toFixed(
            1,
          )}% of Gross)`
        })
        .join('\n')

      const summaryAttachment = {
        mrkdwn_in: ['text'],
        color: process.env.NODE_ENV === 'production' ? '#4893c9' : '#c97948',
        title: `Daily Charge Report - ${new Date(
          Date.now() - 86400000,
        ).toLocaleDateString()}`,
        text: `*${allCharges.length}* transactions
Total Gross: *${formatCurrency(totalAmount)}*
Total Refunded: *${formatCurrency(totalRefunded)}*
Total Fees: *${formatCurrency(totalFee)}*
Total Net (Stripe): *${formatCurrency(totalNet)}*

Revenue Splits Summary:
${totalSplitsInfo}`,
      }

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
