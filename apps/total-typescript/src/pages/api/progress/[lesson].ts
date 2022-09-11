import {withSentry} from '@sentry/nextjs'
import {NextApiRequest, NextApiResponse} from 'next'
import {getSdk} from '@skillrecordings/database'
import z from 'zod'

const Subscriber = z.object({
  id: z.number(),
  first_name: z.string().optional(),
  email_address: z.string(),
  state: z.string(),
})

type Subscriber = z.infer<typeof Subscriber>

const lessonProgressHandler = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  if (req.method === 'POST') {
    try {
      const {findOrCreateUser, completeLessonProgressForUser} = getSdk()
      const lessonSlug = req.query.lesson as string
      const subscriberCookie = req.cookies['ck_subscriber']

      if (!subscriberCookie) {
        res.status(200).end()
        return
      }

      const subscriber = Subscriber.parse(JSON.parse(subscriberCookie))

      if (!subscriber) {
        res.status(200).end()
        return
      }

      const {user} = await findOrCreateUser(subscriber.email_address)

      const progress = await completeLessonProgressForUser({
        userId: user.id,
        lessonSlug,
      })

      res.status(200).json(progress)
    } catch (e) {
      console.error(e)
      res.status(200).end()
    }
  } else {
    console.error('non-post request made')
    res.status(404).end()
  }
}

export default withSentry(lessonProgressHandler)
export const config = {
  api: {
    externalResolver: true,
  },
}
