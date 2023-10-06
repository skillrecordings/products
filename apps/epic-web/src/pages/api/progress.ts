import {NextApiRequest, NextApiResponse} from 'next'
import {getToken} from 'next-auth/jwt'
import {loadUserForToken} from 'lib/users'
import {getSdk} from '@skillrecordings/database'
import {getLesson} from '@skillrecordings/skill-lesson/lib/lesson-resource'

const lesson = async (req: NextApiRequest, res: NextApiResponse) => {
  const deviceToken = req.headers.authorization?.split(' ')[1]
  const token = await getToken({req})
  const user = await loadUserForToken({token, deviceToken})

  if (req.method === 'GET') {
    if (user) {
      const {getLessonProgressForUser} = getSdk()
      const lessonProgress = await getLessonProgressForUser(user.id as string)
      res.json(lessonProgress || [])
    } else {
      res.status(403).end()
    }
  } else if (req.method === 'POST') {
    if (user) {
      const {completeLessonProgressForUser} = getSdk()
      const lessonSlug = req.body.lessonSlug
      const lesson = await getLesson(lessonSlug)
      const progress = await completeLessonProgressForUser({
        userId: user.id,
        lessonId: lesson._id,
      })
      res.status(200).json(progress)
    } else {
      res.status(403).end()
    }
  } else {
    res.status(200).end()
  }
}

export default lesson
