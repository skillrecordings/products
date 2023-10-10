import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import Layout from 'components/app/layout'
import Icon from 'components/icons'
import {linkedHeadingComponents} from 'components/mdx'
import {motion, useScroll, useTransform} from 'framer-motion'
import {Page, getPage} from 'lib/pages'
import {getProduct} from 'lib/products'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {useTheme} from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {useMountedState} from 'react-use'
import Balancer from 'react-wrap-balancer'

export const getStaticProps = async () => {
  const page = await getPage('get-started')
  const bodyMdx = page.body && (await serializeMDX(page.body))
  const product = await getProduct(process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID)
  const workshops = product.modules
  return {
    props: {
      page,
      body: bodyMdx,
      workshops,
    },
  }
}

const GetStartedPage: React.FC<{
  page: Page
  body: MDXRemoteSerializeResult
  workshops: Module[]
}> = ({page, body, workshops}) => {
  return (
    <Layout
      meta={{
        title: 'Get Started',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1696931328/get-started-card_2x.png',
        },
      }}
    >
      <header className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center py-16">
        <h1 className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl">
          Get Started
        </h1>
        <h2 className="pb-8 pt-8 text-center text-lg text-gray-700 dark:text-gray-300 sm:text-xl lg:text-2xl">
          <Balancer>
            From setting up your environment to navigating exercises and
            understanding the Epic Workshop App's structure, this guide ensures
            a smooth workshop experience.
          </Balancer>
        </h2>
        <WorkshopAppScreenshot />
      </header>
      <main className="prose mx-auto w-full max-w-screen-md px-5 pb-16 dark:prose-invert md:prose-lg prose-headings:pt-8">
        {page.body ? (
          <MDX
            components={{
              ...linkedHeadingComponents,
              READMEs: () => <READMEs workshops={workshops} />,
            }}
            contents={body}
          />
        ) : null}
      </main>
    </Layout>
  )
}

export default GetStartedPage

const READMEs: React.FC<{workshops: Module[]}> = ({workshops}) => {
  return (
    <div className="not-prose my-8 flex flex-col items-center justify-center text-base sm:gap-4 md:text-lg">
      <ul className="w-full divide-y">
        {workshops.map((workshop) => {
          if (!workshop?.github?.repo) return null

          return (
            <li className="flex w-full flex-col justify-between gap-2 py-4 font-semibold sm:flex-row sm:items-center sm:gap-5 sm:py-2">
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
                <div>
                  <Link
                    href={`/workshops/${workshop.slug.current}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {workshop.title}
                  </Link>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-5 pr-5 text-sm font-medium">
                <Link
                  href={workshop.github.repo}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 underline"
                >
                  <Icon name="Github" size="16" /> Workshop App
                </Link>
                <Link
                  href={workshop.github.repo + '#readme'}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 underline"
                >
                  README
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
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
