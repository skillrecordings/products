import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'

import {AUTH_DOMAIN} from '@skillrecordings/config'
import {uniq} from 'lodash'

const current = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    if (!process.env.EGGHEAD_BOT_TOKEN) {
      throw new Error('no support bot token found')
    }

    if (!req.body.email) {
      throw new Error('no email to lookup')
    }

    const token = process.env.EGGHEAD_BOT_TOKEN
    const domain = AUTH_DOMAIN

    const headers = {
      Authorization: `Bearer ${token}`,
    }

    await axios
      .get(
        `${domain}/api/v1/users/${req.body.email}?by_email=true&support=true`,
        {headers},
      )
      .then(({data}) => {
        console.log(data)
        const purchases = data.purchased
          ? data.purchased
              .filter((purchase: any) => {
                const slugs = ['epic_react', 'pro_testing']
                return slugs.includes(purchase.site)
              })
              .map((purchase: any) => {
                return {
                  site: purchase.site,
                  stripe_customer_id: purchase.stripe_customer_id,
                }
              })
          : []

        res.status(200).json(purchases)
      })
      .catch((error) => {
        console.error(error)
        res
          .status(error.response?.status ?? 500)
          .end(error.response?.statusText ?? error.message)
      })
  } else {
    res.status(200).end()
  }
}

export default current
