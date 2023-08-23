import * as React from 'react'
import {GetStaticProps} from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {twMerge} from 'tailwind-merge'
import cx from 'classnames'

// import Image from 'next/legacy/image'
import Layout from 'components/layout'
import Icon, {IconNames} from 'components/icons'
import {useKeenSlider} from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'

import {type CaseStudy, getAllCaseStudies} from 'lib/case-studies'
import {type Podcast, getAllPodcastEpisodes} from 'lib/podcast'
import {type Article, getAllArticles} from 'lib/articles'
import ContentSection from 'components/content-section'
import Card from 'components/card'
import {
  projects,
  headerContent,
  secretSauceContent,
  genericCallToActionContent,
} from 'components/landing-content'
import {CallToActionForm} from '../components/call-to-action-form'
import ImageLevelUp from '../../public/assets/level-up@2x.png'
import ImageSecretSauce from '../../public/assets/sauce@2x.png'
// import ImageSecretSauce from '../../public/assets/secret-sauce@2x.png'
// import ImageSecretSauceDrop from '../../public/assets/secret-sauce-drop@2x.png'
import ImageStars1 from '../../public/assets/stars-1-new@2x.png'
import ImageStars1Mobile from '../../public/assets/stars-1-new-mobile@2x.png'
import ImageStars2 from '../../public/assets/stars-2-new@2x.png'
import {divide} from 'lodash'
import {ButtonSecondary} from 'components/buttons'

type LandingPageProps = {
  caseStudies: CaseStudy[]
  podcasts: Podcast[]
  articles: Article[]
}

const Header: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <header className="pt-8 md:pb-7 md:pt-20">
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
            <h1 className="font-heading text-[2rem] md:text-[2.5rem] lg:text-[3rem] xl:text-[3.5rem] leading-tight md:leading-[1.14] mt-6 md:mt-10">
              {content.heading}
            </h1>
            <p className="text-white/70 font-medium text-lg md:text-xl leading-[1.777] md:leading-[1.75] mt-4 md:mt-8">
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
    <section className="pt-14 md:pt-40">
      <div className="container">
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="w-[360px] md:w-[660px]">
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
          <div className="relative -top-4 md:-top-48">
            <h3 className="font-condensed text-badass-yellow-300 text-[1.75rem] leading-[1.28]">
              {content.caption}
            </h3>
            <h2 className="md:max-w-4xl max-w-2xl font-heading text-2xl leading-[1.333] md:leading-tight md:text-[2rem] mt-7 md:mt-9">
              {content.heading}
            </h2>
            <div className="absolute md:-left-28">
              <Image
                src={ImageStars1}
                width={209}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="hidden md:block"
              />
              <Image
                src={ImageStars1Mobile}
                width={102}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="md:hidden"
              />
            </div>
            <div className="absolute right-0 -bottom-16 md:-right-28 md:-bottom-24">
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
      <div className="grid lg:grid-cols-2 w-full gap-4 mt-8 md:mt-[4.5rem]">
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
      <ul className="grid md:grid-cols-2 gap-x-3 mt-2">
        {otherProducts.map((item) => {
          return (
            <li key={item.title}>
              <Link
                href={item.url}
                className="flex justify-between items-center h-[57px] md:h-[80px] border-b border-[#5a5a5a] hover:text-badass-green-500 duration-150 text-lg md:text-2xl font-bold px-2"
              >
                {item.title}
                <Icon
                  aria-hidden="true"
                  name="arrow-top-right"
                  className="w-6 md:w-8 h-6 md:h-8 shrink-0"
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
      <ButtonSecondary href="/podcast/course-builders" size="middle">
        All Episodes
      </ButtonSecondary>
      <div className="hidden mt-14 md:flex items-center space-x-2">
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
const SLIDES_PER_VIEW_TABLET = 3
const SLIDES_PER_VIEW_DESKTOP = 4

function calculateActiveSlidesPerView() {
  if (typeof window === 'undefined') {
    return null // No window object available (server-side rendering)
  }

  function updateSlidesPerView() {
    const viewportWidth = window.innerWidth

    if (viewportWidth < 768) {
      return SLIDES_PER_VIEW_MOBILE
    } else if (viewportWidth >= 768 && viewportWidth < 991) {
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
    console.log(`Active Slides Per View: ${activeSlidesPerView}`)
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
        slides: {perView: SLIDES_PER_VIEW_TABLET + 0.2, spacing: 30},
      },
      '(min-width: 991px)': {
        slides: {perView: SLIDES_PER_VIEW_DESKTOP + 0.2, spacing: 30},
      },
    },
  })
  const activeSlidesPerView = calculateActiveSlidesPerView()
  return (
    <ContentSection
      title="Badass Podcast"
      subtitle="Tune in to our Badass Course Builders Podcast"
      className="mt-14 md:mt-36"
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
      <div className="mt-7 md:mt-20">
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
                  <h3 className="mt-6 md:text-2xl leading-normal md:leading-[1.333] font-sans font-bold group-hover:text-badass-green-500 duration-150">
                    {podcast.title}
                  </h3>
                </Link>
                <p className="font-mono uppercase text-sm md:text-base tracking-[0.14px] md:tracking-[0.16px] leading-none md:leading-[2.18] text-badass-gray-300 mt-2 font-medium">
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
  console.log({restArticles})
  return (
    <ContentSection
      title="Badass Articles"
      subtitle="Our Key Lessons Learned Along the Way"
      className="mt-14 md:mt-36"
      renderAdditionalComponent={() => (
        <ButtonSecondary href="/articles" size="middle">
          See All Articles
        </ButtonSecondary>
      )}
    >
      <div className="mt-6 md:mt-20 gap-y-2 md:gap-y-0 md:gap-x-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2">
          {mainArticle && (
            <Card
              key={mainArticle._id}
              imageUrl={mainArticle.image}
              title={mainArticle.title}
              subtitle={mainArticle?.description || ''}
              href={`/articles/${mainArticle.slug}`}
              type="article"
              ctaText="ReadArticle"
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
                  className="px-2 py-6 border-b border-[#5a5a5a]"
                >
                  <div className="group flex">
                    <div className="grow">
                      <h3 className="text-lg md:text-2xl leading-[1.16] md:leading-[1.333] font-bold">
                        {article.title}
                      </h3>
                    </div>
                    <ButtonSecondary
                      href={`/articles/${article.slug}`}
                      size="middle"
                      className="shrink-0 ml-12 hidden md:inline-flex"
                    >
                      Read Article
                    </ButtonSecondary>
                  </div>
                  <div className="flex justify-between mt-4">
                    <div className="flex space-x-2 md:space-x-4 items-center">
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
                      href={`/articles/${article.slug}`}
                      size="middle"
                      className="shrink-0 ml-12 md:hidden"
                    >
                      Read Article
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
        <section className="flex flex-col items-center justify-center py-16 mt-14 md:mt-0">
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

// const ProjectsSection: React.FC<
//   React.PropsWithChildren<ProjectsSectionSection>
// > = ({content, caseStudies}) => {
//   return (
//     <section className="flex flex-col items-center justify-center py-16 px-5">
//       {/* <div
//         className="font-symbol sm:pb-32 pb-24 text-2xl sm:scale-90 scale-75"
//         aria-hidden="true"
//       >
//         <span className="inline-block rotate-180 text-badass-gray-300">!</span>{' '}
//         <span className="text-badass-yellow-300 text-4xl">*</span>{' '}
//         <span className=" text-badass-gray-300">!</span>
//       </div> */}
//       <CaseStudiesSection caseStudies={caseStudies} />
//       <OtherProductsSection />
//       <PodcastsSection />
//       <div className="my-40">**************************</div>
//       <h2 className=" text-badass-pink-300 sm:text-2xl text-xl">
//         {content.caption}
//       </h2>
//       <ul className="grid lg:grid-cols-2 grid-cols-1 place-items-center pt-16 gap-5 max-w-4xl w-full">
//         {content.items.map((project: any) => {
//           const {title, byline, image, caseStudyUrl, instructor, instructors} =
//             project
//           return (
//             <li
//               key={title}
//               className="relative bg-gradient-to-tr from-white/5 to-white/0  border border-white/10 flex flex-col w-full h-full rounded"
//             >
//               <div className="flex items-center gap-3 sm:p-10 p-10 sm:justify-start justify-center">
//                 <div className="flex-shrink-0">{image}</div>
//                 <h3>
//                   <Link
//                     href={`https://${title}`}
//                     passHref
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="font-sans font-semibold sm:text-2xl text-xl block hover:underline"
//                   >
//                     {title}
//                   </Link>
//                 </h3>
//               </div>
//               {/* <p className="text-badass-gray-300">{byline}</p> */}
//               <div className="sm:p-10 p-5 pb-8 w-full gap-5 text-sm flex sm:flex-row flex-col items-center sm:justify-between justify-center absolute">
//                 <div className="">
//                   {instructor && (
//                     <div className="flex items-center gap-2.5 sm:justify-start justify-center">
//                       <Image
//                         src={instructor.avatar}
//                         width={45}
//                         height={45}
//                         alt={instructor.name}
//                         className="rounded-full bg-black"
//                       />
//                       {instructor.name}
//                     </div>
//                   )}
//                   {instructors && (
//                     <div className="flex items-center gap-2.5 text-left">
//                       <div className="flex items-center -space-x-3">
//                         {instructors.map((instructor: any) => {
//                           return (
//                             <div
//                               key={instructor.name}
//                               className="border-2 rounded-full flex items-center justify-center border-black"
//                             >
//                               <Image
//                                 src={instructor.avatar}
//                                 width={45}
//                                 height={45}
//                                 alt={instructor.name}
//                                 className="rounded-full"
//                               />
//                               {/* {instructor.name} */}
//                             </div>
//                           )
//                         })}
//                       </div>
//                       {instructors.map((instructor: any, i: number) => {
//                         return `${instructor.name} ${i % 2 ? '' : ' & '}`
//                       })}
//                     </div>
//                   )}
//                 </div>
//                 {project.caseStudyUrl && (
//                   <div className="flex-shrink-0 flex">
//                     <a
//                       href={project.caseStudyUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="opacity-80 hover:opacity-100 transition hover:text-badass-yellow-300"
//                     >
//                       case study <span aria-hidden="true">↗︎</span>
//                     </a>
//                   </div>
//                 )}
//               </div>
//             </li>
//           )
//         })}
//       </ul>
//       <p className="font-script sm:text-4xl text-3xl sm:scale-110 text-badass-yellow-300 pt-28">
//         {content.byline}
//       </p>
//     </section>
//   )
// }

// const SecretSauceSection: React.FC<React.PropsWithChildren<any>> = ({
//   content,
// }) => {
//   return (
//     <section className="relative sm:pb-16 pb-8 flex flex-col items-center justify-center text-center px-5">
//       <div className="relative translate-y-10">
//         <div className="absolute sm:translate-x-40 translate-x-28 translate-y-8">
//           <Image
//             loading="eager"
//             src={ImageSecretSauce}
//             placeholder="blur"
//             width={850}
//             height={426}
//             quality={100}
//             alt="a dripping bottle of badass secret sauce"
//             aria-hidden="true"
//           />
//         </div>
//         <div className="sm:translate-y-24 translate-y-16">
//           <Image
//             loading="eager"
//             src={ImageSecretSauceDrop}
//             placeholder="blur"
//             width={512}
//             height={512}
//             quality={100}
//             alt="a shining drop from badass secret sauce"
//             aria-hidden="true"
//           />
//         </div>
//       </div>
//       <p className="font-expanded text-badass-yellow-300 sm:text-xl text-lg pb-5">
//         {content.caption}
//       </p>
//       <h2 className="lg:max-w-4xl max-w-2xl font-heading lg:text-5xl sm:text-4xl lg:leading-tight leading-tight text-3xl pt-4">
//         {content.heading}
//       </h2>
//       <div className="absolute sm:-bottom-5 -bottom-16 sm:-translate-x-72 -translate-x-40">
//         <Image
//           src={ImageStars1}
//           width={159}
//           height={108}
//           alt="stars"
//           aria-hidden="true"
//           loading="eager"
//         />
//       </div>
//       <div className="absolute sm:-bottom-5 -bottom-16 sm:translate-x-72 translate-x-40">
//         <Image
//           loading="eager"
//           src={ImageStars2}
//           width={72}
//           height={72}
//           alt="stars"
//           aria-hidden="true"
//         />
//       </div>
//     </section>
//   )
// }

// type ProjectsSectionSection = {
//   content: any
//   caseStudies: CaseStudy[]
// }

{
  /* <ProjectsSection content={projects} caseStudies={caseStudies} /> */
}
