import * as React from 'react'
import {useRouter} from 'next/router'
import {type MuxPlayerRefAttributes} from '@mux/mux-player-react'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {VideoProvider} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  customPlayFromBeginningHandler,
  customContinueHandler,
} from 'utils/custom-handlers'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'

import {trpc} from 'trpc/trpc.client'
import {z} from 'zod'
import Spinner from 'components/spinner'
import LessonsSidebar from 'components/lessons-sidebar'
import isEmpty from 'lodash/isEmpty'
import {FaGithub} from 'react-icons/fa'
import {IoCodeSharp} from 'react-icons/io5'
import {CgNotes} from 'react-icons/cg'
import ReactMarkdown from 'react-markdown'

const LessonTemplate = () => {
  const router = useRouter()
  const {videoResource} = useVideoResource()
  const muxPlayerRef = React.useRef<MuxPlayerRefAttributes>(null)
  const {lesson, module} = useLesson()
  const addProgressMutation = trpc.progress.add.useMutation()
  const {data: defaultProduct} =
    trpc['testingJavascript.products'].getDefaultProduct.useQuery()
  const {data: codeUrls} = trpc[
    'testingJavascript.lessons'
  ].getLessonCodeUrls.useQuery({
    _id: lesson._id,
  })

  const description = z.string().nullish().parse(lesson.body)

  return (
    <VideoProvider
      muxPlayerRef={muxPlayerRef}
      exerciseSlug={router.query.lesson as string}
      handleContinue={customContinueHandler}
      handlePlayFromBeginning={customPlayFromBeginningHandler}
    >
      <div className="container max-w-6xl pb-8 pt-4 md:pb-12 md:pt-6 lg:pb-16">
        <main className="relative mx-auto w-full items-start border-t border-transparent 2xl:flex 2xl:max-w-none 2xl:border-gray-800">
          <div className="flex flex-col border-gray-800 2xl:relative 2xl:h-full 2xl:w-full 2xl:border-r">
            <Video
              ref={muxPlayerRef}
              product={defaultProduct}
              exerciseOverlayRenderer={() => <div>DIIIIIV</div>}
              loadingIndicator={<Spinner />}
            />
          </div>
        </main>
        <div className="mt-12 flex flex-col-reverse lg:flex-row">
          <div className="grow">
            <h2 className="hidden leading-tight lg:block lg:text-4xl xl:text-5xl">
              {lesson.title}
            </h2>
            {description && (
              <article className="lg:mt-8">
                <ReactMarkdown className="prose md:prose-md">
                  {description}
                </ReactMarkdown>
              </article>
            )}
            <Code urls={codeUrls || {}} />
            <article className="lg:mt-16">
              <h3 data-transcript-title="">
                <CgNotes color="#9396a4" size={20} />
                <span>Transcript</span>
              </h3>
              <div className="prose prose-md">
                <VideoTranscript
                  transcript={videoResource?.transcript || ''}
                  withTitle={false}
                />
              </div>
            </article>
          </div>
          <div className="w-full shrink-0 lg:ml-8 lg:max-w-[350px]">
            <h2 className="mb-8 block text-3xl leading-tight md:text-[2.125rem] lg:hidden">
              {lesson.title}
            </h2>
            <LessonsSidebar lesson={lesson} module={module} />
          </div>
        </div>
      </div>
    </VideoProvider>
  )
}

const checkIfGitHubUrlContainsBranch = (
  github_branch_url: string | undefined,
) => {
  if (!github_branch_url) return false

  const pattern = /\/tree\/.+$/

  // Test if the URL contains a branch
  return pattern.test(github_branch_url)
}

const CodeSandboxEmbed: React.FC<{url: string | undefined}> = ({url}) => {
  if (!url) return null

  const iframeRefCallback = function iframeRefCallback(iframe: any) {
    if (iframe) {
      iframe.contentWindow.location.replace(url)
    }
  }

  return (
    <div>
      <iframe
        ref={iframeRefCallback}
        title="Code"
        allowTransparency={true}
        frameBorder="0"
        scrolling="no"
        width="100%"
        height="550px"
      />
    </div>
  )
}

const GitHubUrls: React.FC<{
  branchUrl: string | undefined
  diffUrl: string | undefined
}> = ({branchUrl, diffUrl}) => {
  if (!branchUrl) return null

  // render one or both of the GitHub URLs
  // return <div>GitHub URLs</div>
  const message = `Get the code on GitHub`

  const includesBranch = checkIfGitHubUrlContainsBranch(branchUrl)

  return (
    <div className="flex flex-col items-center space-y-4 md:items-start md:space-y-6">
      <div className="flex flex-col items-center md:flex-row">
        <a
          onClick={() => {
            // track('clicked github link', {
            //   lesson: lessonSlug,
            // })
          }}
          href={branchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-3 rounded-md bg-[#141618] px-[1.3rem] py-4 text-xl leading-none text-white duration-200 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)]"
        >
          <FaGithub />
          <span>{message}</span>
        </a>
        {includesBranch && (
          <p className="mt-3 text-lg md:ml-5 md:mt-0">
            The branch name corresponds to the lesson.
          </p>
        )}
      </div>
      {!isEmpty(diffUrl) && (
        <div>
          <a href={diffUrl} className="text-blue-600 underline">
            View the Code Diff on Github
          </a>
        </div>
      )}
    </div>
  )
}

const Code: React.FC<{
  urls: {
    github_branch_url?: string | undefined
    github_diff_url?: string | undefined
    codesandbox_url?: string | undefined
  }
}> = ({urls}) => {
  const {codesandbox_url, github_branch_url, github_diff_url} = urls

  if (isEmpty(codesandbox_url) && isEmpty(github_branch_url)) {
    return null
  }

  return (
    <div data-video-code="">
      <h3 data-title="">
        <IoCodeSharp color="#9396a4" size={24} />
        <span>Code</span>
      </h3>
      <CodeSandboxEmbed url={codesandbox_url} />
      <GitHubUrls branchUrl={github_branch_url} diffUrl={github_diff_url} />
    </div>
  )
}

export default LessonTemplate
