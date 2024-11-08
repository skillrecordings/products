import SetLocalDevPrefsDialog from '@/exercise/local-dev-prefs/dialog'
import type {Book} from '@/lib/book'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {trpc} from '@/trpc/trpc.client'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {Button, DialogTrigger, Skeleton} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {CogIcon, MessageCircleCodeIcon} from 'lucide-react'
import {useSession} from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

export const ExerciseEmbed = ({
  filePath,
  book,
  title,
  resourceId,
}: {
  filePath: string
  book: Book
  title?: string
  resourceId?: string
}) => {
  const {data: session, status: sessionStatus} = useSession()
  const {data: userPrefs, status: userPrefsStatus} =
    trpc.userPrefs.getLocal.useQuery(
      {
        resourceId: book._id,
      },
      {
        enabled: Boolean(book),
      },
    )
  const {data: exercise, status: exerciseStatus} =
    trpc.exercises.getExerciseForBook.useQuery(
      {
        resourceId: resourceId as string,
      },
      {
        enabled: Boolean(resourceId),
      },
    )

  const [isPrefsDialogOpen, setIsPrefsDialogOpen] = React.useState(false)
  const canOpenExerciseInLocalEditor = Boolean(userPrefs)
  const thumbnail =
    process.env.NEXT_PUBLIC_URL +
    `/api/video-thumb?videoResourceId=${exercise?.videoResourceId}`
  const exerciseUrl = `/workshops/typescript-pro-essentials/${exercise?.section?.slug}/${exercise?.slug}`
  const localFileDeepLink =
    session?.user &&
    canOpenExerciseInLocalEditor &&
    userPrefs?.editorLaunchProtocol.includes('jetbrains')
      ? `jetbrains://web-storm/navigate/reference?project=${book?.github?.repo}&path=${filePath}`
      : `${userPrefs?.editorLaunchProtocol}${userPrefs?.localDirectoryPath}${filePath}`
  const {ability, abilityRulesStatus} = useAbilities()
  const canViewTypeScriptProEssentials = ability.can('view', 'Content')

  const WithVideo = () => {
    return (
      <div className="not-prose relative mt-10 flex flex-col items-center rounded-lg bg-[#1B222F] px-2 pb-3 pt-2 shadow-xl sm:px-2">
        <div
          className="flex w-full items-center justify-center"
          aria-hidden="true"
        >
          <div className="absolute -top-2.5 h-5 w-5 rotate-45 bg-[#1B222F]" />
        </div>
        {exerciseStatus === 'loading' || abilityRulesStatus === 'loading' ? (
          <div className="group relative flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded">
            <div className="absolute bottom-0 left-0 z-10 w-full border-t border-white/5 bg-background/50 px-4 py-3 text-sm font-medium backdrop-blur-md">
              <Skeleton className="h-4 w-full bg-white/5" />
            </div>
            <Skeleton className="absolute h-full w-full bg-white/5" />
          </div>
        ) : (
          <>
            {thumbnail && (
              <>
                {canViewTypeScriptProEssentials ? (
                  <Link
                    target="_blank"
                    href={exerciseUrl}
                    className="group relative flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded"
                  >
                    <div className="absolute z-10 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 p-3 backdrop-blur-md transition duration-300 ease-in-out group-hover:scale-105">
                      <svg
                        className="-mr-1.5 h-5 w-5"
                        viewBox="0 0 14 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0L14 9L0 18V0Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div className="absolute bottom-0 left-0 z-10 w-full border-t border-white/5 bg-background/50 px-4 py-3 text-sm font-medium backdrop-blur-md">
                      {exercise?.section?.workshop?.title ||
                        'TypeScript Pro Essentials'}
                      : {exercise?.title || title}
                    </div>
                    <Image src={thumbnail} fill alt="" />
                  </Link>
                ) : (
                  <div className="group relative flex aspect-video h-full w-full items-center justify-center overflow-hidden rounded">
                    <div className="relative z-10 flex max-w-sm flex-col items-center justify-center px-5 text-center">
                      <p className="text-balance text-base leading-normal sm:text-lg">
                        Solution to this exercise is included in{' '}
                        <strong className="font-semibold">
                          {exercise?.section?.workshop?.title}.
                        </strong>
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <Button
                          asChild
                          className="px-7 font-semibold shadow-xl"
                        >
                          <Link
                            href={`/`}
                            onClick={() => {
                              track('clicked_go_pro', {
                                location: 'book_exercise_embed',
                                resource: resourceId,
                              })
                            }}
                          >
                            Get Access
                          </Link>
                        </Button>
                        {/* <Button
                          variant="outline"
                          asChild
                          className="border border-white/10 bg-transparent font-semibold hover:bg-white/5"
                        >
                          <Link
                            href={`/workshops/${exercise?.section?.workshop?.slug}`}
                          >
                            Learn More
                          </Link>
                        </Button> */}
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 z-10 hidden w-full border-t border-white/5 bg-background/50 px-4 py-3 text-sm font-medium backdrop-blur-md md:flex">
                      <Link
                        href={exerciseUrl}
                        className="transition hover:text-primary"
                      >
                        {exercise?.section?.workshop?.title ||
                          'TypeScript Pro Essentials'}
                        : {exercise?.title || title}
                      </Link>
                    </div>
                    <Image
                      src={thumbnail}
                      fill
                      alt=""
                      className="opacity-50 blur-sm"
                    />
                  </div>
                )}
              </>
            )}
          </>
        )}
        <div
          className={cn(
            'flex w-full flex-wrap items-center justify-between gap-5 pr-1 pt-3',
            {
              'pl-3': !session?.user,
              'pl-1': session?.user,
            },
          )}
        >
          <div className="relative flex w-full items-center justify-between">
            {sessionStatus === 'loading' || userPrefsStatus === 'loading' ? (
              <Skeleton className="h-10 w-full rounded bg-white/5" />
            ) : (
              <>
                {session?.user ? (
                  <>
                    {canOpenExerciseInLocalEditor && localFileDeepLink ? (
                      <div className="flex items-center">
                        <Button
                          asChild
                          disabled={!canOpenExerciseInLocalEditor}
                          className="not-prose rounded-r-none font-semibold"
                        >
                          <a href={localFileDeepLink}>Open in Editor</a>
                        </Button>
                        <SetLocalDevPrefsDialog
                          resourceId={book._id}
                          resourceTitle={book.title}
                          githubRepositoryName={book.github?.title as string}
                          githubRepositoryUrl={`https://github.com/total-typescript/${book.github?.repo}`}
                          isDialogOpen={isPrefsDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              aria-label="Configure local development settings"
                              className="gap-1 rounded-l-none bg-primary/80 px-2.5"
                            >
                              <CogIcon className="h-4 w-4" aria-hidden="true" />
                              <span className="sr-only">
                                Configure local development settings
                              </span>
                            </Button>
                          </DialogTrigger>
                        </SetLocalDevPrefsDialog>
                      </div>
                    ) : (
                      <SetLocalDevPrefsDialog
                        resourceId={book._id}
                        resourceTitle={book.title}
                        githubRepositoryName={book.github?.title as string}
                        githubRepositoryUrl={`https://github.com/total-typescript/${book.github?.repo}`}
                        isDialogOpen={isPrefsDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                          >
                            <CogIcon className="h-4 w-4" aria-hidden="true" />{' '}
                            Configure Local Development
                          </Button>
                        </DialogTrigger>
                      </SetLocalDevPrefsDialog>
                    )}
                    {book?.github?.repo && (
                      <Button
                        variant="secondary"
                        asChild
                        className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                      >
                        <a
                          href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                          target="_blank"
                        >
                          <Icon name="Github" /> GitHub
                        </a>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <p className="text-sm sm:text-base">
                      <Link href="/login" className="text-primary underline">
                        Log in
                      </Link>{' '}
                      to open in your editor
                    </p>
                    {book?.github?.repo && (
                      <>
                        {/* <div className="mx-5 h-5 w-px bg-white/10" /> */}
                        <Button
                          variant="secondary"
                          asChild
                          className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                        >
                          <a
                            href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                            target="_blank"
                          >
                            <Icon name="Github" /> GitHub
                          </a>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return resourceId && exercise ? (
    <WithVideo />
  ) : (
    <div className="not-prose relative mt-10 flex flex-col items-center gap-5 rounded-lg bg-[#1B222F] px-5 pb-8 pt-2 sm:px-6">
      <div
        className="flex w-full items-center justify-center"
        aria-hidden="true"
      >
        <div className="absolute -top-2.5 h-5 w-5 rotate-45 bg-[#1B222F]" />
      </div>
      {title && (
        <p className="inline-flex items-center gap-2 text-balance text-center text-base sm:text-lg">
          <MessageCircleCodeIcon className="w-5 text-white/70" />{' '}
          <ReactMarkdown
            components={{
              p: ({children}) => children,
              code: ({children}) => (
                <code className="!bg-white/5">{children}</code>
              ),
            }}
          >
            {title}
          </ReactMarkdown>
        </p>
      )}
      <div className="relative flex items-center">
        {sessionStatus === 'loading' || userPrefsStatus === 'loading' ? (
          <Skeleton className="h-10 w-full rounded bg-white/5" />
        ) : (
          <>
            {session?.user ? (
              <>
                {canOpenExerciseInLocalEditor && localFileDeepLink ? (
                  <div className="flex items-center">
                    <Button
                      asChild
                      disabled={!canOpenExerciseInLocalEditor}
                      className="not-prose rounded-r-none font-semibold"
                    >
                      <a href={localFileDeepLink}>Open in Editor</a>
                    </Button>
                    <SetLocalDevPrefsDialog
                      resourceId={book._id}
                      resourceTitle={book.title}
                      githubRepositoryName={book.github?.title as string}
                      githubRepositoryUrl={book.github?.repo as string}
                      isDialogOpen={isPrefsDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          aria-label="Configure local development settings"
                          className="gap-1 rounded-l-none bg-primary/80 px-2.5"
                        >
                          <CogIcon className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">
                            Configure local development settings
                          </span>
                        </Button>
                      </DialogTrigger>
                    </SetLocalDevPrefsDialog>
                  </div>
                ) : (
                  <SetLocalDevPrefsDialog
                    resourceId={book._id}
                    resourceTitle={book.title}
                    githubRepositoryName={book.github?.title as string}
                    githubRepositoryUrl={book.github?.repo as string}
                    isDialogOpen={isPrefsDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="secondary"
                        className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                      >
                        <CogIcon className="h-4 w-4" /> Configure Local
                        Development
                      </Button>
                    </DialogTrigger>
                  </SetLocalDevPrefsDialog>
                )}
                {book?.github?.repo && (
                  <>
                    <div className="mx-5 h-5 w-px bg-white/10" />
                    <Button
                      variant="secondary"
                      asChild
                      className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                    >
                      <a
                        href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                        target="_blank"
                      >
                        <Icon name="Github" /> GitHub
                      </a>
                    </Button>
                  </>
                )}
              </>
            ) : (
              <>
                <p className="text-base">
                  <Link href="/login" className="text-primary underline">
                    Log in
                  </Link>{' '}
                  to open in your editor
                </p>
                {book?.github?.repo && (
                  <>
                    <div className="mx-5 h-5 w-px bg-white/10" />
                    <Button
                      variant="secondary"
                      asChild
                      className="gap-2 border border-white/5 bg-white/5 text-white hover:bg-white/10"
                    >
                      <a
                        href={`https://github.com/total-typescript/${book.github.repo}/blob/main${filePath}`}
                        target="_blank"
                      >
                        <Icon name="Github" /> GitHub
                      </a>
                    </Button>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

const useAbilities = () => {
  const {data: abilityRules, status: abilityRulesStatus} =
    trpc.modules.rules.useQuery({
      moduleSlug: 'typescript-pro-essentials',
      moduleType: 'workshop',
    })
  return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
}
