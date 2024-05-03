import * as React from 'react'
import Link from 'next/link'
import SimpleBar from 'simplebar-react'
import {scroller} from 'react-scroll'
import {useWindowSize, useMedia} from 'react-use'
import {type PodcastFrontMatter} from '@/@types/mdx-podcast'

interface EpisodesList {
  episodes: PodcastFrontMatter[]
  location: string
}

const EpisodesList = ({episodes, location}: EpisodesList) => {
  const [isMounted, setIsMounted] = React.useState(false)
  const scrollableNodeRef = React.useRef()
  const {height} = useWindowSize()

  const isTablet = useMedia('(max-width: 768px)', false)
  const maxHeight = isTablet ? '30rem' : (height - 140) / 1.05

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  React.useEffect(() => {
    if (isMounted && scrollableNodeRef.current) {
      scroller.scrollTo(location, {
        duration: 100,
        delay: 0,
        offset: -10,
        smooth: 'easeInOutQuart',
        containerId: 'simplebar-container',
      })
    }
  }, [location, isMounted])

  return isMounted ? (
    <div className="relative col-span-1 h-full text-lg leading-normal lg:col-span-4 xl:col-span-3">
      <nav className="sm:sticky sm:top-20 ">
        <h2 className="pb-4 text-xs font-semibold uppercase leading-normal tracking-wide text-er-gray-600">
          Episodes
        </h2>
        <div className="overflow-hidden rounded-lg border-2 border-er-gray-200">
          <SimpleBar
            scrollableNodeProps={{
              ref: scrollableNodeRef,
              id: 'simplebar-container',
            }}
            style={{maxHeight: maxHeight, height: '100%'}}
            className="overscroll-contain"
          >
            <ul
              id="container"
              className="grid grid-cols-1 gap-1 bg-er-gray-100 p-3"
            >
              {episodes.map((episode) => {
                const {title, slug, number} = episode
                const isActive = location.includes(`/podcast/${slug}`)
                return (
                  <li key={episode.slug} id={`/podcast/${slug}`}>
                    <Link
                      href={`/podcast/${slug}`}
                      className={`${
                        isActive
                          ? 'overflow-hidden bg-background text-text hover:bg-background'
                          : 'text-er-gray-800 hover:bg-er-gray-200 hover:text-text'
                      } relative flex rounded-md p-3 pl-4 font-semibold transition-colors duration-150 ease-in-out md:p-4 md:pl-6`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                      )}
                      <span
                        className={`mr-2 text-xs leading-7 ${
                          isActive
                            ? 'text-blue-500 opacity-100'
                            : 'text-text opacity-50'
                        }`}
                      >
                        {number}
                      </span>
                      {title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </SimpleBar>
        </div>
      </nav>
    </div>
  ) : null
}

export default EpisodesList
