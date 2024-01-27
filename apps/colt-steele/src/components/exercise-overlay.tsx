import React from 'react'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import {useRouter} from 'next/router'
import {trpc} from '@/trpc/trpc.client'
import Balancer from 'react-wrap-balancer'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {useMuxPlayer} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Sandpack} from '@codesandbox/sandpack-react'

const ExerciseOverlay: React.FC<{}> = ({}) => {
  const {lesson, module} = useLesson()
  const router = useRouter()
  const {data: resources, status} =
    trpc.lessonResources.byExerciseSlug.useQuery({
      slug: router.query.lesson as string,
      type: lesson._type,
    })

  const sandpackFiles = resources?.sandpack?.files.reduce(
    (obj, {file, code}) => {
      obj[file] = code.code
      return obj
    },
    {},
  )

  const githubRepo = `https://github.com/pro-tailwind/${module?.github?.repo}`
  const githubUrl = resources?.github

  return status !== 'loading' ? (
    <div className="flex aspect-video flex-col w-full">
      <div className="flex w-full items-center justify-between p-3 pl-5 font-medium">
        <div>Now it's your turn! Try solving this exercise.</div>
        <Actions />
      </div>
      {resources?.sandpack ? (
        <Sandpack
          options={{
            activeFile: resources.sandpack.files[0].file,
            editorHeight: '100%',
            classes: {
              'sp-wrapper': 'w-full selection:bg-blue-600/30',
              'sp-layout': 'aspect-video w-full h-full',
            },
          }}
          template="static"
          theme="light"
          files={sandpackFiles}
        />
      ) : (
        <div className="relative h-full w-full">
          {resources?.github ? (
            <>
              <Image
                src={require('../../public/assets/editor-placeholder.svg')}
                layout="fill"
                className="object-cover object-left-top"
              />
              <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 text-center text-white">
                <p className="font-heading text-2xl font-black sm:pb-8 sm:text-3xl">
                  Try solving this exercise
                </p>
                <p className="text-lg font-semibold sm:text-xl">Run locally</p>
                <p className="max-w-md sm:text-lg">
                  <Balancer>
                    Clone{' '}
                    {module?.github?.repo ? (
                      <a
                        href={githubRepo}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 underline"
                      >
                        workshop repository
                      </a>
                    ) : (
                      'workshop repository'
                    )}{' '}
                    and follow instructions from the{' '}
                    {module?.github?.repo ? (
                      <a
                        href={`${githubRepo}#readme`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-300 underline"
                      >
                        README
                      </a>
                    ) : (
                      'README'
                    )}
                    .{' '}
                  </Balancer>
                </p>
                {resources?.github && (
                  <>
                    <p className="text-lg font-semibold sm:py-5 sm:text-xl">
                      or
                    </p>
                    <a
                      href={resources.github.repo}
                      target="_blank"
                      className="flex items-center gap-2 rounded-full bg-gray-800 px-3 py-1 text-lg font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3"
                      rel="noreferrer"
                    >
                      <Icon name="Github" className="h-5 w-5" /> View on Github
                    </a>
                  </>
                )}
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  ) : null
}

export default ExerciseOverlay

const Actions = () => {
  const {nextExercise, path, handlePlay, muxPlayerRef, handleContinue} =
    useMuxPlayer()
  const {lesson, module, section} = useLesson()
  const router = useRouter()

  return (
    <div className="flex items-center gap-2">
      <button
        className="rounded-md bg-gray-200 px-3 py-1 font-medium transition hover:bg-gray-300/80 sm:px-5 sm:py-2"
        onClick={() => {
          track('clicked replay', {
            lesson: lesson.slug,
            module: module.slug.current,
            location: 'exercise',
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          if (router.asPath.endsWith('/exercise')) {
            router.push(router.asPath.replace('/exercise', ''))
            if (muxPlayerRef.current) {
              muxPlayerRef.current.currentTime = 0
            }
          }
          handlePlay()
        }}
      >
        Replay <span aria-hidden="true">↺</span>
      </button>
      {nextExercise && (
        <button
          className="rounded-md bg-brand-red px-3 py-1 font-medium text-white transition hover:brightness-110 sm:px-5 sm:py-2"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue({
              router,
              module,
              nextExercise,
              handlePlay,
              path,
              section,
            })
          }}
        >
          Solution <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}
