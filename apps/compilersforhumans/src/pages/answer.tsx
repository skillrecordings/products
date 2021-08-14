import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {Questions} from '@skillrecordings/types'

//TODO: apply styling differences

// <Layout noIndex meta={{title: 'Quiz'}}>
// <header>
// <Link href="/">
//   <a aria-label="Home" className="sm:w-36 w-28 sm:mt-6 mt-4 absolute">
//   <h1 className="sr-only">Quiz</h1>
// </a>
// </Link>
// </header>
// <div className="px-5 max-w-screen-sm w-full mx-auto flex items-center justify-center xl:pt-36 md:pt-32 pt-24 sm:pb-16 pb-8">
// {QuestionToShow()}
// </div>
// </Layout>

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questions: Questions = {
    welcome: {
      question: `## In your own words, what happens between when you write the code and when someone uses the application?`,
      type: `essay`,
      tagId: 2514815, // ec - c4h - 001 Welcome completed
    },
    transpilation: {
      question: `## You tried to use the new findLast array method and your project won’t build, what failed?`,
      type: `multiple-choice`,
      tagId: 2514822, // ec - c4h - 002 Three Steps completed
      correct: ['parsing'],
      answer: ``,
      choices: [
        {
          answer: 'parsing',
          label: 'Parsing',
        },
        {
          answer: 'transform',
          label: 'Transform',
        },
        {
          answer: 'codegen',
          label: 'Code Generation',
        },
        {
          answer: 'semicolon',
          label: 'Semicolons',
        },
      ],
    },
    asts: {
      question: `Given the line of code \`const example = true;\`, how does the AST representation change if we use \`let\` instead? What if we change \`example\` to be a string \`"My new boolean"\`? Use [astexplorer.net](https://astexplorer.net) for help!`,
      type: `essay`,
      tagId: 2514826, // ec - c4h - 003 ASTs completed
    },
    transform: {
      question: `Given the line of code \`let example = true;\`, write a transform that will replace \`let\` with \`const\` for only this line. Submit your code snippet below.`,
      type: `essay`,
      tagId: 2514835, // ec - c4h - 004 Transform completed
    },
    codegen: {
      question: `## What compiler topics are you most interested in exploring further?`,
      type: `essay`,
      tagId: 2514839, // ec - c4h - 005 codegen completed
    },
  }
  return {
    props: {questions},
  }
}

export default QuizAnswerPage
