import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'
import {Markdown} from '@react-email/markdown'

export type LessonCompleteEmailProps = {
  user: {
    name?: string | null
    email?: string | null
    id: string
  }
  hasAuthedLocally: boolean
  lesson: any
  body: string
}

export const LessonCompleteEmail = ({
  user = {id: '12345', name: 'Carlos', email: 'carlos@example.com'},
  hasAuthedLocally = false,
  body = `Hi Joel,\n\nJust catching up on your progress in the Full Stack Foundations module. Good going with the asset links management in your web applications. This lesson is fundamental for enhancing the user experience on nested routes, so it's great to see you moving along.\n\nAs a snapshot:\n- Section: Styling\n- Completed: 'Manage Asset Links in a Remix Application'\n- Module Progress: 7% \n\nRemember, every small technique you master now is adding up to a significant toolkit in full-stack web development.\n\nFor a comprehensive review or for tackling any tricky bits, all past lessons and exercises remain accessible for you.\n\nYour consistency is crucial. Every step forward counts.\n\nKeep going,\nKody the Koala 🐨`,
}: LessonCompleteEmailProps) => {
  const disclaimer = `These messages are generated using gpt-4o and are not monitored. If
            they are not helpful, you can [unsubscribe](${process.env.NEXT_PUBLIC_URL}/unsubscribed?from=kody-the-encouragement-bot&userId=${user.id}). If you'd
            like to see the code that generates these messages, you can find it
            [here on GitHub](https://github.com/skillrecordings/products/blob/main/apps/epic-react/src/inngest/functions/ai-email/write-an-email.ts).`
  return (
    <Html>
      <Head />
      <Preview>You are on your way.</Preview>
      <Body style={main}>
        <Section style={content}>
          <Markdown>{body.replace(/\\+n/g, '\n')}</Markdown>
        </Section>
        <Section style={content}>
          {hasAuthedLocally ? null : (
            <Markdown>
              PS For the best experience, we highly recommend you use the Epic
              React workshop application on your local machine. It allows you to
              authenticate and work through the material as intended at your own
              pace.
            </Markdown>
          )}
        </Section>
        <Section style={footer}>
          <Markdown>{disclaimer}</Markdown>
        </Section>
      </Body>
    </Html>
  )
}

export default LessonCompleteEmail

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  fontFamily,
}

const footer = {
  padding: '70px 8px',
  lineHeight: 1.5,
  fontSize: 12,
}

const content = {
  padding: '0 8px',
}
