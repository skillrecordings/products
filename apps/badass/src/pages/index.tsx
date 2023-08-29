import * as React from 'react'
import {GetStaticProps} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'
import {useKeenSlider} from 'keen-slider/react'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {type Podcast, getAllPodcastEpisodes} from 'lib/podcast'
import {type Article, getAllArticles} from 'lib/articles'

import 'keen-slider/keen-slider.min.css'
import Layout from 'components/layout'
import Icon from 'components/icons'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {ButtonSecondary} from 'components/buttons'
import {
  projects,
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'
import {CallToActionForm} from '../components/call-to-action-form'

import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/sauce@2x.png'
import ImageStars1 from '../../public/assets/stars-1-new@2x.png'
import ImageStars1Mobile from '../../public/assets/stars-1-new-mobile@2x.png'
import ImageStars2 from '../../public/assets/stars-2-new@2x.png'

type LandingPageProps = {
  caseStudies: CaseStudy[]
  podcasts: Podcast[]
  articles: Article[]
}

const Header: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <header className="pt-8 md:pb-7 md:pt-5 lg:pb-7 lg:pt-20">
      <div className="container">
        <div className="flex md:flex-row flex-col items-center justify-between md:text-left text-center gap-4">
          <div className="flex items-center justify-center max-w-[660px] w-full">
            <Image
              src={ImageLevelUp}
              width={660}
              height={660}
              placeholder="blur"
              quality={100}
              priority
              loading="eager"
              alt="illustration of amanita muscoria mushroom with a level up label and little floating stars around it"
            />
          </div>
          <div className="w-full flex flex-col md:items-start items-center">
            <h3 className="font-condensed text-badass-pink-500 text-[1.75rem]">
              {content.caption}
            </h3>
            <h1 className="font-heading text-[2rem] lg:text-[3rem] xl:text-[3.5rem] leading-tight lg:leading-[1.14] mt-6 md:mt-4 lg:mt-10">
              {content.heading}
            </h1>
            <p className="text-white/70 font-medium text-lg lg:text-xl leading-[1.777] lg:leading-[1.75] mt-4 lg:mt-8">
              {content.byline}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

const SecretSauceSection: React.FC<React.PropsWithChildren<any>> = ({
  content,
}) => {
  return (
    <section className="pt-14 md:pt-[52px] lg:pt-40">
      <div className="container">
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="w-[360px] md:w-[460px] lg:w-[660px]">
            <Image
              loading="eager"
              src={ImageSecretSauce}
              placeholder="blur"
              width={660}
              height={660}
              quality={100}
              alt="a dripping bottle of badass secret sauce"
              aria-hidden="true"
            />
          </div>
          <div className="relative -top-4 md:-top-[105px] lg:-top-48">
            <h3 className="font-condensed text-badass-yellow-300 text-[1.75rem] leading-[1.28]">
              {content.caption}
            </h3>
            <h2 className="lg:max-w-4xl md:max-w-[521px] font-heading text-2xl leading-[1.333] lg:leading-tight lg:text-[2rem] mt-7 lg:mt-9">
              {content.heading}
            </h2>
            <div className="absolute md:-left-24 md:top-28 lg:top-auto lg:-left-28">
              <Image
                src={ImageStars1}
                width={209}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="hidden lg:block"
              />
              <Image
                src={ImageStars1Mobile}
                width={102}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="lg:hidden"
              />
            </div>
            <div className="absolute right-0 -bottom-16 md:-right-20 md:-bottom-10 lg:-right-28 lg:-bottom-24">
              <Image
                loading="eager"
                src={ImageStars2}
                width={96}
                height={96}
                alt="stars"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

type CaseStudiesSectionProps = {
  caseStudies: CaseStudy[]
}

type PodcastsSectionProps = {
  podcasts: Podcast[]
}

type ArticlesSectionProps = {
  articles: Article[]
}

const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  caseStudies,
}) => {
  return (
    <ContentSection
      title="badass case studies"
      subtitle="A Deep Dive into our Processes"
    >
      <div className="grid md:grid-cols-2 w-full gap-4 mt-8 lg:mt-[4.5rem]">
        {caseStudies.map((caseStudy) => {
          return (
            <Card
              key={caseStudy._id}
              imageUrl={caseStudy.cardImage}
              title={caseStudy.title}
              subtitle={caseStudy.partnerName}
              href={`/partners/${caseStudy.slug}`}
              type="caseStudy"
              ctaText="Read Case Study"
            />
          )
        })}
      </div>
    </ContentSection>
  )
}

const otherProducts = [
  {
    title: 'egghead.io',
    url: 'https://egghead.io/',
  },
  {
    title: 'TotalTypeScript.com',
    url: 'https://www.totaltypescript.com/',
  },
  {
    title: 'TestingJavaScript.com',
    url: 'https://testingjavascript.com/',
  },
  {
    title: 'ProTailwind.com',
    url: 'https://www.protailwind.com/',
  },
]

const OtherProductsSection = () => {
  return (
    <ContentSection title="other product's we've shipped" className="mt-9">
      <ul className="grid md:grid-cols-2 gap-x-3 mt-2 md:mt-4 lg:mt-2">
        {otherProducts.map((item) => {
          return (
            <li key={item.title}>
              <Link
                href={item.url}
                className="flex justify-between items-center h-[57px] lg:h-[80px] border-b border-[#5a5a5a] hover:text-badass-green-500 duration-150 text-lg lg:text-2xl font-bold px-2"
              >
                {item.title}
                <Icon
                  aria-hidden="true"
                  name="arrow-top-right"
                  className="w-6 lg:w-8 h-6 lg:h-8 shrink-0"
                />
              </Link>
            </li>
          )
        })}
      </ul>
    </ContentSection>
  )
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

const PodcastsSection: React.FC<PodcastsSectionProps> = ({podcasts}) => {
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
      className="mt-14 md:mt-16 lg:mt-36"
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

const ArticlesSection: React.FC<ArticlesSectionProps> = ({articles}) => {
  const mainArticle = articles.find((article) => article.slug === 'the-process')
  const restArticles = articles
    .filter((article) => article.slug !== 'the-process')
    .splice(0, 4)
  return (
    <ContentSection
      title="Badass Articles"
      subtitle="Our Key Lessons Learned Along the Way"
      subtitleClassName="md:max-w-[450px] lg:max-w-[500px] xl:max-w-none"
      className="mt-14 md:mt-[60px] lg:mt-36"
      renderAdditionalComponent={() => (
        <>
          <ButtonSecondary href="/articles" size="small" className="lg:hidden">
            View All Articles
          </ButtonSecondary>
          <ButtonSecondary
            href="/articles"
            size="middle"
            className="hidden lg:inline-flex"
          >
            View All Articles
          </ButtonSecondary>
        </>
      )}
    >
      <div className="mt-6 md:mt-10 lg:mt-20 gap-y-2 md:gap-y-0 md:gap-x-4 lg:gap-x-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          {mainArticle && (
            <Card
              key={mainArticle._id}
              imageUrl={mainArticle.image}
              title={mainArticle.title}
              subtitle={mainArticle?.description || ''}
              href={`/${mainArticle.slug}`}
              type="article"
              ctaText="View"
              authorName="Joel Hooks"
              authorAvatarUrl="/joel-hooks.jpg"
              className="bg-[#C5330B] hover:bg-[#C5330B]"
            />
          )}
        </div>
        <div className="md:w-1/2">
          <ul>
            {restArticles.map((article) => {
              return (
                <li
                  key={article._id}
                  className="px-2 py-6 md:first:pt-0 border-b border-[#5a5a5a]"
                >
                  <div className="group flex">
                    <div className="grow">
                      <h3>
                        <Balancer>
                          <Link
                            className="text-lg lg:text-2xl leading-[1.16] lg:leading-[1.333] font-bold w-full hover:text-badass-green-500 transition"
                            href={`/${article.slug}`}
                          >
                            {article.title}
                          </Link>
                        </Balancer>
                      </h3>
                    </div>
                    <ButtonSecondary
                      href={`/${article.slug}`}
                      size="middle"
                      className="shrink-0 ml-12 hidden lg:inline-flex"
                    >
                      View
                    </ButtonSecondary>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2 lg:space-x-4 items-center">
                      <div className="rounded-full overflow-hidden">
                        <Image
                          src="/joel-hooks.jpg"
                          alt="Joel Hooks"
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="text-white opacity-80 uppercase font-mono tracking-[0.16px]">
                        Joel Hooks
                      </div>
                    </div>
                    <ButtonSecondary
                      href={`/${article.slug}`}
                      size="small"
                      className="shrink-0 ml-12 lg:hidden"
                    >
                      View
                    </ButtonSecondary>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </ContentSection>
  )
}

const LandingPage: React.FC<LandingPageProps> = ({
  caseStudies,
  podcasts,
  articles,
}) => {
  return (
    <Layout className="overflow-hidden">
      <Header content={headerContent} />
      <main>
        <SecretSauceSection content={secretSauceContent} />
        <section className="flex flex-col items-center justify-center py-16 mt-14 md:mt-0 md:pt-1 lg:pt-14">
          <CaseStudiesSection caseStudies={caseStudies} />
          <OtherProductsSection />
          <PodcastsSection podcasts={podcasts} />
          <ArticlesSection articles={articles} />
        </section>
        <CallToActionForm content={genericCallToActionContent} />
      </main>
    </Layout>
  )
}

export default LandingPage

export const getStaticProps: GetStaticProps = async () => {
  const caseStudies = await getAllCaseStudies()
  const podcasts = await getAllPodcastEpisodes()
  const articles = await getAllArticles()

  return {
    props: {
      caseStudies,
      podcasts,
      articles,
    },
    revalidate: 10,
  }
}
