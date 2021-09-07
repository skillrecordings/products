import format from 'date-fns/format'
import espanolLocale from 'date-fns/locale/es'

export function formatDate(date: number) {
  return format(new Date(date), 'LLLL i, yyyy', {
    locale: espanolLocale,
  })
}
