import config from 'config'
import React from 'react'
import type {Question} from '@skillrecordings/types'
import {questions} from 'pages/answer'
import last from 'lodash/last'

const CompletedMessage: React.FC<{
  answeredCorrectly?: boolean
  neutral?: boolean
  question: Question
}> = ({answeredCorrectly, neutral = false, question}) => {
  const questionsKeys: string[] = Object.keys(questions)
  const lastQuestionKey: string = last(questionsKeys) || ''
  const isLast: boolean = questions[lastQuestionKey].tagId === question.tagId
  const srMessage = <span className="sr-only">Quiz complete.&nbsp;</span>
  const answeredMessageRef: any = React.useRef()
  React.useEffect(() => {
    answeredMessageRef.current.focus()
  }, [])
  return (
    <>
      {neutral ? (
        <div className="pt-10 prose prose-lg text-center sm:prose-xl dark:prose-dark">
          {isLast ? (
            <p tabIndex={-1} ref={answeredMessageRef}>
              {srMessage}
              This was the last lesson from the {config.defaultTitle} email
              course. We hope you learned something new, and we look forward to
              sharing more in the future!
            </p>
          ) : (
            <p tabIndex={-1} ref={answeredMessageRef}>
              {srMessage}
              <span>
                Thanks for submitting your answer! We'll send the next lesson in
                5-10 minutes. Check your inbox.
              </span>
            </p>
          )}
          <p>
            Thanks, <br /> {config.author}
          </p>
        </div>
      ) : answeredCorrectly ? (
        <div className="pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700">
          <p tabIndex={-1} ref={answeredMessageRef}>
            Nice work. You chose the correct answer!
          </p>
          {isLast ? (
            <p>
              This was the last lesson from the {config.defaultTitle} email
              course. We hope you learned something new, and I look forward to
              sharing more in the future!
            </p>
          ) : (
            <p>We'll send the next lesson in 5-10 minutes. Check your inbox.</p>
          )}
          <p>
            Thanks, <br /> {config.author}
          </p>
        </div>
      ) : (
        <div className="pt-10 mt-10 prose prose-lg text-center border-t border-gray-200 sm:prose-xl dark:prose-dark dark:border-gray-700">
          <p tabIndex={-1} ref={answeredMessageRef}>
            You chose an incorrect answer, but don't worry. Just go back and
            re-read the email and check out any linked resources. You can
            refresh the page if you'd like to try again! 👍
          </p>
          {isLast ? (
            <p>
              This was the last lesson from the {config.defaultTitle} email
              course. We hope you learned something new, and I look forward to
              sharing more in the future!
            </p>
          ) : (
            <p>
              We'll send the next email in 5-10 minutes too so you can learn
              more.
            </p>
          )}
          <p>
            Thanks, <br /> {config.author}
          </p>
        </div>
      )}
    </>
  )
}

export default CompletedMessage
