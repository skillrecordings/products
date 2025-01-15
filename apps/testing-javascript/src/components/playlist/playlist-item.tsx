import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import type {SanityDocument} from '@sanity/client'
import Balancer from 'react-wrap-balancer'
import {PortableText} from '@portabletext/react'
import * as Dialog from '@radix-ui/react-dialog'
import {XIcon} from '@heroicons/react/solid'
import MuxPlayer from '@mux/mux-player-react'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'

import Icon from '@/components/icons'
import {useModuleProgress} from '@/utils/module-progress'
import {secondsToFormattedTime} from '@/lib/secondsToFormattedTime'
import {getNextLessonDetails} from '@/utils/get-next-lesson-details'

const PlaylistItem: React.FC<{
  playlist: SanityDocument
  purchased: boolean
}> = ({playlist, purchased}) => {
  const lessons = playlist?.sections?.[0]?.lessons || []
  const moduleProgress = useModuleProgress()

  let nextLessonDetails: ReturnType<typeof getNextLessonDetails>

  {
    const firstLessonSlug = lessons?.[0].slug
    const nextLessonSlug = moduleProgress?.nextLesson?.slug
    const moduleCompleted = moduleProgress?.moduleCompleted || false
    const completedLessonCount = moduleProgress?.completedLessonCount || 0

    nextLessonDetails = getNextLessonDetails({
      firstLessonSlug,
      nextLessonSlug,
      moduleCompleted,
      completedLessonCount,
    })
  }

  const {nextLessonSlug, buttonText} = nextLessonDetails

  return (
    <li className="flex flex-col items-center md:items-start space-y-6 md:space-y-0 md:flex-row md:space-x-8 lg:space-x-12">
      <div className="flex flex-col item-center shrink-0 space-y-4 md:space-y-6 lg:space-y-8">
        <div className="w-48 lg:w-60">
          {purchased ? (
            <Link
              href={`/playlists/${playlist.slug.current}`}
              className="block"
            >
              <Image
                src={playlist.image}
                alt={playlist.title}
                width={250}
                height={250}
              />
            </Link>
          ) : (
            <Image
              src={playlist.image}
              alt={playlist.title}
              width={250}
              height={250}
            />
          )}
        </div>
        {!purchased && (
          <Dialog.Root>
            <Dialog.Trigger className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 hover:bg-gray-200 duration-100 min-h-[50px] self-center">
              <Icon name="play" className="w-[10px] h-[10px]" />
              <span>Preview Course</span>
            </Dialog.Trigger>
            <Dialog.Overlay className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-40 w-full -translate-x-1/2 -translate-y-1/2 container max-w-6xl">
              <MuxPlayer
                streamType="on-demand"
                playbackId={playlist.introPlaybackId}
                metadata={{
                  video_title: playlist.title,
                }}
              />
              <Dialog.Close className="absolute right-7 -top-14 rounded-full px-3 py-1 space-x-2 flex items-center bg-gray-100 hover:bg-white duration-200">
                <span>close</span>
                <XIcon className="h-5 w-5" />
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Root>
        )}
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl text-center md:text-start">
          {purchased ? (
            <Link
              href={`/playlists/${playlist.slug.current}`}
              className="hover:underline"
            >
              <Balancer>{playlist.title}</Balancer>
            </Link>
          ) : (
            <Balancer>{playlist.title}</Balancer>
          )}
        </h3>
        {!purchased && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 md:space-x-3 mt-4 justify-center md:justify-start">
              <span className="rounded-full text-white uppercase bg-tjs-green text-xs sm:text-sm md:text-base px-2 py-px font-tt-demibold">
                updated
              </span>
              <span className="text-tjs-green text-base sm:text-xl md:text-2xl font-tt-medium">
                Includes brand new content!
              </span>
            </div>
            <div className="text-center md:text-start">
              <Link
                href="/buy"
                className="font-tt-demibold duration-200 hover:text-[#ffa82e]"
              >
                Upgrade
              </Link>{' '}
              to get access
            </div>
          </div>
        )}
        <div
          className={cx(
            'flex items-center justify-center md:justify-start space-x-4 sm:space-x-5',
            purchased ? 'mt-4' : 'mt-5 lg:mt-8',
          )}
        >
          <div className="space-x-1 sm:space-x-2 flex items-center text-base">
            <Icon
              name="lesson"
              className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
            />
            <span>
              {playlist?.sections?.[0]?.lessons?.length}{' '}
              <span className="hidden sm:inline">video</span> lessons
            </span>
          </div>
          {!purchased && (
            <>
              <div className="space-x-1 sm:space-x-2 flex items-center text-base">
                <Icon
                  name="code"
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                />
                <span>code</span>
              </div>
              <div className="space-x-1 sm:space-x-2 flex items-center text-base">
                <Icon
                  name="transcript"
                  className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
                />
                <span>transcript</span>
              </div>
            </>
          )}
          {playlist.durationInSeconds && (
            <div className="space-x-1 sm:space-x-2 flex items-center text-base">
              <Icon
                name="duration"
                className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]"
              />
              <span>
                {secondsToFormattedTime(
                  Number.parseInt(playlist.durationInSeconds),
                )}{' '}
                <span className="hidden lg:inline">of learning material</span>
              </span>
            </div>
          )}
        </div>
        {purchased && (
          <Link
            href={`/lessons/${nextLessonSlug}`}
            className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 hover:bg-gray-200 duration-100 min-h-[50px]"
            onClick={() => {
              track('clicked view workshop module', {
                module: playlist.slug.current,
              })
            }}
          >
            <Icon name="play" className="w-[10px] h-[10px]" />
            <span>{buttonText}</span>
          </Link>
        )}
        {playlist?.body && (
          <div className="mt-6 lg:mt-7 prose md:prose-md">
            <PortableText
              value={playlist.body}
              components={{
                list: {
                  bullet: ({children}) => (
                    <ul className="space-y-5 mt-6">{children}</ul>
                  ),
                },
                listItem: {
                  bullet: ({children}) => (
                    <li className="flex items-center space-x-3">
                      <Icon
                        name="check-circle"
                        className="w-[23px] h-[23px] text-[#5cc7c7]"
                      />
                      <span>{children}</span>
                    </li>
                  ),
                },
              }}
            />
          </div>
        )}
      </div>
    </li>
  )
}

export default PlaylistItem
