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
import Spinner from 'components/spinner'
import LessonsSidebar from 'components/lessons-sidebar'
import isEmpty from 'lodash/isEmpty'

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
            {lesson.description && (
              <article className="lg:mt-8">
                <div className="prose prose-md">{lesson.description}</div>
              </article>
            )}
            <Code urls={codeUrls || {}} />
            <article className="lg:mt-8">
              <div className="prose prose-md">
                <VideoTranscript transcript={videoResource?.transcript || ''} />
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
    <div>
      <div
      // className={css`
      //   color: ${colorValues['gray-darken-30']};
      //   display: flex;
      //   align-items: flex-start;
      //   flex-direction: column;
      //   font-family: ${fonts.regular};
      // `}
      >
        <div
        // className={css`
        //   display: flex;
        //   flex-direction: row;
        //   align-items: center;
        //   ${bpMaxMD} {
        //     flex-direction: column;
        //     align-items: flex-start;
        //   }
        // `}
        >
          <a
            onClick={() => {
              // track('clicked github link', {
              //   lesson: lessonSlug,
              // })
            }}
            href={branchUrl}
            // className={css`
            //   background-color: #141618;
            //   color: white;
            //   display: flex;
            //   font-size: 20px;
            //   align-items: center;
            //   text-decoration: none;
            //   padding: 1rem 1.3rem;
            //   transition: 250ms all ease;
            //   border-radius: 5px;
            //   img {
            //     filter: invert(1);
            //     margin-right: 10px;
            //     max-width: 20px;
            //   }
            //   &:hover {
            //     box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.2);
            //     transition: 250ms all ease;
            //   }
            // `}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* GitHub Icon missing */}
            {/* <img src={iconGithub} alt="Github" />*/} {message}
          </a>
          {includesBranch && (
            <p
            // className={css`
            //   font-size: 18px;
            //   padding-left: 20px;
            //   padding-top: 0;
            //   ${bpMaxMD} {
            //     padding-left: 0;
            //     padding-top: 10px;
            //   }
            // `}
            >
              The branch name corresponds to the lesson.
            </p>
          )}
        </div>
      </div>
      {!isEmpty(diffUrl) && (
        <div
        // css={css`
        //   padding-bottom: 15px;
        // `}
        >
          <a href={diffUrl}>View the Code Diff on Github</a>
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
    <div>
      <h2>{/* code icon */} Code</h2>
      <CodeSandboxEmbed url={codesandbox_url} />
      <GitHubUrls branchUrl={github_branch_url} diffUrl={github_diff_url} />
    </div>
  )
}

export default LessonTemplate
