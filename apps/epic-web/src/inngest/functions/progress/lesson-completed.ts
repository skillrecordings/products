import {inngest} from 'inngest/inngest.server'
import {LESSON_COMPLETED_EVENT} from '@skillrecordings/skill-lesson/inngest/events'

export const lessonCompleted = inngest.createFunction(
  {
    id: 'lesson-completed',
    name: 'Lesson Completed',
  },
  {event: LESSON_COMPLETED_EVENT},
  async ({event, step}) => {
    return 'yup, here we are'
  },
)
