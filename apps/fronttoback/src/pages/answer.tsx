import * as React from 'react'
import {QuizAnswerPage} from '@skillrecordings/quiz'
import {QuestionSet} from '@skillrecordings/types'
import getConfig from '@skillrecordings/quiz/dist/config'
import Layout from 'components/app/layout'

const Answer: React.FC<React.PropsWithChildren<{questionSet: QuestionSet}>> = ({
  questionSet,
}) => {
  return (
    <Layout noIndex meta={{title: 'Quiz'}} className="bg-brand-purple">
      <header className="max-w-2xl w-full px-4 mx-auto sm:pt-32 pt-24">
        <h1 className="md:text-5xl text-4xl font-bold">Quiz</h1>
      </header>
      <div className="h-full w-full flex flex-col items-center justify-center ">
        <QuizAnswerPage
          questionSet={questionSet}
          config={getConfig(
            process.env.NEXT_PUBLIC_SITE_TITLE,
            process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME,
          )}
        />
      </div>
    </Layout>
  )
}

const Image = () => {
  return null
}

export async function getStaticProps() {
  // pass the questions in as static (or dynamic!) props

  const questionSet: QuestionSet = {
    firstStop: {
      question:
        "When a user enters a URL into the address bar, a signal is sent... somewhere. Your task is to take a minute or two and consider where the request makes its first stop on its journey to deliver a webpage. Got some ideas? Write them down here. I'll read every one of these responses!",
      tagId: 3243064,
      type: 'essay',
    },
    additionalInfo: {
      question:
        "When our request reaches a server, it brings a ton of information—more than just the URL. What other information might the server need to handle the request and send back the content we're looking for? Write down two or three examples of what you think might be helpful for the server to know (other than the URL).",
      tagId: 3243066,
      type: 'essay',
    },
    headers: {
      question:
        'As you can see, headers can be pretty valuable to help our server figure out what the user wants. But when the server sends a response, it will come back with its own headers. Your task is to think of what kind of information the server might have that could be useful to the browser. Think of a few things, and respond here with your ideas.',
      tagId: 3243070,
      type: 'essay',
    },
    makeChanges: {
      question:
        'Many interactions will trigger another journey that follows the same basic path from the browser to our server and back again. But what if instead of simply requesting to receive some data we want to request our server to *change* some data? What do you think the request should do differently if it wants the server to do more than send a response. Respond here with your answer in just a few sentences or bullet points.',
      tagId: 3243072,
      type: 'essay',
    },
    postHack: {
      question:
        "Let's say a user is a clever developer. They fill out a form but decide to open up dev tools and change the `method` of the form from `GET` to `POST`. They are trying to write data that they may not have the right to update. What should the server's response to the client look like in this case? What reason might we give for not allowing the change?",
      tagId: 3243074,
      type: 'essay',
    },
    httpCodes: {
      question:
        'There are a lot of HTTP codes available, but you may not have use for all of them in your projects just yet. Review the status codes and consider which ones you might use as a backend developer, based on the projects you’ll be working on. What kind of requests from a client will your server be responding to, and which status codes will be most appropriate?',
      tagId: 3243078,
      type: 'essay',
    },
  }
  return {
    props: {questionSet},
  }
}

export default Answer
