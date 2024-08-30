import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'
import {getProducts} from '@skillrecordings/skill-lesson/lib/products'
import {getCurrentAbility} from '@skillrecordings/skill-lesson'
import {Purchase, User} from '@skillrecordings/database'
import {loadUserForToken} from 'lib/users'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceToken = req.headers.authorization?.split(' ')[1]
  const token = await getToken({req})
  const user: (User & {purchases: Purchase[]}) | undefined | null =
    await loadUserForToken({token, deviceToken})

  if (!user) return res.status(200).json(false)

  const moduleSlug = req.query.module as string
  const module = await getModule(moduleSlug)
  const productsPurchased =
    user?.purchases?.map((purchase) => purchase.productId) || []
  const purchasedModules = await getProducts(productsPurchased)

  const ability = getCurrentAbility({
    user,
    purchasedModules,
    module,
    country: (req.headers['x-vercel-ip-country'] as string) || 'US',
  })

  return res.status(200).json(ability.can('view', 'Content'))
}

export default lesson
