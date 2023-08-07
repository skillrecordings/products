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
    <div className="min-h-[450px] border border-black/[.08] w-full flex flex-col">
      <div className="flex items-center p-3 border-b border-black/[.08] shrink-0">
        <Link
          href={`/playlists/${module.slug}`}
          className="w-16 h-16 shrink-0 mr-3"
        >
          <Image src={module.image} alt="module image" width={64} height={64} />
        </Link>
        <Link
          href={`/playlists/${module.slug.current}`}
          className="text-lg leading-tight font-tt-demibold"
        >
          {module.title}
        </Link>
      </div>
      <div className="grow relative">
        <ul
          ref={scrollableNodeRef}
          id="scroll-container"
          className="absolute inset-0 overflow-y-auto divide-y"
        >
          {module.sections[0].lessons.map((item: any, i: number) => {
            return (
              <li key={item.slug}>
                <Element name={item.slug} />
                <Link
                  href={`/lessons/${item.slug}`}
                  onClick={() => setActiveElement(item.slug)}
                  className={cx(
                    'flex px-3 py-3 lg:py-2 text-sm items-baseline duration-100 hover:bg-gray-50',
                    {
                      'bg-gray-100 hover:bg-gray-100':
                        item.slug === lesson.slug,
                    },
                  )}
                >
                  <div className="shrink-0 w-4 mr-2">{i + 1}.</div>
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
