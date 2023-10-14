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

export const ModuleCompleted = ({
  user,
  module = {
    title: 'an Epic Web workshop',
  },
}: {
  user: {name: string; email: string}
  module: any
}) => {
  return (
    <Html>
      <Head />
      <Preview>Nice work.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>Hi,</Text>
            <Text style={paragraph}>
              You completed {module.title}! That's awesome.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ModuleCompleted

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
