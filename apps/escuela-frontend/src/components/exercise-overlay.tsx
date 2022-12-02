import React from 'react'
import {SanityDocument} from '@sanity/client'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {Facebook, LinkedIn, Twitter} from '@skillrecordings/react'
import {NextRouter, useRouter} from 'next/router'
import snakeCase from 'lodash/snakeCase'
import Image from 'next/image'
import {useMuxPlayer} from 'hooks/use-mux-player'
import {XIcon} from '@heroicons/react/solid'
import cx from 'classnames'
import {track} from '../utils/analytics'
import {setUserId} from '@amplitude/analytics-browser'
import {sanityClient} from 'utils/sanity-client'
import {PortableText} from '@portabletext/react'
import {useQuery} from 'react-query'
import {trpc} from '../utils/trpc'
import Spinner from './spinner'
import {StackBlitzIframe} from './stackblitz-iframe'
import dynamic from 'next/dynamic'
import {IconGithub} from './icons'

const SandpackEditor: React.ComponentType<any> = dynamic(
  () => import('components/sandpack/repl'),
  {ssr: false},
)

export const OverlayWrapper: React.FC<
  React.PropsWithChildren<{className?: string; dismissable?: boolean}>
> = ({children, className, dismissable = true}) => {
  const {setDisplayOverlay, lesson, module} = useMuxPlayer()

  return (
    <div
      id="video-overlay"
      className="relative top-0 left-0 flex aspect-video w-full items-center justify-center border border-gray-700 bg-gray-900 text-sm sm:text-lg"
    >
      {dismissable && (
        <button
          className="absolute top-2 right-2 z-50 flex items-center justify-center gap-1 rounded-md  bg-gray-600 py-2 px-3.5 font-medium text-gray-300 transition hover:bg-gray-500 "
          onClick={() => {
            track('dismissed video overlay', {
              lesson: lesson.slug,
              module: module.slug.current,
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            setDisplayOverlay(false)
          }}
        >
          <span>Despedir</span>{' '}
          <XIcon className="h-4 w-4 text-gray-300" aria-hidden="true" />
        </button>
      )}
      <div
        className={cx(
          'absolute left-0 top-0 z-20 flex h-full w-full flex-col items-center justify-center text-center text-lg leading-relaxed',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}

const Actions = () => {
  const {nextExercise, lesson, module, path, handlePlay} = useMuxPlayer()
  const router = useRouter()
  return (
    <div className="flex justify-center gap-2">
      <button
        className="rounded-md bg-gray-600 px-3 py-1 font-medium transition hover:bg-gray-500/80 sm:px-5 sm:py-2"
        onClick={() => {
          track('clicked replay', {
            lesson: lesson.slug,
            module: module.slug.current,
            location: 'exercise',
            moduleType: module.moduleType,
            lessonType: lesson._type,
          })
          handlePlay()
        }}
      >
        Ver de nuevo <span aria-hidden="true">↺</span>
      </button>
      {nextExercise && (
        <button
          className="rounded-md bg-green-500 px-3 py-1 font-medium text-white transition hover:bg-green-400 sm:px-5 sm:py-2"
          onClick={() => {
            track('clicked continue to solution', {
              lesson: lesson.slug,
              module: module?.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handleContinue(router, module, nextExercise, handlePlay, path)
          }}
        >
          Solución <span aria-hidden="true">→</span>
        </button>
      )}
    </div>
  )
}

const ExerciseOverlay = () => {
  const {lesson, module} = useMuxPlayer()
  const {github} = module
  const stackblitz = lesson.stackblitz

  return (
    <div className=" bg-black/30 ">
      {stackblitz ? (
        <>
          <div className="flex w-full items-center justify-between p-3 pl-5 font-medium sm:text-lg">
            <div>¡Ahora es tu turno!</div>
            <div className="flex justify-center gap-2">
              <Actions />
            </div>
          </div>
          <div className="relative hidden h-[500px] w-full sm:block xl:h-[750px]">
            <StackBlitzIframe exercise={lesson} module={module} />
          </div>
        </>
      ) : (
        <div className="flex aspect-video flex-col items-center justify-center gap-5 p-3 text-center">
          <p className="font-text text-3xl font-bold">¡Tu turno!</p>
          <p className="">
            Intenta resolver este ejercicio. Si te quedas atascado, puedes ver
            la solución.
          </p>
          <Actions />
        </div>
      )}
      <div className="flex aspect-video flex-col items-center justify-center gap-5 p-3 text-center sm:hidden">
        <p className="font-text text-3xl font-bold">¡Tu turno!</p>
        <p className="">
          Intenta resolver este ejercicio dentro{' '}
          <a
            href={`https://github.com/escuela-frontend/${github.repo}/blob/main/${stackblitz}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1 rounded-sm bg-gray-800 py-0.5 px-1 font-mono text-sm"
          >
            <IconGithub /> {stackblitz}
          </a>{' '}
          file.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Actions />
        </div>
      </div>
    </div>
  )
}

const DefaultOverlay = () => {
  const {nextExercise, module, path, lesson, handlePlay} = useMuxPlayer()
  const router = useRouter()
  const {image} = module
  const addProgressMutation = trpc.useMutation(['progress.add'])

  return (
    <OverlayWrapper className="px-5">
      {image && (
        <div className="hidden items-center justify-center sm:flex sm:w-40 lg:w-auto">
          <Image
            src={image}
            alt=""
            aria-hidden="true"
            width={220}
            height={220}
          />
        </div>
      )}

      <p className="pt-4 font-heading text-xl font-bold sm:text-3xl">
        <span className="font-light text-gray-300">Siguiente lección:</span>{' '}
        {nextExercise.title}
      </p>
      <div className="flex items-center justify-center gap-5 py-4 sm:py-8">
        <button
          className="rounded-md bg-gray-600 px-3 py-1 text-sm font-semibold transition hover:bg-gray-500 sm:px-5 sm:py-3 sm:text-lg"
          onClick={() => {
            track('clicked replay', {
              lesson: lesson.slug,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            handlePlay()
          }}
        >
          Ver de nuevo ↺
        </button>
        <button
          className="rounded-md bg-brand px-3 py-1 text-sm font-semibold text-white transition hover:brightness-125 sm:px-5 sm:py-3 sm:text-lg"
          onClick={() => {
            track('clicked complete', {
              lesson: lesson.slug,
              module: module.slug.current,
              location: 'exercise',
              moduleType: module.moduleType,
              lessonType: lesson._type,
            })
            addProgressMutation.mutate(
              {lessonSlug: lesson.slug},
              {
                onSettled: (data, error, variables, context) => {
                  handleContinue(router, module, nextExercise, handlePlay, path)
                },
              },
            )
          }}
        >
          Completar y Continuar <span aria-hidden="true">→</span>
        </button>
      </div>
    </OverlayWrapper>
  )
}

const FinishedOverlay = () => {
  const {module, path, lesson, handlePlay} = useMuxPlayer()
  const router = useRouter()
  const shareUrl = `${process.env.NEXT_PUBLIC_URL}${path}/${module.slug.current}`
  const shareMessage = `${module.title} ${module.moduleType} by @${process.env.NEXT_PUBLIC_PARTNER_TWITTER}`
  const shareButtonStyles =
    'bg-gray-500 shadow-xl shadow-gray-500/5 flex items-center gap-2 rounded-md px-4 py-2 hover:bg-gray-600'

  const addProgressMutation = trpc.useMutation(['progress.add'])

  React.useEffect(() => {
    // since this is the last lesson and we show the "module complete" overlay
    // we run this when the effect renders marking the lesson complete
    addProgressMutation.mutate({lessonSlug: lesson.slug})
  }, [])

  return (
    <OverlayWrapper className="px-5 pt-10 sm:pt-0">
      <p className="font-text font-heading text-2xl font-bold text-white sm:text-3xl">
        Comparte este tutorial!
      </p>
      <div className="flex items-center gap-2 py-8">
        <Twitter
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          Twitter
        </Twitter>
        <Facebook
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          Facebook
        </Facebook>
        <LinkedIn
          link={shareUrl}
          message={shareMessage}
          className={shareButtonStyles}
        >
          LinkedIn
        </LinkedIn>
      </div>
      <div className="flex items-center justify-center divide-x divide-gray-300">
        <button
          className="px-3 py-1 text-lg font-semibold transition sm:px-5 sm:py-3"
          onClick={handlePlay}
        >
          Ver de nuevo <span aria-hidden="true">↺</span>
        </button>
        <button
          onClick={() => {
            router
              .push({
                pathname: `/${path}/[module]/[exercise]`,
                query: {
                  module: module.slug.current,
                  exercise: module.exercises[0].slug.current,
                },
              })
              .then(handlePlay)
          }}
          className="px-3 py-1 text-lg font-semibold transition sm:px-5 sm:py-3 "
        >
          Ver desde el principio
        </button>
      </div>
    </OverlayWrapper>
  )
}

const BlockedOverlay: React.FC = () => {
  const router = useRouter()
  const {lesson, module} = useMuxPlayer()

  const {data: ctaText} = useQuery([`exercise-free-tutorial`], async () => {
    return sanityClient
      .fetch(
        `
      *[_type == 'cta' && slug.current == "free-tutorial"][0]{
        body
      }
    `,
      )
      .then((response: SanityDocument) => response.body)
  })

  const handleOnSuccess = (subscriber: any, email?: string) => {
    if (subscriber) {
      const redirectUrl = redirectUrlBuilder(subscriber, router.asPath, {
        confirmToast: 'true',
      })
      email && setUserId(email)
      track('subscribed to email list', {
        lesson: lesson.slug,
        module: module.slug.current,
        location: 'exercise',
        moduleType: module.moduleType,
        lessonType: lesson._type,
      })
      router.push(redirectUrl).then(() => {
        router.reload()
      })
    }
  }

  const startedLearningField = {
    // ex: started_zod_tutorial: 2022-09-02
    [`started_${snakeCase(module.title)}_${module.moduleType}`.toLowerCase()]:
      new Date().toISOString().slice(0, 10),
  }

  return (
    <div
      id="video-overlay"
      className="flex w-full flex-col items-center justify-center bg-gray-900 py-5 md:flex-row"
    >
      <div className="z-20 flex h-full flex-shrink-0 flex-col items-center justify-center gap-5 p-5 pb-10 text-center text-lg leading-relaxed sm:p-10 sm:pb-16">
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <div className="relative ">
            <Image
              src={module.image}
              width={150}
              height={150}
              alt={module.title}
            />
          </div>
          <h2 className="max-w-sm font-heading text-3xl font-bold">
            Avanza tu carrera con {module.title}
          </h2>
          <h3 className="pb-5 pt-2 text-lg font-medium text-brand">
            Accede a todas las lecciones de este tutorial.
          </h3>
          <SubscribeToConvertkitForm
            successMessage="¡Gracias! Estás siendo redirigido..."
            subscribeApiURL={process.env.NEXT_PUBLIC_CONVERTKIT_SUBSCRIBE_URL}
            actionLabel="Continuar Viendo"
            fields={startedLearningField}
            onSuccess={(subscriber, email) => {
              return handleOnSuccess(subscriber, email)
            }}
          />
          <p className="pt-2 text-base opacity-80">
            Sin spam, cancele en cualquier momento.
          </p>
        </div>
      </div>
      <div className="prose prose-invert flex w-full max-w-none flex-col p-5 prose-p:mb-0  sm:max-w-sm xl:max-w-lg xl:prose-p:mb-0">
        <h3 className="font-bold">Este es un tutorial gratuito.</h3>
        {ctaText && <PortableText value={ctaText} />}
      </div>
    </div>
  )
}

type LoadingOverlayProps = {}

const LoadingOverlay: React.FC<LoadingOverlayProps> = () => {
  const {
    muxPlayerProps: {playbackId},
  } = useMuxPlayer()
  const thumbnail = `https://image.mux.com/${playbackId}/thumbnail.png?width=480&height=384&fit_mode=preserve`

  return (
    <OverlayWrapper dismissable={false}>
      <div className="flex items-center justify-center">
        {playbackId && (
          <Image
            src={thumbnail}
            layout="fill"
            alt=""
            aria-hidden="true"
            className="opacity-50 blur-sm contrast-125"
          />
        )}
        <Spinner className="absolute h-8 w-8" />
      </div>
    </OverlayWrapper>
  )
}

export {
  ExerciseOverlay,
  DefaultOverlay,
  FinishedOverlay,
  BlockedOverlay,
  LoadingOverlay,
}

const handleContinue = async (
  router: NextRouter,
  module: SanityDocument,
  nextExercise: SanityDocument,
  handlePlay: () => void,
  path: string,
) => {
  if (nextExercise._type === 'solution') {
    const exercise = module.exercises.find((exercise: SanityDocument) => {
      const solution = exercise.solution
      return solution?._key === nextExercise._key
    })

    return await router
      .push({
        query: {module: module.slug.current, exercise: exercise.slug},
        pathname: `${path}/[module]/[exercise]/solution`,
      })
      .then(() => handlePlay())
  }

  return await router
    .push({
      query: {module: module.slug.current, exercise: nextExercise.slug},
      pathname: `${path}/[module]/[exercise]`,
    })
    .then(() => handlePlay())
}
