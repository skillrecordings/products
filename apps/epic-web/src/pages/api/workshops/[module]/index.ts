import {NextApiRequest, NextApiResponse} from 'next'
import {getModuleWithResources} from '@skillrecordings/skill-lesson/lib/modules'
import {getTutorial} from 'lib/tutorials'

const module = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const moduleSlug = req.query.module as string

    let module = await getModuleWithResources(moduleSlug)

    if (!module) {
      const tutorial = await getTutorial(moduleSlug)
      if (tutorial) {
        module = {
          ...tutorial,
          resources:
            tutorial.sections?.map((section: any) => ({
              _id: section._id,
              _type: section._type,
              slug: section.slug,
              lessons: section.lessons,
            })) ?? null,
        }
      }
    }

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
