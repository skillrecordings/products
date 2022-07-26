export const getCouponLabel = (couponType: string) => {
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
      return 'Discount'
  }
}
