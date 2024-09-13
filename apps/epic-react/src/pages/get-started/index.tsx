import {GlobeIcon} from '@heroicons/react/solid'
import MuxPlayer from '@mux/mux-player-react'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import Layout from '@/components/app/layout'
// import Icon from '@/components/icons'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {linkedHeadingComponents} from '@/components/mdx'
import {motion, useScroll, useTransform} from 'framer-motion'
import {Page, getPage} from '@/lib/pages'
import {getAllTutorials, type Tutorial} from '@/lib/tutorials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React from 'react'
import Balancer from 'react-wrap-balancer'
import {getAllWorkshops, type Workshop} from '@/lib/workshops'

export const getStaticProps = async () => {
  const page = await getPage('get-started')
  const bodyMdx = page?.body && (await serializeMDX(page.body))
  const tutorials = await getAllTutorials()
  const workshops = await getAllWorkshops()

  return {
    props: {
      page,
      body: bodyMdx,
      tutorials,
      workshops,
    },
    revalidate: 10,
  }
}

const GetStartedPage: React.FC<{
  page: Page
  body: MDXRemoteSerializeResult
  tutorials: Tutorial[]
  workshops: Workshop[]
}> = ({page, body, tutorials, workshops}) => {
  const router = useRouter()
  const [mounted, setMounted] = React.useState(false)
  const moduleSlug = router.query.module

  const currentModule = React.useMemo(() => {
    return (
      tutorials.find((tutorial) => tutorial.slug.current === moduleSlug) ||
      workshops.find((workshop) => workshop.slug.current === moduleSlug)
    )
  }, [tutorials, workshops, moduleSlug])

  const githubUrlForCurrentModule = currentModule?.github?.repo

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const pageTitle = page.title || 'Get Started Using the Workshop App'
  const pageDescription =
    page.description ||
    "From setting up your environment to navigating exercises and understanding the Epic Workshop App's structure, this guide ensures a smooth workshop experience."

  return (
    <Layout
      meta={{
        title: pageTitle,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1726226289/epic-react-v2-get-started-card_2x.jpg',
          alt: 'Launch your Workshop App Experience',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center px-5 pb-16 pt-10 sm:pt-14">
        <h1 className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
          <Balancer>{pageTitle}</Balancer>
        </h1>
        {githubUrlForCurrentModule ? (
          <Link
            className="mt-10 flex items-center gap-3 rounded-md bg-blue-500 px-5 py-1 font-semibold text-white transition"
            href={`${githubUrlForCurrentModule}?tab=readme-ov-file#setup`}
            target="_blank"
          >
            {currentModule.image && (
              <Image
                src={currentModule.image}
                width={50}
                height={50}
                aria-hidden
                alt=""
              />
            )}{' '}
            <span className="drop-shadow-md">{currentModule.title}</span>
          </Link>
        ) : null}
        <h2 className="pb-8 pt-8 text-center text-lg text-gray-700 dark:text-gray-300 sm:text-xl lg:text-2xl">
          <Balancer>{pageDescription}</Balancer>
        </h2>
        <WorkshopAppScreenshot />
      </header>
      <main className="prose mx-auto w-full max-w-screen-md px-5 pb-16 dark:prose-invert md:prose-lg prose-headings:pt-8">
        {page.body ? (
          <MDX
            components={{
              ...linkedHeadingComponents,
              AppTourVideo,
              Workshops: () => (
                <Workshops tutorials={tutorials} workshops={workshops} />
              ),
              Image: ({src, light, dark, alt = ''}: any) => {
                const {theme} = useTheme()

                return src || light || dark ? (
                  <div className="relative aspect-video">
                    {mounted ? (
                      <Image
                        src={
                          typeof src === 'string'
                            ? src
                            : theme === 'light'
                            ? light
                            : dark
                        }
                        fill
                        alt={alt}
                        aria-hidden={!alt}
                      />
                    ) : null}
                  </div>
                ) : null
              },
            }}
            contents={body}
          />
        ) : null}
      </main>
    </Layout>
  )
}

export default GetStartedPage

const Workshops: React.FC<{tutorials: any[]; workshops: any[]}> = ({
  tutorials,
  workshops,
}) => {
  return (
    <div className="not-prose my-8 flex flex-col justify-center text-lg sm:gap-4 md:text-lg">
      <h3 className="text-lg font-semibold sm:text-xl">Workshops</h3>
      <WorkshopList workshops={workshops} />
      <h3 className="mt-5 block text-lg font-semibold sm:text-xl">
        Free Tutorials
      </h3>
      <ul className="w-full divide-y">
        {tutorials.map((tutorial) => {
          if (!tutorial?.github?.repo) return null
          const deployedUrl = tutorial?.workshopApp?.external?.url

          return (
            <li
              key={tutorial._id}
              className="flex min-h-[56px] w-full flex-col justify-between gap-2 py-4 font-semibold sm:flex-row sm:items-center sm:gap-5 sm:py-2"
            >
              <div className="flex items-center gap-3">
                {tutorial.image ? (
                  <Image
                    src={tutorial.image}
                    width={50}
                    height={50}
                    alt={tutorial.title}
                    aria-hidden
                  />
                ) : null}
                <Link
                  href={tutorial.github.repo}
                  target="_blank"
                  className="group leading-tight hover:underline"
                >
                  {tutorial.title}{' '}
                  <span className="opacity-50 transition group-hover:opacity-100">
                    ↗︎
                  </span>
                </Link>
              </div>
              <div className="flex flex-shrink-0 items-center justify-end gap-5 pr-5 text-sm font-medium">
                {deployedUrl && (
                  <Link
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-1.5 hover:underline"
                    href={deployedUrl}
                  >
                    <GlobeIcon className="h-4 w-4 opacity-75" />
                    Deployed Version
                  </Link>
                )}
                <Link
                  href={tutorial.github.repo + '?tab=readme-ov-file#setup'}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  <Icon name="Github" size="16" className="opacity-75" />
                  Setup
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function WorkshopList({workshops}: {workshops: Workshop[]}) {
  return (
    <ul className="w-full divide-y">
      {workshops.map((workshop) => (
        <WorkshopListItem workshop={workshop} />
      ))}
    </ul>
  )
}

function WorkshopListItem({workshop}: {workshop: Workshop}) {
  if (!workshop?.github?.repo) return null
  const deployedUrl = workshop?.workshopApp?.external?.url
  return (
    <li
      key={workshop._id}
      className="flex min-h-[56px] w-full flex-col justify-between gap-2 py-4 font-semibold sm:flex-row sm:items-center sm:gap-5 sm:py-2"
    >
      <div className="flex items-center gap-3">
        {workshop.image ? (
          <Image
            src={workshop.image}
            width={50}
            height={50}
            alt={workshop.title}
            aria-hidden
          />
        ) : null}
        <Link
          href={workshop.github.repo}
          target="_blank"
          className="group leading-tight hover:underline"
        >
          {workshop.title}{' '}
          <span className="opacity-50 transition group-hover:opacity-100">
            ↗︎
          </span>
        </Link>
      </div>
      <div className="flex flex-shrink-0 items-center justify-end gap-5 pr-5 text-sm font-medium">
        {deployedUrl && (
          <Link
            target="_blank"
            rel="noopener"
            className="inline-flex items-center gap-1.5 hover:underline"
            href={deployedUrl}
          >
            <GlobeIcon className="h-4 w-4 opacity-75" />
            Deployed Version
          </Link>
        )}
        <Link
          href={workshop.github.repo + '?tab=readme-ov-file#setup'}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1.5 hover:underline"
        >
          <Icon name="Github" size="16" className="opacity-75" />
          Setup
        </Link>
      </div>
    </li>
  )
}

const WorkshopAppScreenshot = () => {
  const {scrollY} = useScroll()
  const welcomeBannerScrollAnimation = useTransform(
    scrollY,
    // Map y from these values:
    [0, 600],
    // Into these values:
    ['0deg', '-3deg'],
  )

  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.div
      style={{
        transformOrigin: 'top center',
        transformPerspective: 300,
        rotateX: welcomeBannerScrollAnimation,
      }}
      className="aspect-[1520/1090] h-full w-full"
    >
      {mounted ? (
        <Image
          src={
            theme === 'light'
              ? 'https://res.cloudinary.com/epic-web/image/upload/v1696929540/workshop-app-screenshot-light-1_2x.png'
              : 'https://res.cloudinary.com/epic-web/image/upload/v1696929542/workshop-app-screenshot-1_2x.png'
          }
          width={1520}
          quality={100}
          height={1090}
          alt=""
          aria-hidden
          priority
        />
      ) : null}
    </motion.div>
  )
}

const AppTourVideo = () => {
  return (
    <MuxPlayer
      playbackId="zd6jycd4fMq4EB702BpGbimsyj00idemYohCOEopQYe01k"
      accentColor="#3b82f6"
      className="w-full rounded"
    />
  )
}
