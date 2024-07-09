import {NextApiRequest, NextApiResponse} from 'next'
import {getModule} from '@skillrecordings/skill-lesson/lib/modules'

const module = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const moduleSlug = req.query.module as string

    const module = await getModule(moduleSlug)

    if (module) {
      res.status(200).json(module)
    } else {
      res.status(404).end()
    }
  } else {
    res.status(404).end()
  }
}

export default module
