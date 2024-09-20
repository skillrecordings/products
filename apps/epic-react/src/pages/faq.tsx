import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionHeader,
  AccordionTrigger,
} from '@skillrecordings/ui'
import Layout from '@/components/app/layout'
import {drop, take} from 'lodash'
import ReactMarkdown from 'react-markdown'
import Balancer from 'react-wrap-balancer'

const FAQPage = () => {
  return (
    <Layout
      meta={{
        title: 'FAQ',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1726833192/er-faq-card_2x.jpg',
          alt: 'Epic React FAQ',
        },
      }}
    >
      <header className="flex items-center justify-center px-5 pt-20">
        <h1 className="w-full text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
          <Balancer>Frequently Asked Questions</Balancer>
        </h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg px-5 py-16 lg:py-20">
        <FaqBody />
      </main>
    </Layout>
  )
}

export function FaqBody() {
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
    <Accordion
      type="multiple"
      className="flex w-full flex-col gap-x-3 gap-y-3 md:grid md:grid-cols-2 md:gap-y-0"
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
            className="prose px-5 dark:prose-invert"
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

There are no special discounts available.

We support purchase power parity. This is automated based on IP address of the computer you are using to make the purchase. It's an imperfect system and the discount does not always display.

Note that if you use the PPP discount your purchase will be restricted to the country you purchased it from.

## How do the “team” seats work? What is a “seat” in this context

When you buy a team seat, you receive a link that can be used to register for the number of accounts you have purchased. The license is non-transferable (you cannot reassign a license from one person to another).

## If I buy a lower tier, can I upgrade later?

Yes. You pay the difference from what you paid for the lower tier to the price of Pro at the time you upgrade. This means that unless there’s still a discount on Pro, you’ll not get a discounted upgrade.

## What is PPP?

Purchasing Power Parity - a lower price for users in certain countries; content is a bit cheaper and the course is only accessible from the country it is purchased from.

## Can I gift a license to someone else?

Yes, you can! Simply enter their email address instead of your own. There might be a verification code they receive that you’ll have to request from them. Also, if you buy a PPP license, then make sure you’re both in the same country otherwise they won’t be able to access the content in their country.

## Is it possible to buy the course some other way? Installments? PayPal/etc?

No, the only available buying options are those on the site right now.

## Does PPP limit bonus content?

PPP purchases are limited to the content that is displayed at the time of purchase and current and future bonus materials and features might not be available.

When in doubt, and if you want to guarantee access to everything, purchase the PRO tier without PPP discount.

## Does my company own the team license(s)?

Team licenses are actually coupon codes that can be redeemed by users. Companies are not meant to own or keep the licenses.

They are meant to be distributed and are owned by the individual that claims that seat.

They cannot be transferred or "passed around"

## Can I customize the invoice? VAT/company details?

Yes, there’s a textarea that allows you to put any arbitrary information into the invoice PDF/printable.

## Who is Epic React for?

Epic React is for anyone with a moderate understanding of JavaScript! Give this blog post a read: [https://kentcdodds.com/blog/javascript-to-know-for-react](https://kentcdodds.com/blog/javascript-to-know-for-react). If you’re comfortable with the features in that post, then you should be good to go. If not, then you’ll struggle a little bit with the syntax and JavaScript features used in the workshops.

## What if I've been working with and studying React for years?

You'll still learn something! Epic React is tailored for all experience levels! Kent covers everything from the basic levels to the advanced to the experimental!

## I want to watch the launch Q&A, where do I go?

Here is a [link to the recording](https://www.youtube.com/watch?v=H5V9P4_vxvU).

## How much time does it take to complete the whole course?

Kent recommends around 14 weeks for a “dedicated” pace. The suggested schedule for a learning club can be found here: [KCD Learning Clubs Ideas](https://github.com/kentcdodds/kcd-learning-clubs-ideas)

## How do I get a rocket in Discord?

To link your KCD account with Discord navigate to [https://epicreact.dev/discord/](https://epicreact.dev/discord/) after you have purchased the course. Click on the button and you'll have the \`Epic React Dev\` role added to your account as well as the 🚀 added to your name!

## Is there any live aspect to Epic React or is it all self-paced?

It is all self-paced but Kent holds [office hours](https://kcd.im/office-hours) that you can join to ask questions.

You can join a learning club to check-in with other students live, learn more at https://kcd.im/clubs

In addition, [the Discord Community](https://kcd.im/discord) is very active.

## How can I join a learning club to study with other users?

Visit this link to learn about how to join a club [https://kcd.im/discord-active-clubs](https://kcd.im/discord-active-clubs). The learning clubs are student-driven, so if you don’t see one that has openings then feel free to create your own. Check the following link for more information about creating your own club: [https://kcd.im/clubs](https://kcd.im/clubs)

## Can I join an Epic React club without buying it and just use the open source repositories?

No. The Epic React learning clubs are just for those that paid for the course.

## What versions of React is this compatible with?

The course is up to date and compatible with React v19.x.

Kent plans on keeping the material up-to-date and labeling anything that changes in a way that would require code changes.

## Can I change my email address with which I bought the course?

Yes. Contact the support team at [${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}](mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}?subject=Epic%20React:%20Email%20Change%20Request). Note that you cannot transfer your license to another person.

You cannot transfer your license to another person.

## None of these are my questions, can I contact someone?

Yes! You can email the Epic React Support Email: [${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}](mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}?subject=Epic%20React%20Question)

## What are the terms and conditions?

You can [read them here](https://epicreact.dev/privacy).

`
