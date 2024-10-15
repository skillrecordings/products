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

type SplitData = {
  percent: number
  userId: string | null
  type: string
}

type ProductSplits = Record<string, SplitData>

type Splits = Record<string, ProductSplits>

type UserData = Record<string, string>

type ProductSplit = {
  skillFee: number
  subtotal: number
  creatorSplits: Record<string, number>
}

type SplitTotals = ProductSplit & {
  products: Record<string, ProductSplit>
}

type GroupSplits = Record<string, SplitTotals>

// Helper function
function getWebsiteGroup(
  productName: string,
): 'Epic React' | 'Testing JavaScript' | 'Epic Web' {
  if (productName.includes('Epic React')) return 'Epic React'
  if (productName.includes('Testing JavaScript')) return 'Testing JavaScript'
  return 'Epic Web'
}

// Main function
export function calculateSplits(
  totals: Totals,
  splits: Splits,
  users: UserData,
) {
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
}
