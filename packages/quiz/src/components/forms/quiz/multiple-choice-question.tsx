import * as React from 'react'
import {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import type {Question, Questions} from '@skillrecordings/types'
import useQuestion from '../../../hooks/use-quiz-question'
import SubmitButton from './submit'
import CompletedMessage from './completed'
import shuffle from 'lodash/shuffle'

const MultipleChoiceQuestion: FunctionComponent<{
  question: Question
  questions: Questions
  author?: string
  title?: string
}> = ({question, questions, author, title}) => {
  const {
    formik,
    onAnswer,
    hasMultipleCorrectAnswers,
    isCorrectAnswer,
    isSubmitting,
    answeredCorrectly,
    isAnswered,
  } = useQuestion(question, questions)

  const [choices, setChoices] = React.useState<any>([])

  React.useEffect(() => {
    setChoices(shuffle(question?.choices))
  }, [])

  return (
    <form onSubmit={onAnswer} className="w-full">
      <legend className="lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6">
        <Markdown
          className="prose lg:prose-xl sm:prose-lg dark:prose-dark"
          children={question?.question}
        />
      </legend>
      <div className="flex flex-col" aria-required={true}>
        {choices?.map((choice: any) => (
          <label
            key={choice.answer}
            className={`text-lg font-medium group flex items-center rounded-lg sm:p-4 p-3 mb-2 border transition-all ease-in-our duration-200 ${
              isAnswered ? 'cursor-default' : 'cursor-pointer'
            }  ${
              isAnswered
                ? isCorrectAnswer(choice)
                  ? 'bg-teal-50 text-teal-600 border-teal-200 dark:bg-teal-500 dark:bg-opacity-10 dark:text-teal-100 dark:border-teal-500'
                  : 'bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-500 dark:bg-opacity-10 dark:border-pink-500 dark:text-pink-100'
                : 'border-gray-200 bg-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
            }`}
          >
            <input
              type={hasMultipleCorrectAnswers ? 'checkbox' : 'radio'}
              name="answer"
              value={choice.answer}
              onChange={formik.handleChange}
              disabled={isAnswered}
              className={`${
                hasMultipleCorrectAnswers
                  ? 'sm:translate-y-0'
                  : 'sm:-translate-y-px'
              } border-gray-400 `}
            />
            <div className="flex sm:flex-row flex-col sm:items-center items-start justify-between relative w-full pl-2 leading-tighter">
              <span className="flex-grow">{choice.label}</span>
              {isAnswered && (
                <span
                  className={`text-xs px-2 rounded-full flex-shrink-0 ${
                    isCorrectAnswer(choice)
                      ? 'bg-teal-100 dark:bg-teal-500'
                      : 'bg-pink-100 dark:bg-pink-500'
                  }`}
                >
                  {isCorrectAnswer(choice) ? 'correct' : 'incorrect'}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {/* <textarea name="comment" onChange={formik.handleChange} /> */}
      {!isAnswered && (
        <div className="w-full py-5">
          {formik.errors.answer && (
            <div className="pb-5 font-medium text-lg">
              <span role="img" aria-label="Alert">
                ⚠️
              </span>{' '}
              {formik.errors.answer}
            </div>
          )}

          <SubmitButton isAnswered={isAnswered} isSubmitting={isSubmitting} />
        </div>
      )}
      {isAnswered && question?.answer && (
        <Markdown
          children={question.answer}
          className="prose sm:prose-xl prose-lg pt-5 dark:prose-dark"
        />
      )}
      {isAnswered && (
        <CompletedMessage
          question={question}
          questions={questions}
          answeredCorrectly={answeredCorrectly}
          author={author}
          title={title}
        />
      )}
    </form>
  )
}

export default MultipleChoiceQuestion
