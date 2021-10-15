import * as React from 'react'
import {FunctionComponent} from 'react'
import Markdown from 'react-markdown'
import type {Question, Questions} from '@skillrecordings/types'
import useQuestion from '../../../hooks/use-quiz-question'
import SubmitButton from '../../submit'
import CompletedMessage from '../../completed'
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
    <form data-sr-quiz-form="multiple-choice" onSubmit={onAnswer}>
      <legend data-sr-quiz-question>
        <Markdown children={question?.question} />
      </legend>
      <ul data-sr-quiz-form-choices aria-required={true}>
        {choices?.map((choice: any) => (
          <li>
            <label
              data-sr-quiz-form-choice={
                isAnswered
                  ? isCorrectAnswer(choice)
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }
              key={choice.answer}
            >
              <input
                data-sr-quiz-form-input
                type={hasMultipleCorrectAnswers ? 'checkbox' : 'radio'}
                name="answer"
                value={choice.answer}
                onChange={formik.handleChange}
                disabled={isAnswered}
              />
              <div data-sr-quiz-form-input-label>
                {choice.label}
                {isAnswered && (
                  <span
                    data-sr-quiz-form-answered={
                      isCorrectAnswer(choice) ? 'correct' : 'incorrect'
                    }
                  >
                    {isCorrectAnswer(choice) ? 'correct' : 'incorrect'}
                  </span>
                )}
              </div>
            </label>
          </li>
        ))}
      </ul>
      {!isAnswered && (
        <>
          {formik.errors.answer && (
            <div data-sr-quiz-form-error>
              <span role="img" aria-label="Alert">
                ⚠️
              </span>{' '}
              {formik.errors.answer}
            </div>
          )}
          <SubmitButton isAnswered={isAnswered} isSubmitting={isSubmitting} />
        </>
      )}
      {isAnswered && question?.answer && (
        <div data-sr-quiz-form-answer>
          <Markdown children={question.answer} />
        </div>
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
