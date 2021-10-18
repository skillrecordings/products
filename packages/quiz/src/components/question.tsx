import * as React from 'react'
import type {Question, Questions, Choice} from '@skillrecordings/types'
import Markdown from 'react-markdown'
import shuffle from 'lodash/shuffle'
import some from 'lodash/some'
import useQuestion from '../hooks/use-quiz-question'
import SubmitButton from './submit'
import CompletedMessage from './completed'

const QuestionToShow: React.FunctionComponent<{
  question: Question
  questions: Questions
  author?: string
  title?: string
  markdownProps?: any
}> = ({question, questions, author, title, markdownProps}) => {
  const {
    formik,
    onAnswer,
    hasMultipleCorrectAnswers,
    isCorrectAnswer,
    isSubmitting,
    answeredCorrectly,
    isAnswered,
  } = useQuestion(question, questions)

  const [choices, setChoices] = React.useState<Choice[]>()

  React.useEffect(() => {
    question?.choices && setChoices(shuffle(question.choices))
  }, [])

  const hasImage = choices && some(choices, (ch) => ch.image)

  return (
    <form data-sr-quiz-form onSubmit={onAnswer}>
      <legend data-sr-quiz-question>
        <Markdown {...markdownProps} children={question?.question} />
      </legend>
      {choices ? (
        <fieldset disabled={isAnswered}>
          <legend data-sr-quiz-form-label>Your answer</legend>
          <ul data-sr-quiz-choices aria-required={true}>
            {choices.map((choice: Choice) => {
              return (
                <li key={choice.answer}>
                  <label
                    data-sr-quiz-choice={
                      isAnswered
                        ? isCorrectAnswer(choice)
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }
                    key={choice.answer}
                  >
                    <input
                      data-sr-quiz-input
                      type={hasMultipleCorrectAnswers ? 'checkbox' : 'radio'}
                      name="answer"
                      value={choice.answer}
                      onChange={formik.handleChange}
                      disabled={isAnswered}
                    />
                    <div data-sr-quiz-input-label>
                      {hasImage && (
                        <img src={choice.image} alt={choice.answer} />
                      )}
                      {choice.label}
                      {isAnswered && (
                        <span
                          data-sr-quiz-answered={
                            isCorrectAnswer(choice) ? 'correct' : 'incorrect'
                          }
                        >
                          {isCorrectAnswer(choice) ? 'correct' : 'incorrect'}
                        </span>
                      )}
                    </div>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      ) : (
        <>
          <label data-sr-quiz-form-label htmlFor="answer">
            Your answer
          </label>
          <textarea
            required
            data-sr-quiz-input="textarea"
            disabled={isAnswered}
            name="answer"
            id="answer"
            onChange={formik.handleChange}
            rows={6}
            placeholder="Type your answer here..."
          />
        </>
      )}
      {!isAnswered && (
        <>
          {formik.errors.answer && (
            <div data-sr-quiz-error>
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
        <div data-sr-quiz-explanation>
          <Markdown children={question.answer} />
        </div>
      )}
      {isAnswered && (
        <CompletedMessage
          neutral={!question.correct}
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

export default QuestionToShow
