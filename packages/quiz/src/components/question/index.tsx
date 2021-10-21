import * as React from 'react'
import {Choice, QuestionResource, Questions} from '@skillrecordings/types'
import Button from '@skillrecordings/react/dist/components/button'
import type * as Polymorphic from '@reach/utils/polymorphic'
import {createNamedContext} from '@reach/utils/context'
import ReactMarkdown from 'react-markdown'
import {useId} from '@reach/auto-id'
import {FormikProps} from 'formik'
import last from 'lodash/last'
import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter'
import {nightOwl} from 'react-syntax-highlighter/dist/esm/styles/hljs'

const QuestionContext = createNamedContext<InternalQuestionContextValue>(
  'QuestionContext',
  {} as InternalQuestionContextValue,
)

type InternalQuestionContextValue = {
  questionId: string | undefined
} & QuestionProps

type QuestionProps = {
  horizontal?: boolean
  currentQuestion: QuestionResource
  questions: Questions
  formik: FormikProps<{answer: null | string}>
  onSubmit: () => void
  hasMultipleCorrectAnswers: boolean
  isCorrectChoice: (choice: Choice) => boolean
  isSubmitting: boolean
  answeredCorrectly: boolean
  isAnswered: boolean
}

const questionDefaultClasses = ``

const Question = React.forwardRef(function Question(
  {children, as: Comp = 'form', horizontal = false, className, ...props},
  forwardRef,
) {
  className = `${questionDefaultClasses} ${className ? className : ''}`
  const id = useId(props.id)

  const context: InternalQuestionContextValue = {
    questionId: id,
    ...props,
  }

  return (
    <QuestionContext.Provider value={context}>
      <Comp
        className={className}
        ref={forwardRef}
        onSubmit={context.onSubmit}
        data-sr-quiz-question=""
      >
        {children}
      </Comp>
    </QuestionContext.Provider>
  )
}) as Polymorphic.ForwardRefComponent<'form', QuestionProps>

type QuestionHeaderProps = {
  syntaxHighlighterTheme?: any
}

const QuestionHeader = React.forwardRef(function QuestionHeader(
  {children, syntaxHighlighterTheme = nightOwl, as: Comp = 'legend', ...props},
  forwardRef,
) {
  const {currentQuestion} = React.useContext(QuestionContext)

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-header="">
      {children}
      <ReactMarkdown
        components={{
          code({
            node,
            inline,
            className,
            children,
            ...props
          }: SyntaxHighlighterProps) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <SyntaxHighlighter
                children={String(children).replace(/\n$/, '')}
                style={syntaxHighlighterTheme}
                language={match[1]}
                PreTag="div"
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
        }}
      >
        {currentQuestion?.question}
      </ReactMarkdown>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'legend', QuestionHeaderProps>

type QuestionChoicesProps = {
  grid?: boolean
}

const QuestionChoices = React.forwardRef(function QuestionChoices(
  {children, as: Comp = 'ul', grid = false, ...props},
  forwardRef,
) {
  const {
    currentQuestion,
    formik: {errors},
  } = React.useContext(QuestionContext)

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-choices="">
      {children}
      {currentQuestion?.choices?.map((choice) => {
        return <QuestionChoice key={choice.answer} choice={choice} />
      })}

      {errors?.answer}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'ul', QuestionChoicesProps>

type QuestionChoiceProps = {
  choice: Choice
}

const QuestionChoice = React.forwardRef(function QuestionChoice(
  {children, choice, as: Comp = 'li', ...props},
  forwardRef,
) {
  const {isAnswered, formik, hasMultipleCorrectAnswers, isCorrectChoice} =
    React.useContext(QuestionContext)

  return (
    <Comp
      {...props}
      ref={forwardRef}
      data-sr-quiz-question-choice={
        isAnswered ? (isCorrectChoice(choice) ? 'correct' : 'incorrect') : ''
      }
    >
      <label>
        {choice.image && <img src={choice.image} alt={choice.answer} />}
        <input
          name="answer"
          value={choice.answer}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isAnswered}
          type={hasMultipleCorrectAnswers ? 'checkbox' : 'radio'}
        />
        <p>{choice.label}</p>
        {isAnswered && (
          <span>{isCorrectChoice(choice) ? 'correct' : 'incorrect'}</span>
        )}
      </label>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'li', QuestionChoiceProps>

type QuestionInputProps = {}

const QuestionInput = React.forwardRef(function QuestionInput(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {isAnswered, formik} = React.useContext(QuestionContext)

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-input="">
      <label htmlFor="answer">Your answer</label>
      <textarea
        rows={6}
        name="answer"
        id="answer"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={isAnswered}
        placeholder="Type your answer..."
      />
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionInputProps>

type QuestionBodyProps = {}

const QuestionBody = React.forwardRef(function QuestionBody(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {horizontal} = React.useContext(QuestionContext)

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-body="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionBodyProps>

type QuestionAnswerProps = {}

const QuestionAnswer = React.forwardRef(function QuestionAnswer(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {isAnswered, currentQuestion} = React.useContext(QuestionContext)

  return isAnswered ? (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-answer="">
      {currentQuestion.answer && (
        <ReactMarkdown>{currentQuestion.answer}</ReactMarkdown>
      )}
      {children}
    </Comp>
  ) : null
}) as Polymorphic.ForwardRefComponent<'div', QuestionAnswerProps>

type QuestionSubmitProps = {}

const QuestionSubmit = React.forwardRef(function QuestionSubmit(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {isAnswered, isSubmitting} = React.useContext(QuestionContext)

  return isAnswered ? null : (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-submit="">
      <Button isDisabled={isAnswered} isLoading={isSubmitting} type="submit">
        {children}
      </Button>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionSubmitProps>

type QuestionFooterProps = {}

const QuestionFooter = React.forwardRef(function QuestionFooter(
  {children, as: Comp = 'footer', ...props},
  forwardRef,
) {
  const {isAnswered, currentQuestion, questions, answeredCorrectly} =
    React.useContext(QuestionContext)
  const questionsKeys: string[] = Object.keys(questions)
  const lastQuestionKey: string = last(questionsKeys) || ''
  const isLast: boolean =
    questions[lastQuestionKey]?.tagId === currentQuestion?.tagId
  const srMessage = <span className="sr-only">Quiz complete.&nbsp;</span>
  const answeredMessageRef: any = React.useRef()
  const neutral: boolean = !currentQuestion?.correct
  React.useEffect(() => {
    isAnswered && answeredMessageRef.current.focus()
  }, [isAnswered])
  return isAnswered ? (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-footer="">
      {children}
      <>
        {neutral ? (
          <div>
            {isLast ? (
              <p tabIndex={-1} ref={answeredMessageRef}>
                {srMessage}
                This was the last lesson from the {'TITLE'} email course. We
                hope you learned something new, and we look forward to sharing
                more in the future!
              </p>
            ) : (
              <p tabIndex={-1} ref={answeredMessageRef}>
                {srMessage}
                <span>
                  Thanks for submitting your answer! We'll send the next lesson
                  in 5-10 minutes. Check your inbox.
                </span>
              </p>
            )}
            <p>
              Thanks, <br /> {'AUTHOR'}
            </p>
          </div>
        ) : answeredCorrectly ? (
          <div>
            <p tabIndex={-1} ref={answeredMessageRef}>
              Nice work. You chose the correct answer!
            </p>
            {isLast ? (
              <p>
                This was the last lesson from the {'TITLE'} email course. We
                hope you learned something new, and I look forward to sharing
                more in the future!
              </p>
            ) : (
              <p>
                We'll send the next lesson in 5-10 minutes. Check your inbox.
              </p>
            )}
            <p>
              Thanks, <br /> {'AUTHOR'}
            </p>
          </div>
        ) : (
          <div>
            <p tabIndex={-1} ref={answeredMessageRef}>
              You chose an incorrect answer, but don't worry. Just go back and
              re-read the email and check out any linked resources. You can
              refresh the page if you'd like to try again! 👍
            </p>
            {isLast ? (
              <p>
                This was the last lesson from the {'TITLE'} email course. We
                hope you learned something new, and I look forward to sharing
                more in the future!
              </p>
            ) : (
              <p>
                We'll send the next email in 5-10 minutes too so you can learn
                more.
              </p>
            )}
            <p>
              Thanks, <br /> {'AUTHOR'}
            </p>
          </div>
        )}
      </>
    </Comp>
  ) : null
}) as Polymorphic.ForwardRefComponent<'footer', QuestionFooterProps>

export type {
  QuestionProps,
  QuestionHeaderProps,
  QuestionChoicesProps,
  QuestionChoiceProps,
  QuestionInputProps,
  QuestionBodyProps,
  QuestionAnswerProps,
  QuestionFooterProps,
  QuestionSubmitProps,
}

export {
  Question,
  QuestionHeader,
  QuestionChoices,
  QuestionChoice,
  QuestionInput,
  QuestionBody,
  QuestionAnswer,
  QuestionFooter,
  QuestionSubmit,
}
