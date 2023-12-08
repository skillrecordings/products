import Layout from '@/components/app/layout'
import {Article, getAllArticles} from '@/lib/articles'
import {drop, first} from 'lodash'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import cx from 'classnames'
import {trpc} from '@/trpc/trpc.client'
import {cn} from '@skillrecordings/ui/utils/cn'

export async function getStaticProps() {
  const articles = await getAllArticles()

  return {
    props: {articles},
    revalidate: 10,
  }
}

type ArticlesIndex = {
  articles: Article[]
}

const Articles: React.FC<ArticlesIndex> = ({articles}) => {
  const publishedArticles = articles.filter(({state}) => state === 'published')
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  return (
    <Layout
      className={cn('bg-[#090E19]', {
        'lg:pt-10': defaultCouponData,
      })}
      meta={{
        title: 'TypeScript Articles by Matt Pocock',
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1702042103/ts-article-card_2x_kakhwd.png',
          alt: 'TypeScript Articles by Matt Pocock',
        },
      }}
    >
      <main className="mx-auto flex h-full w-full max-w-screen-lg flex-grow flex-col gap-5 px-5 pb-20 pt-20 md:pb-32 md:pt-24">
        <Image
          src={require('../../public/assets/landing/4-stars@2x.png')}
          fill
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none object-contain object-top"
        />

        <div className="relative flex w-full flex-col items-center justify-center pb-8 pt-48">
          <Image
            className="absolute -translate-y-28"
            quality={100}
            src={require('../../public/assets/candle@2x.png')}
            width={350}
            height={350}
            alt=""
            priority
            placeholder="blur"
            aria-hidden="true"
          />
          <h1 className="relative z-10 text-center font-heading text-7xl font-bold text-slate-200 sm:text-8xl">
            <span className="not-sr-only">Articles</span>
          </h1>
          <p className="max-w-sm text-center text-lg text-rose-100/90">
            TypeScript Articles by Matt Pocock
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-5 sm:grid-cols-1 sm:gap-5 sm:pt-5 md:gap-10">
          {publishedArticles.map((article) => {
            return (
              <article className="w-full" key={article.slug}>
                <Link
                  href={article.slug}
                  className="group grid grid-cols-1 items-center gap-5 md:grid-cols-2 md:gap-10"
                >
                  {article.image && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-gray-800/40">
                      <Image
                        className="scale-150 transition duration-500 ease-in-out sm:scale-100 sm:group-hover:scale-105"
                        src={article.image}
                        alt=""
                        aria-hidden="true"
                        layout="fill"
                        quality={100}
                        priority
                      />
                    </div>
                  )}
                  <div>
                    <h2
                      className={cx(
                        'max-w-3xl font-text text-2xl font-semibold sm:text-3xl',
                      )}
                    >
                      <Balancer>{article.title}</Balancer>
                    </h2>
                    <div className="max-w-xl pt-5 leading-relaxed text-gray-400">
                      {article.summary ? (
                        <ReactMarkdown
                          components={{
                            a: ({children}) => <span>{children}</span>,
                            p: ({children}) => <Balancer>{children}</Balancer>,
                          }}
                        >
                          {article.summary}
                        </ReactMarkdown>
                      ) : article.body ? (
                        <ReactMarkdown
                          components={{
                            a: ({children}) => <span>{children}</span>,
                            p: ({children}) => <Balancer>{children}</Balancer>,
                          }}
                        >
                          {article.body.slice(0, 400)}
                        </ReactMarkdown>
                      ) : (
                        ''
                      )}
                    </div>
                    <Author />
                  </div>
                </Link>
              </article>
            )
            // return <ArticleTeaser article={article} key={article.slug} />
          })}
        </div>
      </main>
    </Layout>
  )
}

type ArticleTeaserProps = {
  article: Article
}

export const ArticleTeaser: React.FC<ArticleTeaserProps> = ({article}) => {
  const {title, summary, body, image} = article

  return (
    <article className="w-full">
      <Link href={article.slug} className="group block">
        {image && (
          <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-800/60">
            <Image
              className="scale-150 transition duration-500 ease-in-out sm:scale-125 sm:group-hover:scale-150"
              src={image}
              alt=""
              aria-hidden="true"
              layout="fill"
              quality={100}
            />
          </div>
        )}
        <h2 className="w-full pt-5 font-text text-3xl font-bold">
          <Balancer>{title}</Balancer>
        </h2>
        <div className="w-full pt-3 leading-relaxed text-gray-300">
          {summary ? (
            <ReactMarkdown
              components={{
                a: ({children}) => <span>{children}</span>,
              }}
            >
              {summary}
            </ReactMarkdown>
          ) : body ? (
            <ReactMarkdown
              components={{
                a: ({children}) => <span>{children}</span>,
              }}
            >
              {body.slice(0, 400)}
            </ReactMarkdown>
          ) : (
            ''
          )}
        </div>
        <Author />
      </Link>
    </article>
  )
}

export default Articles

const Author = () => {
  return (
    <div className="mt-5 flex items-center gap-2 text-gray-300">
      <div className="flex items-center justify-center overflow-hidden rounded-full">
        <Image
          placeholder="blur"
          src={require('../../public/matt-pocock.jpeg')}
          alt="Matt Pocock"
          width={40}
          height={40}
        />
      </div>
      <span>Matt Pocock</span>
    </div>
  )
}

const TSLogo: React.FC<{className?: string}> = ({className = 'w-5'}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className={className}
      viewBox="0 0 512 512"
      aria-label="TypeScript"
    >
      <rect fill="#3178c6" height="512" rx="50" width="512" />
      <rect fill="#3178c6" height="512" rx="50" width="512" />
      <path
        clipRule="evenodd"
        d="m316.939 407.424v50.061c8.138 4.172 17.763 7.3 28.875 9.386s22.823 3.129 35.135 3.129c11.999 0 23.397-1.147 34.196-3.442 10.799-2.294 20.268-6.075 28.406-11.342 8.138-5.266 14.581-12.15 19.328-20.65s7.121-19.007 7.121-31.522c0-9.074-1.356-17.026-4.069-23.857s-6.625-12.906-11.738-18.225c-5.112-5.319-11.242-10.091-18.389-14.315s-15.207-8.213-24.18-11.967c-6.573-2.712-12.468-5.345-17.685-7.9-5.217-2.556-9.651-5.163-13.303-7.822-3.652-2.66-6.469-5.476-8.451-8.448-1.982-2.973-2.974-6.336-2.974-10.091 0-3.441.887-6.544 2.661-9.308s4.278-5.136 7.512-7.118c3.235-1.981 7.199-3.52 11.894-4.615 4.696-1.095 9.912-1.642 15.651-1.642 4.173 0 8.581.313 13.224.938 4.643.626 9.312 1.591 14.008 2.894 4.695 1.304 9.259 2.947 13.694 4.928 4.434 1.982 8.529 4.276 12.285 6.884v-46.776c-7.616-2.92-15.937-5.084-24.962-6.492s-19.381-2.112-31.066-2.112c-11.895 0-23.163 1.278-33.805 3.833s-20.006 6.544-28.093 11.967c-8.086 5.424-14.476 12.333-19.171 20.729-4.695 8.395-7.043 18.433-7.043 30.114 0 14.914 4.304 27.638 12.912 38.172 8.607 10.533 21.675 19.45 39.204 26.751 6.886 2.816 13.303 5.579 19.25 8.291s11.086 5.528 15.415 8.448c4.33 2.92 7.747 6.101 10.252 9.543 2.504 3.441 3.756 7.352 3.756 11.733 0 3.233-.783 6.231-2.348 8.995s-3.939 5.162-7.121 7.196-7.147 3.624-11.894 4.771c-4.748 1.148-10.303 1.721-16.668 1.721-10.851 0-21.597-1.903-32.24-5.71-10.642-3.806-20.502-9.516-29.579-17.13zm-84.159-123.342h64.22v-41.082h-179v41.082h63.906v182.918h50.874z"
        fill="#fff"
        fillRule="evenodd"
      />
    </svg>
  )
}
