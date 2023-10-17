import LessonCompleteEmail from 'emails/lesson-complete-email'

export function getLessonCompleteEmailOptions(
  event: {user?: any},
  defaultSubject: string,
  hasAuthedLocally: boolean,
  lessonWithModule: any,
  defaultBody: string,
  aiEmail?: any,
) {
  let emailOptions = {
    To: event.user.email,
    Subject: defaultSubject,
    Component: LessonCompleteEmail,
    componentProps: {
      user: event.user,
      hasAuthedLocally: hasAuthedLocally,
      lesson: lessonWithModule,
      body: defaultBody,
    },
  }

  if (aiEmail) {
    emailOptions = {
      To: event.user.email,
      Subject: aiEmail.data.subject,
      Component: LessonCompleteEmail,
      componentProps: {
        user: event.user,
        hasAuthedLocally: hasAuthedLocally,
        lesson: lessonWithModule,
        body: aiEmail.data.body,
      },
    }
  }
  return emailOptions
}
