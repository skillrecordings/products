export const sortPurchases = (purchase1: any, purchase2: any) => {
  const sellableSlug = process.env.NEXT_PUBLIC_PRO_SLUG as string
  const ranks = {
    [sellableSlug]: 1,
  }

  if (purchase1.upgraded_from_purchase_id) {
    return -1
  }
  if (purchase2.upgraded_from_purchase_id) {
    return 1
  }
  if (!ranks.hasOwnProperty(purchase1.slug) || purchase1.quantity > 1) {
    return 1
  }
  if (!ranks.hasOwnProperty(purchase2.slug) || purchase2.quantity > 1) {
    return -1
  }
  return ranks[purchase1.slug] - ranks[purchase2.slug]
}

const rankedPackages = (packages = []) => {
  return packages.sort(sortPurchases)
}

export default rankedPackages
