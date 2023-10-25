import {getSdk} from '@skillrecordings/database'
import {getModuleProgress} from '@skillrecordings/skill-lesson/lib/module-progress'
import {getModuleById} from '@skillrecordings/skill-lesson/lib/modules'
import {NextApiRequest, NextApiResponse} from 'next'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {getUserById} = getSdk()
  const {moduleId, userId} = req.query

  const user =
    userId &&
    (await getUserById({
      where: {
        id: userId as string,
      },
    }))

  const module = await getModuleById(moduleId as string)

  const moduleProgress = await getModuleProgress({
    moduleSlug: module.slug,
    userId: userId as string,
  })

  const isCompleted = moduleProgress?.moduleCompleted

  if (!user) {
    res.status(404).json({error: 'User not found'})
  } else if (!isCompleted) {
    res.status(404).json({error: 'Module not completed'})
  } else {
    try {
      // Fetch the image from the edge runtime endpoint (certificate/generate)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/certificate/generate?moduleId=${moduleId}&name=${user.name}`,
        {
          method: 'GET',
        },
      )

      if (response.ok) {
        // Set the response content type to match the image type
        res.setHeader('Content-Type', 'image/png')

        // Convert the response body to a buffer and send it as the response
        const buffer = await response.arrayBuffer()
        res.send(Buffer.from(buffer))
      } else {
        // Handle errors from the edge runtime endpoint
        res.status(response.status).json({
          error: `Failed to generate the certificate image: ${response.statusText}`,
        })
      }
    } catch (error) {
      console.error(error)
      res.status(500).json({error: 'Internal Server Error'})
    }
  }
}
