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

export const FirstNudge = () => {
  return (
    <Html>
      <Head />
      <Preview>You are on your way.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi,</Text>
            <Text style={paragraph}>
              You completed your first lesson! That's awesome.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default FirstNudge

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
