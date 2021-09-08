import * as React from 'react'
import {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import type {Question, Questions} from '@skillrecordings/types'
import useQuestion from '../../../hooks/use-quiz-question'
import SubmitButton from './submit'
import CompletedMessage from './completed'

const EssayQuestion: FunctionComponent<{
  question: Question
  questions: Questions
  author?: string
  title?: string
}> = ({question, questions, author, title}) => {
  const {formik, onAnswer, isAnswered, answeredCorrectly, isSubmitting} =
    useQuestion(question, questions)

  return (
    <form onSubmit={onAnswer} className="w-full">
      <legend className="lg:text-4xl sm:text-3xl text-2xl font-semibold pb-6">
        <Markdown
          className="prose sm:prose-xl prose-lg dark:prose-dark"
          children={question?.question}
        />
      </legend>
      <label>
        <span className="text-xl font-medium pb-2 inline-block text-gray-800 dark:text-gray-300">
          Please explain:
        </span>
        <textarea
          disabled={isAnswered}
          name="answer"
          onChange={formik.handleChange}
          rows={6}
          className="form-textarea w-full text-lg dark:bg-gray-800 dark:text-white rounded-lg dark:placeholder-gray-500"
          placeholder="Type your answer here..."
        />
      </label>
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
          <SubmitButton isSubmitting={isSubmitting} isAnswered={isAnswered} />
        </div>
      )}

      {isAnswered && question?.answer && (
        <Markdown
          children={question.answer}
          className="prose sm:prose-xl prose-lg pt-5"
        />
      )}
      {isAnswered && (
        <CompletedMessage
          questions={questions}
          question={question}
          neutral={true}
          author={author}
          title={title}
        />
      )}
    </form>
  )
}

export default EssayQuestion
