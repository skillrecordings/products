import * as React from 'react'
import Link from 'next/link'
import cx from 'classnames'
import Image from 'next/image'
import {SanityDocument} from '@sanity/client'
import Balancer from 'react-wrap-balancer'
import {PortableText} from '@portabletext/react'

import Icon from 'components/icons'
import {useModuleProgress} from 'utils/module-progress'

const PlaylistItem: React.FC<{
  playlist: SanityDocument
  purchased: boolean
}> = ({playlist, purchased}) => {
  const lessons = playlist?.sections?.[0]?.lessons || []
  const moduleProgress = useModuleProgress()
  const firstLessonSlug = lessons?.[0].slug
  const nextLessonSlug = moduleProgress?.nextLesson?.slug
  return (
    <li className="flex flex-col items-center md:items-start space-y-6 md:space-y-0 md:flex-row md:space-x-8 lg:space-x-12">
      <div className="flex flex-col item-center shrink-0 space-y-8">
        <div className="w-48 lg:w-60">
          <Image
            src={playlist.image}
            alt={playlist.title}
            width={250}
            height={250}
          />
        </div>
        {!purchased && (
          <Link
            href="/"
            className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 hover:bg-gray-200 duration-100 min-h-[50px]"
          >
            <Icon name="play" className="w-[10px] h-[10px]" />
            <span>Preview Course</span>
          </Link>
        )}
      </div>
      <div>
        <h3 className="text-3xl md:text-4xl">
          <Balancer>{playlist.title}</Balancer>
        </h3>
        {!purchased && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mt-4">
              <span className="rounded-full text-white uppercase bg-tjs-green text-base px-2 py-px font-tt-medium">
                updated
              </span>
              <span className="text-tjs-green text-2xl font-tt-medium">
                Includes brand new content!
              </span>
            </div>
            <div>
              <Link
                href="/buy"
                className="font-tt-demibold duration-200 hover:text-[#ffa82e]"
              >
                Upgrade
              </Link>{' '}
              to get it available
            </div>
          </div>
        )}
        <div
          className={cx(
            'flex items-center space-x-5',
            purchased ? 'mt-4' : 'mt-8',
          )}
        >
          {purchased && (
            <a
              href="/"
              className="py-1 px-2 space-x-2 flex items-center text-base rounded-sm bg-gray-100 hover:bg-gray-200 duration-200"
            >
              <Icon name="download" className="w-[14px] h-[14px]" />
              <span>Download</span>
            </a>
          )}
          <div className="space-x-2 flex items-center text-base">
            <Icon name="lesson" className="w-[20px] h-[20px]" />
            <span>
              {playlist?.sections?.[0]?.lessons?.length} video lessons
            </span>
          </div>
          {!purchased && (
            <>
              <div className="space-x-2 flex items-center text-base">
                <Icon name="code" className="w-[20px] h-[20px]" />
                <span>code</span>
              </div>
              <div className="space-x-2 flex items-center text-base">
                <Icon name="transcript" className="w-[20px] h-[20px]" />
                <span>transcript</span>
              </div>
            </>
          )}
          <div className="space-x-2 flex items-center text-base">
            <Icon name="duration" className="w-[20px] h-[20px]" />
            <span>Xh XXm of learning material</span>
          </div>
        </div>
        {purchased && (
          <Link
            href={
              nextLessonSlug
                ? `/lessons/${nextLessonSlug}`
                : `/lessons/${firstLessonSlug}`
            }
            className="space-x-4 inline-flex items-center bg-gray-100 text-black px-6 py-2 rounded-md mt-7 hover:bg-gray-200 duration-100 min-h-[50px]"
          >
            <Icon name="play" className="w-[10px] h-[10px]" />
            <span>
              {nextLessonSlug && nextLessonSlug !== firstLessonSlug
                ? 'Continue'
                : 'Start'}{' '}
              Watching
            </span>
          </Link>
        )}
        {playlist?.body && (
          <div className="mt-7">
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
