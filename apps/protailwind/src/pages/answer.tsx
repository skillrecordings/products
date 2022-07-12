import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/layout'
import Image from 'next/image'

const Answer: React.FC<{questionSet: QuestionSet}> = ({questionSet}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}} className="bg-slate-900">
      <header className="flex items-center justify-center w-full sm:pt-16 sm:pb-0 pt-5 pb-5">
        <div className="sm:w-auto w-40">
          <Image
            src="https://res.cloudinary.com/pro-tailwind/image/upload/v1657615698/email-course/pro-tailwind-quiz_2x_bgwnsh.png"
            alt="Pro Tailwind Quiz"
            width={462 / 2.5}
            height={84 / 2.5}
          />
        </div>
      </header>
      <div className="h-full w-full flex flex-col items-center justify-center sm:py-16">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig('Pro Tailwind', 'Simon')}
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props

  const questionSet: QuestionSet = {
    welcome: {
      question: `From the list in the email, what is a new workflow step or approach you could take to evaluate websites or applications for accessibility?`,
      type: `essay`,
      tagId: 2304869, // ec - ta - 001 Welcome Completed
    },
    semantics: {
      question: `Which of these attributes are valid?`,
      type: 'multiple-choice',
      tagId: 2304880, // ec - ta - 002 Semantics Completed
      correct: ['aria-atomic', 'aria-valuetext'],
      answer:
        'While they may appear possibly legitimate, `aria-alert` and `role="tableheader"` are not valid attributes in the standard set provided by ARIA. The two other attributes are indeed valid: `aria-atomic` is part of ARIA Live Regions and `aria-valuetext` can be applied as a human-readable value for custom slider components. It\'s important to reference the [ARIA specification](https://www.w3.org/TR/wai-aria-1.1/) when using any role, state, or property to understand its usage and requirements, including ruling out use of any invalid attributes!',
      choices: [
        {
          answer: 'aria-alert',
          label: 'aria-alert',
        },
        {
          answer: 'aria-atomic',
          label: 'aria-atomic',
        },
        {
          answer: 'aria-valuetext',
          label: 'aria-valuetext',
        },
        {
          answer: 'role-tableheader',
          label: `role='tableheader'`,
        },
      ],
    },
    interaction: {
      question: `Does keyboard focus need to be visible for focus management targets?`,
      type: 'multiple-choice',
      tagId: 2304882,
      correct: 'true',
      answer: `Yes, it does! A visible focus indicator is helpful for anyone relying on the keyboard or voice control to navigate to a part of a page and see their focus point on screen.\n\nWithout this affordance, sighted keyboard users and users of voice dictation technology may not have the same understanding when interacting with a page as someone who can see and use a mouse.\n\nTo learn more about visible focus relating to client-side routing and the best characteristics for focus management targets, read an article I wrote on [accessibility in client-side routing](https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/)`,
      choices: [
        {
          answer: 'true',
          label: 'Yes, it does need to be visible',
        },
        {
          answer: 'false',
          label: 'No, it does not',
        },
      ],
    },
    tools: {
      question: `If an interactive widget won't open or function properly with a Windows screen reader running, what should you do?`,
      type: 'multiple-choice',
      tagId: 2304884, // ec - ta - 004 Tools Completed
      correct: ['check-code', 'h-key', 'focus-modes'],
      choices: [
        {
          answer: 'turn-off-reader',
          label: 'Turn off the screen reader',
        },
        {
          answer: 'h-key',
          label: 'Try hitting the H key to see if you cycle through headings',
        },
        {
          answer: 'focus-modes',
          label:
            'Use key commands to toggle between browse and focus modes manually',
        },
        {
          answer: 'check-code',
          label:
            'Check ARIA roles, states, and properties on the widget to see if coded properly',
        },
      ],
    },
    design: {
      question: `True or False: An icon button can be made accessible with an \`aria-label\`.`,
      type: 'multiple-choice',
      tagId: 2304886, // ec - ta - 005 Design Completed
      correct: 'false',
      answer: `It can't - at least not with that alone. If the icon is hard to see or understand, an aria-label would only help users running assistive technology-assuming it had adequate semantics. More visual contrast and possibly a text label may be necessary from a design standpoint as well.`,
      choices: [
        {
          answer: 'true',
          label: 'Yes, it can',
        },
        {
          answer: 'false',
          label: "No, it can't",
        },
      ],
    },
    people: {
      question: `How would you persuade your manager to include accessibility in current and upcoming sprints/iterations? If there is a lot of design and/or technical debt to achieve accessibility, what would you prioritize as the most high-impact items to tackle first?`,
      tagId: 2304888, // ec - ejs - 006 People Completed
      type: 'essay',
    },
  }
  return {
    props: {questionSet},
  }
}

export default Answer
