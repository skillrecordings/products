import {fetchCharges, FetchChargesSchema} from 'lib/transactions'
import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const ROLES_WITH_ACCESS = ['ADMIN', 'SUPERADMIN']
  const token = await getToken({req})

  if (!ROLES_WITH_ACCESS.includes(token?.role as string)) {
    res.status(404).end()
    return
  }

  try {
    const {range, start, end} = FetchChargesSchema.parse(req.query)
    const charges = await fetchCharges({range, start, end})
    res.status(200).json(charges)
  } catch (error) {
    console.error('Error fetching Stripe charges:', error)
    res
      .status(500)
      .json({error: 'An error occurred while fetching Stripe charges'})
  }
}
