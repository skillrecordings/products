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

export const WelcomeEmail = ({
  name,
  product,
}: {
  name: string | null | undefined
  product: {title: string; productId: string; slug: string}[]
}) => {
  const figmaInvite = product.some(
    (item) => item.productId === '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8',
  )
    ? `
To get started, please join our Figma team for access to DevMode. Use the invite link below:

[Join Figma Team](https://www.figma.com/team_invite/redeem/v4PpiqlduwfG4Q7VbVjIJ0)

When accepting the invite, make sure to enroll as "bootcamp" if prompted. Please keep this link confidential as it is meant exclusively for you.
`
    : ''

  const body = `
Thank you for purchasing ${product[0].title} Workshop!

${figmaInvite}

For the best experience, we highly recommend using the Epic Web workshop application on your local machine. This will allow you to authenticate and work through the material at your own pace, ensuring you get the most out of the workshop.

To get started visit the following link to learn how to set up the Epic Web workshop application: [Epic Web Get Started Workshop Setup](https://www.epicweb.dev/get-started?module=${product[0].slug})

Happy learning!

-- Kody the Koala 🐨
`

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
  backgroundColor: '#ffffff',
  fontFamily,
}

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
}

const container = {
  width: '580px',
  backgroundColor: '#ffffff',
}

const content = {
  padding: '5px 20px 10px 20px',
}
