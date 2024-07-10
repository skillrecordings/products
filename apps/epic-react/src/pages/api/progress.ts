import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {getSdk, prisma} from '@skillrecordings/database'
import {getLesson} from '@skillrecordings/skill-lesson/lib/lesson-resource'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson/inngest/events'
import {inngest} from '@/inngest/inngest.server'
import {loadUserForToken} from '@/lib/users'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceToken = req.headers.authorization?.split(' ')[1]
  const token = await getToken({req})
  const user = await loadUserForToken({token, deviceToken})

  if (req.method === 'GET') {
    if (user) {
      const {getLessonProgressForUser} = getSdk()
      const lessonProgress =
        (await getLessonProgressForUser(user.id as string)) || []
      res.json(
        lessonProgress.map((progress) => {
          return {
            lessonId: progress.lessonId,
            completedAt: progress.completedAt,
          }
        }),
      )
    } else {
      res.status(403).end()
    }
  } else if (req.method === 'POST') {
    if (user) {
      const lessonSlug = req.body.lessonSlug
      const lesson = await getLesson(lessonSlug)
      if (req.body.remove) {
        const lessonProgress = await prisma.lessonProgress.findFirst({
          where: {
            lessonId: lesson._id,
            userId: user.id,
          },
        })
        if (lessonProgress) {
          await prisma.lessonProgress.delete({
            where: {
              id: lessonProgress.id,
            },
          })
          res.status(200).end()
        } else {
          res.status(404).end()
        }
      } else {
        const {completeLessonProgressForUser} = getSdk()
        const progress = await completeLessonProgressForUser({
          userId: user.id,
          lessonId: lesson._id,
        })

        await inngest.send({
          name: LESSON_COMPLETED_EVENT,
          data: {
            lessonSanityId: lesson._id,
            lessonSlug: lesson.slug,
          },
          user,
        })

        res.status(200).json({
          lessonId: progress.lessonId,
          completedAt: progress.completedAt,
        })
      }
    } else {
      res.status(403).end()
    }
  } else {
    res.status(200).end()
  }
}

export default lesson
