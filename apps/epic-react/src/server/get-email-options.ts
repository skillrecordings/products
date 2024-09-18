import LessonCompleteEmail from '@/emails/lesson-complete-email'
import {User} from 'next-auth'

export function getLessonCompleteEmailOptions(
  user: any,
  defaultSubject: string,
  hasAuthedLocally: boolean,
  lessonWithModule: any,
  defaultBody: string,
  aiEmail?: any,
) {
  let emailOptions = {
    To: user.email,
    Subject: defaultSubject,
    Component: LessonCompleteEmail,
    componentProps: {
      user,
      hasAuthedLocally: hasAuthedLocally,
      lesson: lessonWithModule,
      body: defaultBody,
    },
  }

  if (aiEmail) {
    emailOptions = {
      To: user.email,
      Subject: aiEmail.data.subject,
      Component: LessonCompleteEmail,
      componentProps: {
        user,
        hasAuthedLocally: hasAuthedLocally,
        lesson: lessonWithModule,
        body: aiEmail.data.body,
      },
    }
  }
  return emailOptions
}
