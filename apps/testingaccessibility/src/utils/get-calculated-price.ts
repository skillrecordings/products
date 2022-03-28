type GetCalculatePriceOptions = {
  unitPrice: number
  percentOfDiscount: number
  quantity?: number
}

/**
 * Calculates a total price for a given quantity with a fractional discount
 * applied.
 *
 * @param {string} unitPrice
 * @param {number} percentOfDiscount
 * @param {number} quantity
 */
export function getCalculatedPriced({
  unitPrice,
  percentOfDiscount,
  quantity = 1,
}: GetCalculatePriceOptions) {
  const fullPrice = unitPrice * quantity
  return Number((fullPrice * (1 - percentOfDiscount)).toFixed(2))
}
