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

let body = `
# test email

lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Section Two

lorem ipsum dolor sit amet, consectetur
`

export const WelcomeEmail = ({name}: {name: string | null | undefined}) => {
  return (
    <Html>
      <Head />
      <Preview>...</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Text style={paragraph}>{name ? `Hi ${name},` : 'Hi,'}</Text>
            <Text style={paragraph}>
              <Markdown>{body}</Markdown>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

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
