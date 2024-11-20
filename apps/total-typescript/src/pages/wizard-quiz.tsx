import * as React from 'react'
import {SurveyPage} from '../offer/survey/survey-page'
import {useSurveyPageOfferMachine} from '../offer/use-survey-page-offer-machine'
import {QuestionResource} from '@skillrecordings/types'
import {trpc} from '@/trpc/trpc.client'
import Layout from '@/components/app/layout'
import {sortingHat2024} from '../offer/survey/sorting-hat-2024'
import {wizardQuizConfig} from '../offer/survey/wizard-quiz-config'
import Share from '@/components/share'
import {GetServerSideProps} from 'next'

type WizardRank = {
  title: string
  description: string
  minScore: number
}

const wizardRanks: WizardRank[] = [
  {
    title: 'Novice',
    description:
      'You are beginning to grasp the fundamental scrolls of TypeScript',
    minScore: 0,
  },
  {
    title: 'Apprentice',
    description:
      'You can decipher most type runes, but the deepest mysteries elude you',
    minScore: 20,
  },
  {
    title: 'Typeweaver',
    description:
      'Your type incantations grow more powerful with each passing commit',
    minScore: 35,
  },
  {
    title: 'Mage',
    description: 'Few dare to challenge your command of advanced type sorcery',
    minScore: 45,
  },
  {
    title: 'Wizard',
    description:
      'You have transcended mere type checking. The compiler bends to your will.',
    minScore: 55,
  },
]

const calculateScore = (answers: Record<string, string>) => {
  return Object.values(answers).reduce((total, answer) => {
    const score = parseInt(answer.split('~')[1]) || 0
    return total + score
  }, 0)
}

const getWizardRank = (score: number): WizardRank => {
  return (
    [...wizardRanks].reverse().find((rank) => score >= rank.minScore) ||
    wizardRanks[0]
  )
}

const CompletionMessage: React.FC<{answers: Record<string, string>}> = ({
  answers,
}) => {
  const score = calculateScore(answers)
  const rank = getWizardRank(score)
  const maxScore = Object.keys(sortingHat2024.questions).length * 5

  return (
    <div className="mx-auto mt-6 max-w-2xl text-center">
      <div className="mb-8">
        <h2 className="mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-4xl font-bold text-transparent">
          {rank.title}
        </h2>
        <div className="mb-6 text-xl text-gray-200">{rank.description}</div>
      </div>
      <div className="rounded-lg border border-purple-500/20 bg-gray-800 p-6">
        <div className="mb-2 text-lg">
          Arcane TypeScript Power: {score} / {maxScore}
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-gray-900">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 transition-all duration-1000"
            style={{width: `${(score / maxScore) * 100}%`}}
          />
        </div>
      </div>
      <Share
        title={sortingHat2024.title || ''}
        contentType="Wizard Quiz"
        query={{rank: rank.title}}
      />
    </div>
  )
}

const WIZARD_QUIZ_ID = 'wizard_quiz_2024'

const TEST_ANSWERS: Record<string, string> = {
  q1: 'answer1~5',
  q2: 'answer2~3',
  q3: 'answer3~4',
  q4: 'answer4~5',
  q5: 'answer5~5',
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  const rank = (query.rank as string) || ''

  return {
    props: {rank},
  }
}

const getOgTitle = (rankParam?: string) => {
  if (!rankParam) return 'Take the TypeScript Wizard Quiz!'

  const rank = wizardRanks.find(
    (r) => r.title.toLowerCase() === rankParam.toLowerCase(),
  )
  if (!rank) return 'Take the TypeScript Wizard Quiz!'

  const titles = {
    Novice: "I'm a TypeScript Novice - Beginning My Journey! 🌱",
    Apprentice: "I'm a TypeScript Apprentice - Learning the Ways! ⚔️",
    Typeweaver: "I'm a TypeScript Typeweaver - Crafting Type Magic! ✨",
    Mage: "I'm a TypeScript Mage - Mastering the Dark Arts! 🔮",
    Wizard: "I'm a TypeScript Wizard - Bow Before My Types! 🧙‍♂️",
  } as const

  const title = titles[rank.title as keyof typeof titles]
  return title
}

const WizardQuizPage = ({rank}: {rank: string}) => {
  const {
    currentQuestion,
    currentQuestionId,
    isLoading,
    isComplete,
    isPresenting,
    sendToMachine,
    handleSubmitAnswer,
    subscriber,
    answers,
    machineState,
  } = useSurveyPageOfferMachine(WIZARD_QUIZ_ID)

  const answerSurveyMutation = trpc.convertkit.answerSurvey.useMutation()
  const answerSurveyMultipleMutation =
    trpc.convertkit.answerSurveyMultiple.useMutation()
  const [email, setEmail] = React.useState<string | null>(null)

  const handleEmailSubmit = async (email: string) => {
    setEmail(email)
    sendToMachine('EMAIL_COLLECTED')
  }

  React.useEffect(() => {
    if (isComplete && machineState.matches('offerComplete')) {
      answerSurveyMultipleMutation.mutate({
        email: email || subscriber?.email_address,
        answers,
        surveyId: WIZARD_QUIZ_ID,
      })
    }
  }, [isComplete])

  const ogImageUrlSearchParam = new URLSearchParams({
    title: getOgTitle(rank),
  }).toString()

  return (
    <Layout
      meta={{
        title: sortingHat2024.title,
        description:
          'Test your TypeScript knowledge and see how you rank among the wizards of the TypeScript world.',
        ogImage: {
          url: `${process.env.NEXT_PUBLIC_OG_IMAGE_URI}/og-default?${ogImageUrlSearchParam}`,
          alt: getOgTitle(rank),
        },
      }}
      survey={false}
    >
      <div id="ask">
        {isLoading ? (
          <div className="text-center text-2xl">Loading quiz...</div>
        ) : !currentQuestion && !isPresenting ? (
          <div className="text-center text-2xl">
            Quiz not available at this time.
          </div>
        ) : (
          <SurveyPage
            currentQuestionId={currentQuestionId}
            currentQuestion={currentQuestion as QuestionResource}
            handleSubmitAnswer={async (context) => {
              if (email || subscriber?.email_address) {
                answerSurveyMutation.mutate({
                  answer: context.answer,
                  question: context.currentQuestionId,
                })
              }
              await handleSubmitAnswer(context)
            }}
            surveyConfig={wizardQuizConfig}
            sendToMachine={sendToMachine}
            isComplete={isComplete}
            showEmailQuestion={machineState.matches('collectEmail')}
            onEmailSubmit={handleEmailSubmit}
            completionMessageComponent={<CompletionMessage answers={answers} />}
          />
        )}
      </div>
    </Layout>
  )
}

export default WizardQuizPage
