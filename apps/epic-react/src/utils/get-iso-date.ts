export const getIsoDate = (date: string) => {
  const newDate: Date = new Date(date)
  const isoString: string = newDate.toISOString()
  return isoString
}
