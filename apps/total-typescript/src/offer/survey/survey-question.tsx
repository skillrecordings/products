import * as React from 'react'
import * as Yup from 'yup'
import {Choice, QuestionResource} from '@skillrecordings/types'
import Button from '@skillrecordings/react/dist/components/button'
import type * as Polymorphic from '@reach/utils/polymorphic'
import {createNamedContext} from '@reach/utils/context'
import {useId} from '@reach/auto-id'
import isArray from 'lodash/isArray'
import {Markdown} from '@skillrecordings/react'
import {FormikProps, useFormik} from 'formik'
import isEmpty from 'lodash/isEmpty'
import {useMachine} from '@xstate/react'
import {
  surveyMachine,
  SurveyMachineContext,
  SurveyMachineEvent,
} from './survey-machine'
import {State} from 'xstate'

export type FormikValues = {
  answer: string | string[] | null
}

export type SurveyConfig = {
  afterCompletionMessages: {
    [s: string]: {
      default: string
      last: string
    }
  }
  answerSubmitUrl?: string
  questionBodyRenderer?: (question: any) => void
}

export const SurveyQuestionContext =
  createNamedContext<InternalQuestionContextValue>('SurveyQuestionContext', {
    isLast: false,
  } as InternalQuestionContextValue)

type InternalQuestionContextValue = {
  questionId: string | undefined
  formik: FormikProps<FormikValues>
  surveyMachineState: State<SurveyMachineContext, SurveyMachineEvent>
} & SurveyQuestionProps

type SurveyQuestionProps = {
  config: SurveyConfig
  currentQuestion: QuestionResource
  isLast?: boolean
  currentAnswer?: string | string[]
  syntaxHighlighterTheme?: any
  questionBodyRenderer?: any
  handleSubmitAnswer: (context: SurveyMachineContext) => Promise<any>
  children?: React.ReactNode
}

const questionDefaultClasses = ``

const SurveyQuestion = React.forwardRef(function Question(
  {children, as: Comp = 'form', className, ...props},
  forwardRef,
) {
  className = `${questionDefaultClasses} ${className ? className : ''}`
  const id = useId(props.id)
  const [surveyMachineState, sentToSurveyMachine] = useMachine(surveyMachine, {
    context: props,
  })
  const hasMultipleCorrectAnswers = isArray(props.currentQuestion.correct)
  const {currentQuestion} = props

  React.useEffect(() => {
    if (currentQuestion) {
      sentToSurveyMachine('LOAD_QUESTION', {currentQuestion})
    }
  }, [currentQuestion, sentToSurveyMachine])

  const formik: FormikProps<FormikValues> = useFormik<FormikValues>({
    initialValues: {answer: null},
    validationSchema: Yup.object({
      answer: props.currentQuestion.correct
        ? hasMultipleCorrectAnswers
          ? Yup.array()
              .required('Pick at least one option.')
              .label('Options')
              .nullable()
          : Yup.string().required('Pick an option.').nullable()
        : Yup.string()
            .nullable()
            .required(`Can't stay empty. Mind to elaborate? :)`),
    }),
    onSubmit: async (values) => {
      return sentToSurveyMachine('ANSWER', {answer: values.answer})
    },
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
  })

  const context: InternalQuestionContextValue = {
    questionId: id,
    formik,
    surveyMachineState,
    ...props,
  }

  return (
    <SurveyQuestionContext.Provider value={context}>
      <Comp
        className={className}
        ref={forwardRef}
        onSubmit={formik.handleSubmit}
        data-sr-quiz-question=""
      >
        {children}
      </Comp>
    </SurveyQuestionContext.Provider>
  )
}) as Polymorphic.ForwardRefComponent<'form', SurveyQuestionProps>

type SurveyQuestionHeaderProps = {}

const SurveyQuestionHeader = React.forwardRef(function QuestionHeader(
  {children, as: Comp = 'legend', ...props},
  forwardRef,
) {
  const {currentQuestion, syntaxHighlighterTheme, config} = React.useContext(
    SurveyQuestionContext,
  )
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
}) as Polymorphic.ForwardRefComponent<'legend', SurveyQuestionHeaderProps>

type SurveyQuestionChoicesProps = {
  grid?: boolean
}

const SurveyQuestionChoices = React.forwardRef(function QuestionChoices(
  {children, as: Comp = 'ul', grid = false, ...props},
  forwardRef,
) {
  const {
    currentQuestion,
    formik: {errors},
  } = React.useContext(SurveyQuestionContext)

  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-choices="">
      {children}
      {currentQuestion?.choices?.map((choice, i) => {
        return (
          <SurveyQuestionChoice key={choice.answer} choice={choice} index={i} />
        )
      })}
      {errors?.answer && (
        <div data-sr-quiz-question-error="">{errors?.answer}</div>
      )}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'ul', SurveyQuestionChoicesProps>

type SurveyQuestionChoiceProps = {
  choice: Choice
  index: number
}

const SurveyQuestionChoice = React.forwardRef(function QuestionChoice(
  {children, choice, index, as: Comp = 'li', ...props},
  forwardRef,
) {
  const {surveyMachineState, formik, currentAnswer, currentQuestion} =
    React.useContext(SurveyQuestionContext)
  const isAnswered = surveyMachineState.matches('answered')
  const answer = surveyMachineState.context.answer
  const alpha = Array.from(Array(26)).map((_, i) => i + 65)
  const alphabet = alpha.map((x) => String.fromCharCode(x))

  const hasMultipleCorrectAnswers = isArray(currentQuestion.correct)
  const hasCorrectAnswer = !isEmpty(currentQuestion.correct)

  function isCorrectChoice(choice: Choice): boolean {
    return currentQuestion.correct && hasMultipleCorrectAnswers
      ? currentQuestion.correct.includes(choice.answer)
      : currentQuestion.correct === choice?.answer
  }

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
}) as Polymorphic.ForwardRefComponent<'li', SurveyQuestionChoiceProps>

type SurveyQuestionInputProps = {}

const SurveyQuestionInput = React.forwardRef(function QuestionInput(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {surveyMachineState, formik} = React.useContext(SurveyQuestionContext)
  const {errors, values, initialValues} = formik
  const isAnswered = surveyMachineState.matches('answered')

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
}) as Polymorphic.ForwardRefComponent<'div', SurveyQuestionInputProps>

type SurveyQuestionBodyProps = {}

const SurveyQuestionBody = React.forwardRef(function QuestionBody(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  return (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-body="">
      {children}
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', SurveyQuestionBodyProps>

type SurveyQuestionAnswerProps = {}

const SurveyQuestionAnswer = React.forwardRef(function QuestionAnswer(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {surveyMachineState, syntaxHighlighterTheme, currentQuestion, config} =
    React.useContext(SurveyQuestionContext)
  const {questionBodyRenderer} = config
  const isAnswered = surveyMachineState.matches('answered')
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
}) as Polymorphic.ForwardRefComponent<'div', SurveyQuestionAnswerProps>

type SurveyQuestionSubmitProps = {}

const SurveyQuestionSubmit = React.forwardRef(function QuestionSubmit(
  {children, as: Comp = 'div', ...props},
  forwardRef,
) {
  const {surveyMachineState} = React.useContext(SurveyQuestionContext)

  const isAnswered = surveyMachineState.matches('answered')
  const isSubmitting = surveyMachineState.matches('answering')

  return isAnswered ? null : (
    <Comp {...props} ref={forwardRef} data-sr-quiz-question-submit="">
      <Button isDisabled={isAnswered} isLoading={isSubmitting} type="submit">
        {children}
      </Button>
    </Comp>
  )
}) as Polymorphic.ForwardRefComponent<'div', SurveyQuestionSubmitProps>

type SurveyQuestionFooterProps = {}

const SurveyQuestionFooter = React.forwardRef(function QuestionFooter(
  {children, as: Comp = 'footer', ...props},
  forwardRef,
) {
  const {surveyMachineState, isLast, syntaxHighlighterTheme, config} =
    React.useContext(SurveyQuestionContext)
  const focusRef: any = React.useRef()
  const isAnswered = surveyMachineState.matches('answered')
  const answeredNeutral = surveyMachineState.matches('answered.neutral')
  const answeredCorrectly = surveyMachineState.matches('answered.correct')

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
}) as Polymorphic.ForwardRefComponent<'footer', SurveyQuestionFooterProps>

export type {
  SurveyQuestionProps,
  SurveyQuestionHeaderProps,
  SurveyQuestionChoicesProps,
  SurveyQuestionChoiceProps,
  SurveyQuestionInputProps,
  SurveyQuestionBodyProps,
  SurveyQuestionAnswerProps,
  SurveyQuestionFooterProps,
  SurveyQuestionSubmitProps,
}

export {
  SurveyQuestion,
  SurveyQuestionHeader,
  SurveyQuestionChoices,
  SurveyQuestionChoice,
  SurveyQuestionInput,
  SurveyQuestionBody,
  SurveyQuestionAnswer,
  SurveyQuestionFooter,
  SurveyQuestionSubmit,
}
