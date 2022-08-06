import * as React from 'react'
import Layout from 'layouts'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'

const Answer: React.FC<React.PropsWithChildren<{questionSet: QuestionSet}>> = ({
  questionSet,
}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="h-full w-full flex flex-col items-center justify-center py-24 px-5">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig({
            title: 'Compilers for Humans',
            instructor: 'The C4H Team',
          })}
        />
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props
  const questionSet: QuestionSet = {
    welcome: {
      question: `## In your own words, what happens between when you write the code and when someone uses the application?`,
      type: `essay`,
      tagId: 2514815, // ec - c4h - 001 Welcome completed
    },
    transpilation: {
      question: `## You tried to use the new optional chaining feature and your project won’t build, what failed?`,
      type: `multiple-choice`,
      tagId: 2514822, // ec - c4h - 002 Three Steps completed
      correct: ['parsing'],
      answer: `Parsing failed. When attempting to transform your code string into an AST the parser came across a token it didn’t recognize, findLast. So it stopped parsing and threw an error.`,
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
    parsing: {
      question: `## What do you think an AST looks like? What sort of information does it need to contain in order to faithfully represent a program? How is it different than the parse tree we just looked at?`,
      type: `essay`,
      tagId: 2514826, // ec - e4h - 003 Parsing completed
    },
    asts: {
      question: `## ASTs are cool, but how are they used? Can you think of what comes next? What does Internet Explorer’s JS engine take as input?`,
      type: `essay`,
      tagId: 2514835, // ec - c4h - 004 - ASTs completed
    },
    codegen: {
      question: `## As we’ve just discussed, codegen takes an AST and gives us back code in string form. So where in this three step compilation process are all of our changes happening?`,
      type: `multiple-choice`,
      tagId: 2514839, // ec - c4h - 005 codegen completed
      correct: ['transform'],
      answer: `The answer is transform. Code is easiest to change when its in the form of an AST. The goal of the parsing step is to create the AST and the goal of the codegen step is to transform the AST back into code.`,
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
          answer: 'all',
          label: 'All of the Above',
        },
      ],
    },
    transform: {
      question: `## Given the line of code \`let example = true;\`, write a transform that will replace \`let\` with \`const\` for only this line. Submit your code snippet below.`,
      type: `essay`,
      tagId: 2610486, // ec - c4h - 005 Codegen completed
    },
  }
  return {
    props: {questionSet},
  }
}

export default Answer
