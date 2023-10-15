import LessonCompleteEmail from 'emails/lesson-complete-email'

export function getLessonCompleteEmailOptions<TTrigger, Events, TOpts>(
  event: EventsFromOpts<{
    schemas: EventSchemas<Combine<Record<string, EventPayload>, IngestEvents>>
    id: any
  }>[TTrigger extends string
    ? TTrigger
    : TTrigger extends {
        event: string
      }
    ? TTrigger['event']
    : string],
  defaultSubject: string,
  hasAuthedLocally,
  lessonWithModule,
  defaultBody: string,
  aiEmail: keyof Events & string extends keyof Events
    ? Events[keyof Events & string] | null
    : (keyof Events & string) | null,
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
