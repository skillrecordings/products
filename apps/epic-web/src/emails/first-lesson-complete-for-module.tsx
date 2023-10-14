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

export const FirstLessonCompleteForModule = ({
  user,
  hasAuthedLocally = false,
  lesson = {
    module: {
      title: 'an Epic Web workshop',
    },
  },
}: {
  user: {name: string; email: string}
  hasAuthedLocally: boolean
  lesson: any
}) => {
  return (
    <Html>
      <Head />
      <Preview>You are on your way.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi,</Text>
            <Text style={paragraph}>
              You completed your first lesson in {lesson.module.title}! That's
              awesome.
            </Text>
            {hasAuthedLocally ? null : (
              <Text style={paragraph}>
                For the best experience we highly recommend you use the Epic Web
                workshop application on your local machine. It allows you to
                authenticate and work through the material as intended at your
                own pace.
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default FirstLessonCompleteForModule

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
}

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
}

const container = {
  width: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
}

const content = {
  padding: '5px 50px 10px 60px',
}
