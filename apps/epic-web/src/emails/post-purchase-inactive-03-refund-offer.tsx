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

export const RefundOffer = () => {
  return (
    <Html>
      <Head />
      <Preview>You are on your way.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi,</Text>
            <Text style={paragraph}>
              We know life is busy and it's hard to make learning a priority.
            </Text>
            <Text style={paragraph}>
              Since it's been almost a month and you haven't had the opportunity
              to get started with Epic Web, we'd like to offer you a full refund
              before the 30-day money back offer expires soon.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default RefundOffer

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
