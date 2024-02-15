import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import {useKeenSlider} from 'keen-slider/react'
import {type Podcast} from 'lib/podcast'
import Icon from 'components/icons'
import ContentSection from 'components/content-section'
import {ButtonSecondary} from 'components/buttons'

import 'keen-slider/keen-slider.min.css'

type PodcastsProps = {
  podcasts: Podcast[]
  className?: string
}

const Arrow = (props: {
  disabled: boolean
  left?: boolean
  onClick: (e: any) => void
}) => {
  return (
    <Icon
      aria-hidden="true"
      name={props.left ? 'arrow-left-circled' : 'arrow-right-circled'}
      className={cx('w-16 h-16 shrink-0 text-white opacity-70 duration-150', {
        'cursor-default': props.disabled,
        'hover:opacity-100 cursor-pointer': !props.disabled,
      })}
      onClick={props.onClick}
    />
  )
}

const PodcastsSectionControls = ({
  loaded,
  instanceRef,
  currentSlide,
  slidesPerView,
}: any) => {
  return (
    <div className="flex flex-col justify-end">
      <ButtonSecondary
        href="/podcast/course-builders"
        size="small"
        className="lg:hidden"
      >
        All Episodes
      </ButtonSecondary>
      <ButtonSecondary
        href="/podcast/course-builders"
        size="middle"
        className="hidden lg:inline-flex"
      >
        All Episodes
      </ButtonSecondary>
      <div className="hidden mt-14 lg:flex items-center space-x-2">
        {loaded && instanceRef.current && (
          <>
            <Arrow
              left
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.prev()
              }
              disabled={currentSlide === 0}
            />

            <Arrow
              onClick={(e: any) =>
                e.stopPropagation() || instanceRef.current?.next()
              }
              disabled={
                currentSlide ===
                instanceRef.current.track.details.slides.length - slidesPerView
              }
            />
          </>
        )}
      </div>
    </div>
  )
}

const SLIDES_PER_VIEW_MOBILE = 2
const SLIDES_PER_VIEW_TABLET = 2
const SLIDES_PER_VIEW_DESKTOP = 4

const calculateActiveSlidesPerView = () => {
  if (typeof window === 'undefined') {
    return null // No window object available (server-side rendering)
  }

  const updateSlidesPerView = () => {
    const viewportWidth = window.innerWidth

    if (viewportWidth < 768) {
      return SLIDES_PER_VIEW_MOBILE
    } else if (viewportWidth >= 768 && viewportWidth < 1024) {
      return SLIDES_PER_VIEW_TABLET
    } else {
      return SLIDES_PER_VIEW_DESKTOP
    }
  }

  // Initial update
  let activeSlidesPerView = updateSlidesPerView()

  // Attach event listener to update on window resize
  window.addEventListener('resize', () => {
    activeSlidesPerView = updateSlidesPerView()
  })

  return activeSlidesPerView
}

const Podcasts: React.FC<PodcastsProps> = ({podcasts, className = ''}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [loaded, setLoaded] = React.useState(false)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
    created() {
      setLoaded(true)
    },
    slides: {
      perView: SLIDES_PER_VIEW_MOBILE + 0.13,
      spacing: 8,
    },
    breakpoints: {
      '(min-width: 768px)': {
        slides: {perView: SLIDES_PER_VIEW_TABLET + 0.8, spacing: 15},
      },
      '(min-width: 1024px)': {
        slides: {perView: SLIDES_PER_VIEW_DESKTOP + 0.2, spacing: 30},
      },
    },
  })
  const activeSlidesPerView = calculateActiveSlidesPerView()
  return (
    <ContentSection
      title="Badass Podcast"
      subtitle="Tune in to our Badass Course Builders Podcast"
      className={className}
      subtitleClassName="md:max-w-[34rem]"
      renderAdditionalComponent={() => (
        <PodcastsSectionControls
          loaded={loaded}
          instanceRef={instanceRef}
          currentSlide={currentSlide}
          slidesPerView={activeSlidesPerView}
        />
      )}
    >
      <div className="mt-7 md:mt-8 lg:mt-20">
        <div ref={sliderRef} className="keen-slider">
          {podcasts.map((podcast) => {
            return (
              <div key={podcast.slug} className="keen-slider__slide">
                <Link
                  href={`/podcast/course-builders/${podcast.slug}`}
                  className="block group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden relative before:absolute before:inset-0 before:z-10 before:opacity-0 before:bg-black group-hover:before:opacity-70 before:duration-150">
                    <Icon
                      aria-hidden="true"
                      name="play"
                      className="w-[3.375rem] h-[3.375rem] text-white z-20 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 duration-150"
                    />
                    <Image
                      src={podcast.coverArtUrl}
                      sizes="(max-width: 768px) 300px, 322px"
                      fill={true}
                      alt={podcast.title}
                    />
                  </div>
                  <h3 className="mt-6 md:text-[19px] lg:text-2xl leading-normal md:leading-[1.3] lg:leading-[1.333] font-sans font-bold group-hover:text-badass-green-500 duration-150">
                    {podcast.title}
                  </h3>
                </Link>
                <p className="font-mono uppercase text-sm md:text-[13px] lg:text-base tracking-[0.14px] md:tracking-[0.125px] lg:tracking-[0.16px] leading-none md:leading-[2.18] text-badass-gray-300 mt-2 font-medium">
                  With {podcast.interviewee}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </ContentSection>
  )
}

export default Podcasts
