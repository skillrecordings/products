type GetCalculatePriceOptions = {
  unitPrice: number
  percentOfDiscount: number
  quantity?: number
}

export function getCalculatedPriced({
  unitPrice,
  percentOfDiscount,
  quantity = 1,
}: GetCalculatePriceOptions) {
  const fullPrice = unitPrice * quantity
  return Number((fullPrice * (1 - percentOfDiscount)).toFixed(2))
}
