export function getCalculatedPriced(
  totalPrice: number,
  percentOfDiscount: number,
  quantity: number = 1,
) {
  return (
    totalPrice - Number((totalPrice * percentOfDiscount).toFixed(2)) * quantity
  )
}
