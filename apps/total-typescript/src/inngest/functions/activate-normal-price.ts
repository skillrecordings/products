import {inngest} from '@/inngest/inngest.server'
import {prisma} from '@skillrecordings/database'

export const syncConvertkitPurchases = inngest.createFunction(
  {id: `check-price-after-promo-ends`, name: `Check Price After Promo Ends`},
  {
    cron: '0 * * * *',
  },
  async ({step}) => {
    if (new Date() < new Date('2024-12-20T07:59:59Z')) {
      return `it's too early to activate the normal price`
    }

    await step.run('activate normal price', async () => {
      await prisma.$transaction([
        prisma.price.update({
          where: {id: 'tt_price_cm4wah5nc000108l2f9gzatvp'},
          data: {
            status: 1,
          },
        }),
        prisma.merchantPrice.update({
          where: {
            id: 'tt_merchant_price_cm4waiz2f000208l269i90hok',
          },
          data: {
            status: 1,
          },
        }),
        prisma.price.update({
          where: {id: 'tt_pricecly5zrrsh000108jq70n5fj1y'},
          data: {
            status: 0,
          },
        }),
        prisma.merchantPrice.update({
          where: {
            id: 'tt_merchant_price_cly5zqma7000008jqef27dp2s',
          },
          data: {
            status: 0,
          },
        }),
      ])
    })
  },
)
