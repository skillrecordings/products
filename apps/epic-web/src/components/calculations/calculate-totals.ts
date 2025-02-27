import {CombinedBalanceTransaction} from 'lib/transactions'

export type ProductGroup = {
  productName: string
  productId: string
  count: number
  amount: number
  gross: number
  net: number
  fee: number
  refunded: number
  refundCount: number
}

export type Totals = {
  totalGross: number
  totalRefunded: number
  totalNet: number
  totalFee: number
  totalCount: number
  productGroups: Record<string, ProductGroup>
}

type RefundTotals = {
  totalRefundAmount: number
  refundCount: number
  refundsByProduct: Record<string, {count: number; amount: number}>
}

export function calculateTotals(
  allBalanceTransactions: CombinedBalanceTransaction[],
) {
  const charges = allBalanceTransactions.filter(
    (transaction) =>
      transaction.type === 'charge' || transaction.type === 'payment',
  )
  const refunds = allBalanceTransactions.filter(
    (transaction) =>
      transaction.type === 'refund' || transaction.type === 'payment_refund',
  )

  const refundTotals: RefundTotals = {
    totalRefundAmount: refunds.reduce(
      (sum, refund) => sum + Math.abs(refund.amount),
      0,
    ),
    refundCount: refunds.length,
    refundsByProduct: refunds.reduce((acc, refund) => {
      const product = refund.product || 'Unknown Product'
      if (!acc[product]) {
        acc[product] = {count: 0, amount: 0}
      }
      acc[product].count++
      acc[product].amount += Math.abs(refund.amount)
      return acc
    }, {} as Record<string, {count: number; amount: number}>),
  }

  const productGroups = charges.reduce((groups, charge) => {
    const product = charge.product || 'Unknown Product'
    const productId = charge.productId || 'unknown-id'
    if (!groups[product]) {
      groups[product] = {
        productName: product,
        productId: productId,
        count: 0,
        amount: 0,
        gross: 0,
        net: 0,
        fee: 0,
        refunded: 0,
        refundCount: 0,
      }
    }
    groups[product].count++
    groups[product].amount += charge.amount
    groups[product].gross += charge.amount
    groups[product].net += charge.net
    groups[product].fee += charge.fee
    return groups
  }, {} as Record<string, ProductGroup>)

  // Apply refunds to product groups
  Object.entries(refundTotals.refundsByProduct).forEach(
    ([product, {amount, count}]) => {
      if (productGroups[product]) {
        productGroups[product].refunded += amount
        productGroups[product].gross -= amount
        productGroups[product].amount -= amount
        productGroups[product].net -= amount
        productGroups[product].refundCount += count
      } else {
        // If a product only has refunds, create a new entry
        productGroups[product] = {
          productName: product,
          productId: 'unknown-id',
          count: 0,
          amount: -amount,
          gross: -amount,
          net: -amount,
          fee: 0,
          refunded: amount,
          refundCount: count,
        }
      }
    },
  )

  // Calculate totals
  const totalGross = Object.values(productGroups).reduce(
    (sum, group) => sum + group.gross,
    0,
  )
  const totalAmount = Object.values(productGroups).reduce(
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
  const totalCount = Object.values(productGroups).reduce(
    (sum, group) => sum + group.count - group.refundCount,
    0,
  )

  return {
    totals: {
      totalGross,
      totalAmount,
      totalRefunded: refundTotals.totalRefundAmount,
      totalNet,
      totalFee,
      totalCount,
      productGroups,
    },
    refundTotals,
  }
}
