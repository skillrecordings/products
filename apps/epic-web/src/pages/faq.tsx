import Layout from 'components/app/layout'
import ReactMarkdown from 'react-markdown'

const FAQPage = () => (
  <Layout
    meta={{
      title: 'Epic Web FAQ',
      ogImage: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1696967714/card-faq_2x.png',
        alt: 'Epic Web FAQ',
      },
    }}
  >
    <main className="p-5 py-16 lg:py-24">
      <article className="prose mx-auto dark:prose-invert">
        <h1 className="text-center">Frequently Asked Questions</h1>
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </article>
    </main>
  </Layout>
)

export default FAQPage

const markdownContent = `

## What discounts are available?

There are no hidden special discounts available.

We support purchase power parity (PPP), based on IP address of the computer you are using to make the purchase. Note that this system isn't perfect, and the discount does not always display. Keep in mind, If you use the PPP discount your purchase will be restricted to the country you purchased it from!

## Can I pay in installments/PayPal/crypto/etc.?

No, the only available options for purchase are those currently on the site.

## Does PPP limit bonus content?

PPP purchases are limited to the content displayed at time of purchase, and any current or future bonus materials/content/features may not be available. When in doubt, if you want to guarantee access to everything, purchase the product without the PPP discount.

## How do the “team” seats work? What is a “seat” in this context?

When purchasing a team seat, you will be sent a link that can be used to register the number of accounts you have bought. Licenses are non-transferrable, i.e. a license cannot be reassigned from one person to another.

## Does my company own the team license(s)?

Team licenses are actually coupon codes that can be redeemed by users. They are owned by the individual who claims the seat– not the company. Licenses cannot be transferred or "passed around".

## If I buy one volume, will future volumes be included in my purchase?

No, each Epic Web volume is purchased separately. There is no lifetime membership or subscription option available.

## Can I customize the invoice with VAT or other company details?

Yes, after purchase you will find a text area that allows you to put any arbitrary information into the invoice PDF/printable.

## Can I gift a license to someone else?

Yes! The easiest way to gift a license is to enter their email address instead of your own. Note that there may be a verification code they will receive that you will have to request from them. Also, if using PPP it is important that you are both in the same country, or else your gift recipient will be unable to access the content. You are also able to purchase a team license and distribute links that way.

## Can I change my email address I used when purchasing the course?

Yes, by contacting the support team at [team@epicweb.dev](mailto:team@epicweb.dev?subject=Epic%Web:%20Email%20Change%20Request). Note that you cannot transfer your license to another person.

## When will future volumes be released? What content will be included?

Any future volumes will be announced as they are ready.

## How does Epic Web compare to Epic React?

Epic React teaches the patterns behind building performant, production-ready React applications. Epic Web covers a much wider range of topics including back end development, data modeling, authentication, and more– all centered around a single, cohesive real world application. Think of it like this: React is used in the Epic Web workshops, but it isn’t **taught**. The two complement one another!

## How does Epic Web compare to Testing JavaScript?

The Web Application Testing workshop included in Epic Web’s Full Stack Vol. 1 builds upon the testing patterns taught in Testing JavaScript. While there is some general overlap between topics, the Web Application Testing workshop’s focus on the full stack real world application and allows for a deeper dive and more practical application of the testing patterns you’ve already learned. For example, you’ll learn how to test authenticated user flows including 2FA and OAuth, as well as working with different database instances. The tools have also been updated to the latest and greatest available: Vitest and Playwright.

## Will Epic Web be updated?

There might be some updates to Epic Web's content, but you should base your purchase on what you see today. Purchasing an Epic Web volume does not entitle you to access for future volumes.

## Who is Epic Web for?

Epic Web is appropriate for novice to advanced-level developers who are familiar with TypeScript, the command line, and git. Lessons include links to helpful resources for those who need them. Even developers with years of experience have learned from the Full Stack Fundamentals workshop!

## Is there any live aspect to Epic Web?

Epic Web is all self-paced. However, the Discord community is very active!

## None of these are my questions, can I contact someone?

Yes! You can email the Epic Web Support Team: [team@epicweb.dev](mailto:team@epicweb.dev?subject=Epic%Web:%20Email%20Question)

## What are the terms and conditions?

You can [read them here](/privacy).
`
