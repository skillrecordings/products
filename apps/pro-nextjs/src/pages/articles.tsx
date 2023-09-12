import React from 'react'
import Layout from '@/components/app/layout'
import {getAllArticles, type Article} from '@/lib/articles'
import {GetStaticProps} from 'next'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import Link from 'next/link'
import config from '@/config'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {motion, useMotionValue, useTransform} from 'framer-motion'
import {format} from 'date-fns'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@skillrecordings/ui'
import {useSearchBar} from '@/search-bar/use-search-bar'
import {SearchIcon} from '@heroicons/react/outline'
import {cn} from '@skillrecordings/ui/utils/cn'
import {isFirefox} from '@/utils/is-browser'

export const getStaticProps: GetStaticProps = async (context) => {
  const articles = (await getAllArticles()).filter(
    (article) => article.state === 'published',
  )

  return {
    props: {articles},
    revalidate: 10,
  }
}

const Articles: React.FC<{articles: Article[]}> = ({articles}) => {
  const title = 'Articles'

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [
            {
              url: 'https://res.cloudinary.com/dr0vx1dcs/image/upload/v1691061214/card-articles_2x_wvn4bs.png',
              alt: 'Pro Next.JS Articles',
            },
          ],
        },
      }}
    >
      {/* <Header title={title} /> */}
      <main className="mt-4 px-3 sm:mt-0 sm:px-5 lg:px-8">
        <div className="mx-auto flex gap-10 rounded-t-xl border bg-card">
          <div className="mx-auto flex w-full max-w-screen-lg flex-col sm:flex-row sm:pr-8">
            <aside className="px-5 py-5 sm:border-r sm:px-8 sm:py-16">
              <SearchBar />
            </aside>
            <div className="flex flex-col items-center pt-3 sm:pt-8 lg:pt-16">
              <div className="flex w-full scale-110 sm:scale-100 sm:pl-8">
                <ArticleTeaser
                  withEffect={!isFirefox}
                  article={articles[0]}
                  className="aspect-video h-full w-full [&_[data-card='']]:bg-blue-500 [&_[data-card='']]:p-10 [&_[data-card='']]:text-background sm:[&_[data-title='']]:text-3xl"
                />
              </div>
              <motion.ul className="relative grid grid-cols-1 justify-center gap-y-3 divide-y pt-8 sm:grid-cols-2">
                {/* X borders */}
                <div
                  data-no-divide=""
                  className="pointer-events-none absolute left-0 top-0 hidden h-full w-full border-r before:absolute before:left-0 before:top-0 before:h-full before:w-1/2 before:border-r before:border-gray-100 before:content-[''] sm:block"
                  aria-hidden
                />
                {articles.slice(1, articles.length).map((article, i) => {
                  return (
                    <ArticleTeaser
                      article={article}
                      key={article._id}
                      className="[&_[data-card]]:pl-8 [&_[data-title='']]:transition [&_[data-title='']]:hover:text-blue-500"
                    />
                  )
                })}
              </motion.ul>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Articles

const ArticleTeaser: React.FC<{
  article: Article
  className?: string
  withEffect?: boolean
}> = ({article, className, withEffect = false}) => {
  const {title, image, summary, slug, _createdAt} = article
  const item = {
    hidden: {opacity: 0, y: 20},
    show: {opacity: 1, y: 0},
  }

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const objectX = useMotionValue(0)
  const objectY = useMotionValue(0)

  const handleMouseMove = (e: any) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }

  const parentRef = React.useRef<any>(null)

  // Calculate the offset between cursor and object position
  const offsetX = useTransform(
    cursorX,
    (x) => x - parentRef?.current?.getBoundingClientRect().left,
  )
  const offsetY = useTransform(
    cursorY,
    (y) => y - parentRef?.current?.getBoundingClientRect().top,
  )

  // Update object position relative to the cursor
  objectX.set(offsetX.get())
  objectY.set(offsetY.get())

  return (
    <li
      onMouseMove={withEffect ? handleMouseMove : () => {}}
      ref={withEffect ? parentRef : null}
      key={slug}
      className={cn(' flex h-full', className)}
    >
      <motion.div
        key={slug + '-cursor'}
        style={withEffect ? {x: offsetX, y: offsetY} : {}}
        className={cn(
          'pointer-events-none absolute -ml-20 -mt-20 h-40 w-40 rounded-full bg-white mix-blend-overlay blur-[150px]',
          {
            hidden: !withEffect,
          },
        )}
        aria-hidden
      />
      <Link
        href={`/${article.slug}`}
        passHref
        onClick={() => {
          track('clicked view article', {
            article: slug,
          })
        }}
        className="flex w-full rounded"
      >
        <Card
          data-card=""
          className="mx-auto flex h-full w-full flex-col justify-between border-none p-8 shadow-none"
        >
          <motion.div
            initial={{opacity: 0}}
            whileInView={{
              opacity: 1,
            }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
            }}
          >
            <CardHeader className="p-0">
              {image && image.secure_url && (
                <Image
                  className="aspect-video rounded"
                  src={image.secure_url}
                  width={image.width}
                  height={image.height}
                  alt="article illustration"
                />
              )}

              <p className="pb-1.5 text-sm opacity-60">
                {format(new Date(_createdAt), 'MMMM do, y')}
              </p>
              <CardTitle
                data-title=""
                className="text-xl font-semibold leading-tight"
              >
                {title}
              </CardTitle>
            </CardHeader>
            {summary && (
              <CardContent className="p-0">
                <p className="pt-4 text-sm opacity-75">
                  <Balancer ratio={0.3}>{summary}</Balancer>
                </p>
              </CardContent>
            )}
          </motion.div>
          <motion.div variants={item}>
            <CardFooter
              data-footer=""
              className="mt-8 flex items-center gap-1.5 p-0 text-sm"
            >
              <Image
                src={require('../../public/jack-herrington.jpg')}
                alt={config.author}
                width={32}
                height={32}
                className="rounded-full bg-gray-200"
              />
              <span>{config.author}</span>
            </CardFooter>
          </motion.div>
        </Card>
      </Link>
    </li>
  )
}

const SearchBar: React.FC<{isMinified?: boolean | undefined}> = ({
  isMinified,
}) => {
  const {
    open: isSearchBarOpen,
    setOpen: setOpenSearchBar,
    setResourceType,
  } = useSearchBar()

  // useEffect(() => {
  //   setResourceType('article')
  // }, [])

  return (
    <button
      className="group flex w-full items-center gap-16 rounded border bg-card px-2.5 py-2 text-base font-medium opacity-90 transition hover:opacity-100 sm:w-auto sm:px-2 sm:py-2 md:px-2 md:text-sm lg:px-2 lg:text-base"
      onClick={() => {
        setOpenSearchBar(!isSearchBarOpen)
      }}
    >
      <div className="flex items-center gap-1">
        <SearchIcon
          className="h-3.5 w-3.5 opacity-80 transition group-hover:opacity-100"
          aria-hidden="true"
        />
        <span
          className={cn('', {
            'block md:hidden lg:block xl:block': isMinified,
            'block md:block lg:block': !isMinified,
          })}
        >
          Search
        </span>
      </div>
      <div
        className="-mb-0.5 hidden items-center gap-0.5 rounded px-1 font-mono text-xs font-semibold text-gray-300 md:flex"
        aria-label="shortcut"
      >
        <span>⌘</span>
        <span>K</span>
      </div>
    </button>
  )
}
