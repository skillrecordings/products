import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/layout'

const Answer: React.FC<React.PropsWithChildren<{questionSet: QuestionSet}>> = ({
  questionSet,
}) => {
  return questionSet ? (
    <Layout noIndex meta={{title: 'Quiz'}}>
      <div className="flex h-full w-full flex-col items-center justify-center sm:py-16">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig({
            title: 'Escuela Frontend',
            instructor: 'Escuela Frontend',
          })}
        />
      </div>
    </Layout>
  ) : null
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props

  const questionSet: QuestionSet = {
    semanticColors: {
      question:
        'In addition to `text-base`, `text-inverted`, `background-base`, and `background-inverted`, what are some examples of other semantic colors that you might want to add to your theme?',
      tagId: 3227248,
      type: 'essay',
    },
    themeApplication: {
      question:
        'When using multiple themes, how is the theme for a given HTML element determined?',
      type: 'multiple-choice',
      tagId: 3232321,
      correct: 'nearest-parent',
      choices: [
        {
          answer: 'body-data-theme',
          label:
            'The `data-theme` attribute must be specified on the body element.',
        },
        {
          answer: 'nearest-parent',
          label:
            'The element will use the theme of the nearest parent element with a `data-theme` attribute.',
        },
        {
          answer: 'default-or-local',
          label:
            'It will use the `data-theme` specified on the `body` element unless a different `data-theme` is specified directly on the element itself.',
        },
      ],
    },
    colorConversion: {
      question:
        'Why is it necessary to convert `HEX` colors to their `RGB` values for our theme?',
      type: 'multiple-choice',
      tagId: 3232326,
      correct: ['math', 'opacity', 'alpha-value'],
      answer: '',
      choices: [
        {
          answer: 'math',
          label:
            'Colors specified with `HEX` values do not support easily making calculation-based color adjustments.',
        },
        {
          answer: 'opacity',
          label:
            'We need to be able to use the `rgb` functional notation in CSS to specify the opacity for the theme colors.',
        },
        {
          answer: 'alpha-value',
          label:
            "Escuela Frontend's `<alpha-value>` property will not work with `HEX` color values.",
        },
      ],
    },
    addVariantAlternative: {
      question:
        'What alternative could be used in place of the `addVariant` Plugin helper to apply utility classes that only take effect when a given theme is active?',
      type: 'essay',
      tagId: 3232332,
    },
  }
  return {
    props: {questionSet},
  }
}

export default Answer
