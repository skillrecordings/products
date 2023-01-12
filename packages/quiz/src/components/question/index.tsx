import * as React from 'react'
import {Choice, QuestionResource, QuestionSet} from '@skillrecordings/types'
import Button from '@skillrecordings/react/dist/components/button'
import type * as Polymorphic from '@reach/utils/polymorphic'
import {createNamedContext} from '@reach/utils/context'
import {FormikValues} from '../../hooks/use-question'
import {QuizConfig} from '../../config'
import {useId} from '@reach/auto-id'
import isArray from 'lodash/isArray'
import {FormikProps} from 'formik'
import Markdown from '../markdown'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFiles,
} from '@codesandbox/sandpack-react'

import {nightOwl} from '@codesandbox/sandpack-themes'

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
  currentQuestionKey?: string
  currentQuestionId?: string
  questionSet?: QuestionSet
  formik: FormikProps<FormikValues>
  onSubmit: () => void
  hasMultipleCorrectAnswers: boolean
  hasCorrectAnswer: boolean
  isCorrectChoice: (choice: Choice) => boolean
  isSubmitting: boolean
  answeredCorrectly: boolean
  isAnswered: boolean
  answer: string | string[]
  isLast: boolean
  answeredNeutral: boolean
  config: QuizConfig
  currentAnswer: string | string[] | undefined
  syntaxHighlighterTheme?: any
  questionBodyRenderer?: any
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

type QuestionHeaderProps = {}

const QuestionHeader = React.forwardRef(function QuestionHeader(
  {children, as: Comp = 'legend', ...props},
  forwardRef,
) {
  const {currentQuestion, syntaxHighlighterTheme, config} =
    React.useContext(QuestionContext)
  const {questionBodyRenderer} = config
  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-header="">
      <>
        {children}
        {questionBodyRenderer ? (
          questionBodyRenderer(currentQuestion?.question)
        ) : (
          <Markdown syntaxHighlighterTheme={syntaxHighlighterTheme}>
            {currentQuestion?.question}
          </Markdown>
        )}
      </>
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
      {errors?.answer && (
        <div data-sr-quiz-question-error="">{errors?.answer}</div>
      )}
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
    hasCorrectAnswer,
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
        isAnswered && hasCorrectAnswer
          ? isCorrectChoice(choice)
            ? 'correct'
            : 'incorrect'
          : ''
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
        {isAnswered && hasCorrectAnswer && (
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
  const {errors, values, initialValues} = formik

  return (
    <Comp
      {...props}
      ref={forwardRef}
      data-sr-quiz-question-input={errors?.answer ? 'error' : ''}
    >
      <label htmlFor="answer">Your answer</label>
      <textarea
        rows={6}
        name="answer"
        id="answer"
        value={initialValues.answer || values.answer || undefined}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={isAnswered}
        placeholder="Type your answer..."
      />
      {errors?.answer && (
        <div data-sr-quiz-question-error="">{errors?.answer}</div>
      )}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionInputProps>

type QuestionCodeSandboxProps = {}

const QuestionCodeSandbox = React.forwardRef(function QuestionCodeSandbox(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {formik} = React.useContext(QuestionContext)

  React.useEffect(() => {
    formik.setValues({answer: 'NA'})
  }, [])

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-input="">
      <SandpackLayout>
        <SandpackCodeEditor style={{height: 400}} />
      </SandpackLayout>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionCodeSandboxProps>

type QuestionCodeProps = {}

const QuestionCode = React.forwardRef(function QuestionCode(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {currentQuestion} = React.useContext(QuestionContext)

  const files: SandpackFiles | undefined =
    currentQuestion.code?.reduce<SandpackFiles>(
      (a, v) => ({
        ...a,
        [`/${v.filename}`]: {code: v.code, active: v.active},
      }),
      {},
    )

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-input="">
      {currentQuestion.type === 'code' && currentQuestion.code ? (
        <SandpackProvider
          customSetup={{
            entry: `/${currentQuestion.code[0].filename}`,
          }}
          theme={nightOwl}
          files={files}
        >
          {children}
          <QuestionCodeSandbox />
        </SandpackProvider>
      ) : (
        children
      )}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', QuestionCodeProps>

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
  const {isAnswered, syntaxHighlighterTheme, currentQuestion, config} =
    React.useContext(QuestionContext)
  const {questionBodyRenderer} = config
  return isAnswered && currentQuestion.answer ? (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-answer="">
      <>
        {questionBodyRenderer ? (
          questionBodyRenderer(currentQuestion.answer)
        ) : (
          <Markdown syntaxHighlighterTheme={syntaxHighlighterTheme}>
            {currentQuestion.answer}
          </Markdown>
        )}
        {children}
      </>
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
      <Button disabled={isAnswered} isLoading={isSubmitting} type="submit">
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
  const {
    isAnswered,
    answeredNeutral,
    isLast,
    answeredCorrectly,
    syntaxHighlighterTheme,
    config,
  } = React.useContext(QuestionContext)
  const focusRef: any = React.useRef()
  React.useEffect(() => {
    isAnswered && focusRef.current.focus()
  }, [isAnswered])

  const {afterCompletionMessages} = config

  return isAnswered ? (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-footer="">
      <div ref={focusRef} tabIndex={-1}>
        <Markdown syntaxHighlighterTheme={syntaxHighlighterTheme}>
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
        </Markdown>
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
  QuestionCodeProps,
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
  QuestionCode,
}
