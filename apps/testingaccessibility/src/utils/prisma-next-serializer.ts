/**
 * prisma sends Dates and Decimals which next can't serialize as JSON
 * @param result
 */
export function convertToSerializeForNextResponse(result: any) {
  for (const resultKey in result) {
    if (result[resultKey] instanceof Date) {
      result[resultKey] = result[resultKey].toISOString()
    } else if (result[resultKey]?.constructor?.name === 'Decimal') {
      result[resultKey] = result[resultKey].toNumber()
    }
  }

  return result
}
