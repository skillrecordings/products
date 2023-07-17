export const getCouponLabel = (couponType: string | undefined) => {
  switch (couponType) {
    case 'special':
      return 'Special Discount'
    case 'site':
      return 'Sale'
    case 'ppp':
      return 'Regional Pricing'
    case 'bulk':
      return 'Team Discount'
    default:
      return 'Upgrade'
  }
}
