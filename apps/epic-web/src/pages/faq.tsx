import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from '@skillrecordings/ui'
import Layout from 'components/app/layout'
import {drop, take} from 'lodash'
import ReactMarkdown from 'react-markdown'
import Balancer from 'react-wrap-balancer'

const FAQPage = () => {
  const questions = markdownContent
    .split('## ')
    .filter((item) => item.trim() !== '')
  const formattedQuestions = questions.map((question) => {
    const parts = question.split('\n')
    const title = parts[0].trim()
    const body = parts.slice(1).join('\n').trim()
    return {title, body}
  })
  return (
    <Layout
      meta={{
        title: 'Epic Web FAQ',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1696967714/card-faq_2x.png',
          alt: 'Epic Web FAQ',
        },
      }}
    >
      <header className="flex items-center justify-center px-5 pt-20">
        <h1 className="w-full text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
          <Balancer>Frequently Asked Questions</Balancer>
        </h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg px-5 py-16 lg:py-20">
        <Accordion
          type="multiple"
          className="flex w-full flex-col gap-x-3 md:grid md:grid-cols-2"
        >
          <ul className="flex flex-col gap-3">
            {take(formattedQuestions, formattedQuestions.length / 2).map(
              ({title, body}) => (
                <Question title={title} body={body} key={title} />
              ),
            )}
          </ul>
          <ul className="flex flex-col gap-3">
            {drop(formattedQuestions, formattedQuestions.length / 2).map(
              ({title, body}) => (
                <Question title={title} body={body} key={title} />
              ),
            )}
          </ul>
        </Accordion>
      </main>
    </Layout>
  )
}

export default FAQPage

const Question: React.FC<{title: string; body: string}> = ({title, body}) => {
  return (
    <AccordionItem
      value={title}
      className="rounded-md border border-gray-200/50 bg-white shadow-xl shadow-gray-500/5 transition dark:border-white/5 dark:bg-white/5 dark:shadow-none dark:hover:bg-white/10"
    >
      <li className="flex flex-col" key={title}>
        <AccordionHeader className="">
          <AccordionTrigger className="px-3 py-3 text-left text-base font-semibold sm:px-5 sm:py-5 sm:text-lg [&_[data-chevron]]:text-foreground">
            {title}
          </AccordionTrigger>
        </AccordionHeader>
        <AccordionContent className="pb-5">
          <ReactMarkdown
            components={{
              a: (props) => <a {...props} target="_blank" />,
            }}
            className="prose  px-5 dark:prose-invert"
          >
            {body}
          </ReactMarkdown>
        </AccordionContent>
      </li>
    </AccordionItem>
  )
}

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

## What tools are taught in the workshops?

Full stack application development requires a wide variety of tools, patterns, and techniques so the workshops use a lot of tools. Folks who went through the workshops report that even though they're not using all the same tools at work, they're still using the knowledge they gained from the workshops daily.

What you learn from the EpicWeb.dev workshop series is highly transferrable. By the end of the workshop series, you should feel confident to tackle problems in full stack web development, regardless of the tools you use.

## What is covered in the workshops?

A **lot**. Each of the workshops listed on [the workshops page](https://www.epicweb.dev/workshops) has a page dedicated to answering this question specifically. If you read through those, that should give you a good idea of what is covered.

## Is Infra/DevOps covered in the workshops?

EpicWeb.dev has a [free tutorial](https://www.epicweb.dev/tutorials/deploy-web-applications) demonstrating how you can deploy an application at scale in multiple regions all over the world (plus a distributed database). This is not covered in the workshops because the tutorial is free!

## Does EpicWeb.dev cover Artificial Intelligence (AI)?

You are encouraged to use an AI assistant in your programming even during the workshop exercises. AI assisted programming is a part of our modern world and it's important you learn how to use this tool like the other tools in your development toolbelt.

In the workshop videos, Kent uses GitHub Copilot and even demonstrates how to use Copilot effectively to help write code and how to properly review the code AI generates.

Building AI-powered features into your applications is not taught directly, but when you're finished you should not have issues adding AI-powered features to your application based on the knowedge you gain from the workshops.

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

The Web Application Testing workshop included in Epic Web’s Full Stack Vol. 1 builds upon the testing patterns taught in Testing JavaScript. While there is some general overlap between topics, the Web Application Testing workshop’s focus on the full stack real world application and allows for a deeper dive and more practical application of the testing patterns you’ve already learned.

For example, you’ll learn how to test authenticated user flows including 2FA and OAuth, as well as working with different database instances. The tools have also been updated to the latest and greatest available: Vitest and Playwright.

## Will Epic Web be updated?

There might be some updates to Epic Web's content, but you should base your purchase on what you see today. Purchasing an Epic Web volume does not entitle you to access for future volumes.

## Who is Epic Web for?

Epic Web is appropriate for novice to advanced-level developers who are familiar with TypeScript, the command line, and git. Lessons include links to helpful resources for those who need them. Even developers with years of experience have learned from the workshops (even the Full Stack Fundamentals)!

## Are there any pre-requisites?

The workshop repos list pre-requisites and recommended reading before you start the workshops. In general, you should have a basic understanding of [JavaScript](https://kentcdodds.com/blog/javascript-to-know-for-react), [TypeScript](https://www.totaltypescript.com/tutorials), [React](https://kcd.im/beginner-react), [Node.js](https://nodejs.dev/en/learn/), and [git](https://www.freecodecamp.org/news/the-beginners-guide-to-git-github/) (links are to free resources to learn the basics).

Advanced knowledge in these tools is beneficial (like the knowledge you get from [EpicReact.dev](https://epicreact.dev) or [TestingJavaScript.com](https://testingjavascript.com)), but not required.

## What order should I take the workshops in?

The workshops are linear and build on each other step-by-step. The best experience will come to those who start at the beginning and work through to the end. If you're concerned the early workshops will be too basic to be worth your time, then you shouldn't have a problem getting through them very quickly 😉

## Is there any live aspect to Epic Web?

Epic Web is all self-paced. However, the [Discord community](https://kentcdodds.com/discord) is very active!

## None of these are my questions, can I contact someone?

Yes! You can email the Epic Web Support Team: [team@epicweb.dev](mailto:team@epicweb.dev?subject=Epic%Web:%20Email%20Question)

## What are the terms and conditions?

You can [read them here](/privacy).
`
