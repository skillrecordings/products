import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import {Element, scroller} from 'react-scroll'
import {useRouter} from 'next/router'
import MuxPlayer, {
  type MuxPlayerRefAttributes,
  type MuxPlayerProps,
} from '@mux/mux-player-react'
import {Video} from '@skillrecordings/skill-lesson/video/video'
import {
  VideoProvider,
  useMuxPlayer,
} from '@skillrecordings/skill-lesson/hooks/use-mux-player'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import {useVideoResource} from '@skillrecordings/skill-lesson/hooks/use-video-resource'
import {
  customPlayFromBeginningHandler,
  customContinueHandler,
} from 'utils/custom-handlers'
import {VideoTranscript} from '@skillrecordings/skill-lesson/video/video-transcript'

import {trpc} from 'trpc/trpc.client'
import Spinner from 'components/spinner'

const LessonsSidebarItem: React.FC<any> = () => {
  return (
    <li>
      <div>1</div>
    </li>
  )
}

const LessonsSidebar: React.FC<any> = ({lesson, module}) => {
  const [activeElement, setActiveElement] = React.useState<string>(lesson.slug)
  const scrollableNodeRef: any = React.createRef()

  const handlerScrollToActiveElem = () => {
    scroller.scrollTo(activeElement, {
      duration: 0,
      delay: 0,
      containerId: 'scroll-container',
    })
  }

  React.useEffect(() => {
    handlerScrollToActiveElem()
  }, [activeElement])

  return (
    <div className="flex min-h-[450px] w-full flex-col border border-black/[.08]">
      <div className="flex shrink-0 items-center border-b border-black/[.08] p-3">
        <Link
          href={`/playlists/${module.slug.current}`}
          className="mr-3 h-16 w-16 shrink-0"
        >
          <Image src={module.image} alt="module image" width={64} height={64} />
        </Link>
        <Link
          href={`/playlists/${module.slug.current}`}
          className="font-tt-demibold text-lg leading-tight"
        >
          {module.title}
        </Link>
      </div>
      <div className="relative grow">
        <ul
          ref={scrollableNodeRef}
          id="scroll-container"
          className="absolute inset-0 divide-y overflow-y-auto"
        >
          {module.sections[0].lessons.map((item: any, i: number) => {
            return (
              <li key={item.slug}>
                <Element name={item.slug} />
                <Link
                  href={`/lessons/${item.slug}`}
                  onClick={() => setActiveElement(item.slug)}
                  className={cx(
                    'flex items-baseline px-3 py-3 text-sm duration-100 hover:bg-gray-50 lg:py-2',
                    {
                      'bg-gray-100 hover:bg-gray-100':
                        item.slug === lesson.slug,
                    },
                  )}
                >
                  <div className="mr-2 w-4 shrink-0">{i + 1}.</div>
                  <div className="font-tt-medium text-base">{item.title}</div>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default LessonsSidebar
