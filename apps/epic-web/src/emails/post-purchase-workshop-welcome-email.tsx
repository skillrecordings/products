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
  purchaseStatus,
  bulkCouponId,
  merchantChargeId,
  teamOwnerHasAccessToContent,
  liveEventDetails,
}: {
  name: string | null | undefined
  product: {title: string; productId: string; slug: string; type: string}[]
  purchaseStatus: string
  bulkCouponId: string | null
  merchantChargeId: string | null
  teamOwnerHasAccessToContent: boolean
  liveEventDetails:
    | {
        events: {title: string; startsAt: string; endsAt: string}[] | null
        startsAt: string | null
        endsAt: string | null
        timezone: string | null
      }[]
    | null
}) => {
  const isBulk = bulkCouponId !== null

  const getEmailContent = (productId: string, purchaseStatus: string) => {
    const emailContent = () => {
      switch (productId) {
        case '7872d512-ba34-4108-b510-7db9cbcee98c':
          return `
            In this workshop, you'll develop the intuition to write effective and efficient tests while building your own testing framework from scratch. This hands-on experience will deepen your understanding and enhance your testing skills.

            The workshop is broken out into four parts, each with its own challenges and exercises that build upon the last:

            - **Principles:** Mental models behind testing strategies.
            - **Test Structure:** Learn how to write and read any test by understanding its three-step structure.
            - **Testing Async Code:** Practice testing asynchronous logic, including handling Promise rejections.
            - **Migrating to Vitest:** Transition to Vitest after building your mini-testing framework.
          `
        case '1b6e7ed6-8a15-48f1-8dd7-e76612581ee8':
          return `
            This workshop is designed to help you achieve 'pixel-perfect' design implementations with Tailwind v4, bridging the fidelity gap between design and development.

            Through a series of challenges and solution walkthroughs, you’ll be able to confidently tackle responsive layouts with help from advanced CSS Grid techniques, add polished animations to interactions, and ensure pixel-perfect accuracy every time.

            You'll need to join our Figma team for access to DevMode. Use the invite link below: 

            [Join Figma Team](https://www.figma.com/team_invite/redeem/v4PpiqlduwfG4Q7VbVjIJ0)

            When accepting the invite, make sure to enroll as "bootcamp" if prompted. Keep this link confidential as it is meant exclusively for you.
          `
        case 'dc9b750c-e3bc-4b0a-b7d2-d04a481afa0d':
          return `
            This workshop addresses the challenges of developing modern web applications, from creating visually appealing, fast, and secure apps to ensuring interactivity, responsiveness, accessibility, SEO-friendliness, and resilience to errors.
            
            You'll learn best practices for handling CSS, routing, data loading, and more, building a solid foundation for modern web development. Even experienced developers will find new skills and techniques to enhance their apps.
          `
        case '5ffdd0ef-a7a3-431e-b36b-f4232da7e454':
          return `
            Forms are essential for web interaction but can be challenging for both developers and users. Ensuring robust validation, managing complex data, and maintaining security against attacks can be overwhelming.

            This workshop will teach you how to build forms that perform well and deliver an optimal user experience. You'll learn about validating user input, managing file uploads, preventing spam, and protecting against Cross-Site Request Forgery (CSRF) attacks.
          `
        case '2267e543-51fa-4d71-a02f-ad9ba71a1f8e':
          return `
            Data modeling is essential for any full stack developer. A solid database schema ensures efficient application performance and avoids future headaches.

            In this workshop, you'll learn to design and manage robust database architectures using tools like Prisma and SQLite. We'll cover initializing databases, defining schemas, managing relationships, and optimizing queries.
          `
        case '0143b3f6-d5dd-4f20-9898-38da609799ca':
          return `
            This workshop provides a comprehensive understanding of user account management in modern web applications.
            
            You'll learn to securely handle user authentication, manage sessions, and protect against malicious attacks. Topics include password security, session management, route protection, and integrating third-party authentication providers, helping you build secure and robust authentication systems.
          `
        case '2e5b2993-d069-4e43-a7f1-24cffa83f7ac':
          return `
            Testing is crucial to ensure your application runs smoothly across all environments. This workshop will help you master effective testing strategies, from unit tests to end-to-end tests.

            You’ll dive into end-to-end testing with Playwright, learn to mock services and handle authentication, and explore unit and component testing with Vitest and Testing Library. We’ll cover how to test authenticated routes, use custom assertions, and manage test databases.

            By the end, you'll be equipped with the skills to confidently validate your code and handle the complexities of modern applications.
          `
        case 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002':
          return `
You’ve just unlocked a comprehensive series designed to transform your web development skills. This isn't a basic overview—it's a deep dive into full-stack development with practical, hands-on exercises across multiple workshops using several technologies that will give you the skills you need to build modern, secure, and scalable web apps.

The workshops are designed to be completed in a linear fashion. Starting from the beginning and working through to the end will provide the best experience.

**What's included:**

- **[Full Stack Foundations](https://www.epicweb.dev/workshops/full-stack-foundations)**: Styling, routing, data loading, data mutation, SEO and Error Handling.
- **[Professional Web Forms](https://www.epicweb.dev/workshops/professional-web-forms)**: Validate, secure, and optimize forms.
- **[Data Modeling Deep Dive](https://www.epicweb.dev/workshops/data-modeling-deep-dive)**: Design and manage robust database architectures.
- **[Authentication Strategies & Implementation:](https://www.epicweb.dev/workshops/authentication-strategies-and-implementation)** Implement secure user authentication and permissions.
- **[Web Application Testing:](https://www.epicweb.dev/workshops/web-application-testing)** Automate and refine your testing strategies.

For each of our Epic Web workshops, there's a corresponding Workshop App repository available for you to clone and run on your own computer.

 ${
   purchaseStatus === 'Valid' &&
   `
Don’t forget to check out our exclusive podcast series. These aren’t just any tech podcasts—they’re insights into real-world techniques, leadership, and the future of web development. Whether you're starting out or a seasoned pro, these discussions will enrich your understanding and inspire you to push the boundaries of what’s possible.

[Interviews with Experts](https://www.epicweb.dev/bonuses/interviews-with-experts) 🎤
  `
 }
          `
        default:
          return ''
      }
    }
    return emailContent
  }

  const emailContentIndividual = getEmailContent(
    product[0].productId,
    purchaseStatus,
  )()

  const emailContentBulk = `
You are the account owner of your team. Here's the code to share with your teammates to claim a seat:

https://www.epicweb.dev/products/${product[0].slug}?code=${bulkCouponId}

Once logged in, visit [this page](https://www.epicweb.dev/products/${
    product[0].slug
  }) to manage your team, find the shareable code, and track claimed seats. We recommend using personal emails as licenses are non-transferable.

${
  teamOwnerHasAccessToContent
    ? ''
    : 'As an account owner, you do not have access to the content. However, if you would like to claim a seat for yourself, you can use the provided code or click on the "Claim one seat for yourself" button on the team management page.'
}
  `

  const nextStepsSelfPaced = `
${
  product[0].type === 'self-paced' &&
  `
- **Workshop App:** For the best experience we highly recommend you use the Epic Web workshop application on your local machine. It allows you to authenticate and work through the material as intended at your own pace, ensuring you get the most out of the workshop. To learn how to set up the Epic Web workshop application, visit the following link: [Epic Web Get Started Workshop Setup](https://www.epicweb.dev/get-started?module=${product[0].slug})

- **Need help?:** If you ever get stuck or have code questions, you can ask them in the community Discord channel we've set up [here](https://discord.com/invite/pKfP6kY). 
  `
}
  `

  const thankYou = `
${
  product[0].type === 'self-paced' &&
  product[0].productId !== 'kcd_product_dbf94bf0-66b0-11ee-8c99-0242ac120002'
    ? `Thank you for purchasing the [${
        product[0].title
      }](https://www.epicweb.dev/workshops/${product[0].slug}) Workshop${
        isBulk ? ' for your team!' : '!'
      }`
    : `Thank you for purchasing the ${product[0].title} Bundle${
        isBulk ? ' for your team!' : '!'
      }`
}
`

  const body = `

${thankYou}

${isBulk ? emailContentBulk : emailContentIndividual}


Here are a couple of things to keep in mind:

${isBulk ? '' : nextStepsSelfPaced}

- **Access your Invoice:** Once you're logged in, you can view and fully customize your invoice [here](https://www.epicweb.dev/invoices/${merchantChargeId}). You can add any required information to the "Prepared for" section of the invoice and download a PDF that can be shared or forwarded. 

- **Customer Support:** If you have any issues accessing the content or with the platform, please email the Epic Web Support Team at [team@epicweb.dev](mailto:team@epicweb.dev)  

Happy learning!

<p>- Kody the Koala 🐨</p>
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
