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

export const SecondNudge = () => {
  return (
    <Html>
      <Head />
      <Preview>Can we help?</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi,</Text>
            <Text style={paragraph}>
              Hey, we noticed that you haven't dug into Epic Web yet, and we
              wanted to see if we could help or answer any questions. Hit reply
              and let us know.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default SecondNudge

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
