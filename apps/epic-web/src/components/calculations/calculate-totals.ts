import {SimplifiedCharge, SimplifiedRefund} from 'lib/transactions'

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

export function calculateTotals(
  allCharges: SimplifiedCharge[],
  allRefunds: SimplifiedRefund[],
) {
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
}
