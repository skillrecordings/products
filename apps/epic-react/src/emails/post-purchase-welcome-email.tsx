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
  product: {
    title: string
    productId: string
    slug: string
    type?: string | null
  }
  purchaseStatus: string
  bulkCouponId: string | null
  merchantChargeId: string | null
  teamOwnerHasAccessToContent: boolean | null
  liveEventDetails: {
    events: {title: string; startsAt: string; endsAt: string}[] | null
    startsAt: string | null
    endsAt: string | null
    timezone: string | null
  } | null
}) => {
  const isBulk = bulkCouponId !== null

  const getEmailContent = (productId: string, purchaseStatus: string) => {
    const emailContent = () => {
      switch (productId) {
        case 'kcd_product-clzlrf0g5000008jm0czdanmz':
          return `You can get [full instructions on this page](${
            process.env.NEXT_PUBLIC_URL
          }/get-started?module=react-fundamentals}) for getting started right away.

<div>
  <a href="${
    process.env.NEXT_PUBLIC_URL
  }/get-started?module=react-fundamentals">
    <img width='400' alt="full instructions video thumbnail" src="https://res.cloudinary.com/epic-web/image/upload/dpr_auto,f_auto,q_auto/v1727102348/workshop-app-intro-video.png"/>
  </a>
</div>

For the best experience, use the Epic workshop application on your local machine. Clone and run the Workshop App repository on your computer. Workshops build upon each other linearly.

**All Epic React workshops:**

- **[React Fundamentals](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/react-fundamentals)**: Starting with an HTML file and a script, you'll learn React API to build components and manage forms. Learn the fundamentals of building on the web with React.
- **[React Hooks](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/react-hooks)**: Learn React hooks to add interactivity to your apps and build dynamic websites. You'll learn the core React hooks including useState, useEffect, and useRef.
- **[Advanced React APIs](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/advanced-react-apis)**: Learn the hooks and API that React has to offer for complex state management, sharing context throughout your app, focus management and more.
- **[React Suspense](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/react-suspense)** Learn how Suspense works under the hood, preparing you for the future of asynchronous state management.
- **[Advanced React Patterns](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/advanced-react-patterns)** Make your code better than ever by learning the strengths and weaknesses of several advanced patterns so you always know exactly what to reach for.
- **[React Performance](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/react-performance)** Diagnose, profile, and fix performance problems in your React application using the Browser Profiler, React DevTools Profiler, and optimization techniques.
- **[React Server Components](${
            process.env.NEXT_PUBLIC_URL
          }/workshops/react-server-components)** Understand React Server Components and Server Actions by building a framework with them using just the Browser, Node.js, and React.

${
  purchaseStatus === 'Valid'
    ? `You also have access to these [interviews with React community experts](${process.env.NEXT_PUBLIC_URL}/bonuses/interviews-with-experts).`
    : ''
}`
        default:
          return ''
      }
    }
    return emailContent
  }

  const emailContentIndividual = getEmailContent(
    product.productId,
    purchaseStatus,
  )()

  const emailContentBulk = `You are the account owner of your team. Here's the 
link to distribute to your teammates to claim a seat:

\`${process.env.NEXT_PUBLIC_URL}/products/${product.slug}?code=${bulkCouponId}\`

Once logged in, visit [this page](${process.env.NEXT_PUBLIC_URL}/products/${
    product.slug
  }) 
to manage your team, find the shareable code, and track claimed seats. 

${
  teamOwnerHasAccessToContent
    ? `You can get 
[full instructions on this page](${process.env.NEXT_PUBLIC_URL}/get-started?module=react-fundamentals}) 
To start learning React for yourself.`
    : `As an account owner, you do not automatically have access to the content. 
However, if you would like to claim a seat for yourself, 
you can [use the provided code](${process.env.NEXT_PUBLIC_URL}/products/${product.slug}?code=${bulkCouponId}) 
or click on the "Claim one seat for yourself" button on the 
[team management page](${process.env.NEXT_PUBLIC_URL}/products/${product.slug}).`
}`

  const processEventDetails = (eventDetails: typeof liveEventDetails) => {
    if (!eventDetails) {
      return ''
    }

    const formatDate = (dateString: string) => {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }

    const formatTime = (dateString: string) => {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'America/Los_Angeles',
      })
    }

    const timezoneInfo = eventDetails.timezone
      ? `[Click here for timezones](${eventDetails.timezone})`
      : ''

    const calendarInvite = `
Event details, including the Zoom link, Google Calendar invite, and other relevant information, will be emailed to you a few days before the workshop.

Please note:

- No recording of this live event will be provided, but you will get access to the self-paced version of the workshop.
- Tickets are non-refundable but transferable.
  `

    if (eventDetails.events === null) {
      // Single-day event
      if (!eventDetails.startsAt || !eventDetails.endsAt) {
        return 'Event details are incomplete.'
      }

      const date = formatDate(eventDetails.startsAt)
      const startTime = formatTime(eventDetails.startsAt)
      const endTime = formatTime(eventDetails.endsAt)

      return `This event will occur on ${date} (Pacific time) from 
${startTime} to ${endTime} (Pacific time). ${timezoneInfo}

${calendarInvite}
`
    } else if (
      Array.isArray(eventDetails.events) &&
      eventDetails.events.length > 0
    ) {
      // Multi-day event
      const dates = eventDetails.events.map((event) =>
        formatDate(event.startsAt),
      )
      const timeRange = `${formatTime(
        eventDetails.events[0].startsAt,
      )} - ${formatTime(eventDetails.events[0].endsAt)}`

      return `The event will occur on ${dates.join(' & ')} (Pacific time) at
${timeRange} (Pacific time). ${timezoneInfo}

${calendarInvite}
`
    } else {
      return ''
    }
  }

  const liveEventContent = liveEventDetails
    ? processEventDetails(liveEventDetails)
    : ''

  const nextStepsSelfPaced =
    product?.type === 'self-paced'
      ? `
- **Workshop App:** For the best experience we highly recommend you 
use the ${process.env.NEXT_PUBLIC_SITE_TITLE} workshop application on your local machine. 
It allows you to authenticate and work through the material as intended at your own pace, 
ensuring you get the most out of the workshop. To learn how to set up the 
${process.env.NEXT_PUBLIC_SITE_TITLE} workshop application, visit the following 
link: [${process.env.NEXT_PUBLIC_SITE_TITLE} Workshop Get Started Guide](${process.env.NEXT_PUBLIC_URL}/get-started?module=${product.slug})

- **Need help?:** If you ever get stuck or have code questions, you can ask them in 
the community Discord channel we've set up [here](${process.env.NEXT_PUBLIC_URL}/discord). 
  `
      : ''

  const thankYou = (() => {
    const forTeam = isBulk ? ' for your team' : ''

    if (product?.type === 'self-paced') {
      if (product.productId === 'kcd_product-clzlrf0g5000008jm0czdanmz') {
        return `Thank you for purchasing [${product.title}](${process.env.NEXT_PUBLIC_URL}/products/${product.slug})${forTeam}!`
      } else {
        return `Thank you for purchasing [${product.title}](${process.env.NEXT_PUBLIC_URL}/workshops/${product.slug})${forTeam}!`
      }
    } else if (product?.type === 'live') {
      return `Thank you for purchasing the [${product.title}](${process.env.NEXT_PUBLIC_URL}/events/${product.slug}) Live Workshop${forTeam}!`
    } else {
      return `Thank you for purchasing the [${product.title}](${process.env.NEXT_PUBLIC_URL}/events/${product.slug})${forTeam}!`
    }
  })()

  const body = `Hi ${name ? name : 'there'},

${thankYou}

${liveEventContent}

${isBulk ? emailContentBulk : emailContentIndividual}

**Important Information:**

${isBulk ? '' : nextStepsSelfPaced}

- **Access your Invoice:** Once you're logged in, you can view and fully customize 
your invoice [here](${
    process.env.NEXT_PUBLIC_URL
  }/invoices/${merchantChargeId}). 
You can add any required information to the "Prepared for" section of the invoice 
and download a PDF that can be shared or forwarded. 

- **Customer Support:** If you have any issues accessing the content or with 
the platform, please email the ${
    process.env.NEXT_PUBLIC_SITE_TITLE
  } Support Team at [${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}](mailto:${
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL
  })  

Happy learning!

<p>- Kent C. Dodds</p>
  `

  return (
    <Html>
      <Head />
      <Preview>...</Preview>
      <Body style={main}>
        <Section style={content}>
          <Text>
            <Markdown>{body}</Markdown>
          </Text>
        </Section>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif'

const main = {
  fontFamily,
  fontSize: 14,
  lineHeight: 1.5,
}

const content = {
  padding: '5px 20px 10px 20px',
}
