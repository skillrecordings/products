import * as React from 'react'
import {Choice, QuestionResource, QuestionSet} from '@skillrecordings/types'
import {nightOwl} from 'react-syntax-highlighter/dist/cjs/styles/hljs'
import Button from '@skillrecordings/react/dist/components/button'
import type * as Polymorphic from '@reach/utils/polymorphic'
import {createNamedContext} from '@reach/utils/context'
import {FormikValues} from '../../hooks/use-question'
import ReactMarkdown from 'react-markdown'
import {QuizConfig} from '../../config'
import {useId} from '@reach/auto-id'
import isArray from 'lodash/isArray'
import {FormikProps} from 'formik'
import SyntaxHighlighter, {
  SyntaxHighlighterProps,
} from 'react-syntax-highlighter'

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
  questionSet?: QuestionSet
  formik: FormikProps<FormikValues>
  onSubmit: () => void
  hasMultipleCorrectAnswers: boolean
  isCorrectChoice: (choice: Choice) => boolean
  isSubmitting: boolean
  answeredCorrectly: boolean
  isAnswered: boolean
  answer: string | string[]
  isLast: boolean
  answeredNeutral: boolean
  config: QuizConfig
  currentAnswer: string | string[] | undefined
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
                customStyle={{padding: '1rem'}}
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
      {currentQuestion?.choices?.map((choice, i) => {
        return <QuestionChoice key={choice.answer} choice={choice} index={i} />
      })}

      {errors?.answer}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'ul', QuestionChoicesProps>

type QuestionChoiceProps = {
  choice: Choice
  index: number
}

const QuestionChoice = React.forwardRef(function QuestionChoice(
  {children, choice, index, as: Comp = 'li', ...props},
  forwardRef,
) {
  const {
    isAnswered,
    formik,
    hasMultipleCorrectAnswers,
    isCorrectChoice,
    answer,
    currentAnswer,
  } = React.useContext(QuestionContext)
  const alpha = Array.from(Array(26)).map((_, i) => i + 65)
  const alphabet = alpha.map((x) => String.fromCharCode(x))

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
          checked={
            currentAnswer
              ? isArray(answer)
                ? answer?.includes(choice.answer)
                : answer === choice.answer
              : undefined
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isAnswered}
          type={hasMultipleCorrectAnswers ? 'checkbox' : 'radio'}
        />
        <p>{choice.label || alphabet[index]}</p>
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
        value={formik.initialValues.answer || undefined}
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
  const {isAnswered, answeredNeutral, isLast, answeredCorrectly, config} =
    React.useContext(QuestionContext)
  const focusRef: any = React.useRef()
  React.useEffect(() => {
    isAnswered && focusRef.current.focus()
  }, [isAnswered])

  const {afterCompletionMessages} = config // getConfig('PRODUCT_TITLE', 'AUTHOR')

  return isAnswered ? (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-footer="">
      <div ref={focusRef} tabIndex={-1}>
        <ReactMarkdown>
          {answeredNeutral
            ? isLast
              ? afterCompletionMessages.neutral.last
              : afterCompletionMessages.neutral.default
            : answeredCorrectly
            ? isLast
              ? afterCompletionMessages.correct.last
              : afterCompletionMessages.correct.default
            : isLast
            ? afterCompletionMessages.incorrect.last
            : afterCompletionMessages.incorrect.default}
        </ReactMarkdown>
        {children}
      </div>
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
