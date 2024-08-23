import Layout from '@/components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Article} from '@/lib/articles'
import {motion, useReducedMotion} from 'framer-motion'
import Image from 'next/image'
import Share from '@/components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ArticleNewsletterCta} from '@/components/primary-newsletter-cta'
import {ArticleTeaser} from '@/pages/articles'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import removeMarkdown from 'remove-markdown'
import '@/styles/shiki-twoslash.css'
import {
  FeedbackFormButton,
  linkedHeadingComponents,
  ShareImageMDX,
} from '@/components/mdx'
import {cn} from '@skillrecordings/ui/utils/cn'
import {trpc} from '@/trpc/trpc.client'
import Link from 'next/link'
import config from '@/config'
import {useRouter} from 'next/router'
import {Button} from '@skillrecordings/ui'
import {ArticleToC} from '@/components/articles/article-toc'
import {
  flattenMarkdownHeadings,
  type MarkdownHeading,
} from '@/utils/extract-markdown-headings'
import {useVisibleMarkdownHeading} from '@/components/book/use-visible-markdown-heading'
import {MobileArticleToC} from '@/components/articles/mobile-article-toc'

type ArticleTemplateProps = {
  article: Article
  articles: Article[]
  articleBody: MDXRemoteSerializeResult
  toc: MarkdownHeading[]
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  article,
  articleBody,
  articles,
  toc,
}) => {
  const {body, title, slug, _createdAt, _updatedAt, image, description} =
    article

  const {subscriber, loadingSubscriber} = useConvertkit()
  const articleDescription = description
    ? description
    : body
    ? removeMarkdown(body.slice(0, 160))
    : ''
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  const isBookTeaser = article.articleType === 'bookTeaser'
  const shouldReduceMotion = useReducedMotion()
  const headings = toc ? flattenMarkdownHeadings(toc) : []
  const visibleHeadingId = useVisibleMarkdownHeading(headings, {
    rootMargin: '0% 0% -80% 0%',
    threshold: 0.5,
  })

  return (
    <Layout
      meta={{
        title,
        description: articleDescription,
        ogImage: {
          url: `${
            process.env.NEXT_PUBLIC_OG_IMAGE_URI
          }/og-default?title=${encodeURI(title)}`,
          alt: title,
        },
      }}
    >
      <ArticleJsonLd
        title={title}
        url={process.env.NEXT_PUBLIC_URL + `/${slug}`}
        authorName={`${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`}
        datePublished={_createdAt}
        dateModified={_updatedAt}
        type="Article"
        images={[image || '']}
        description={articleDescription}
      />
      <header
        className={cn(
          'relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-10 px-5 pb-8 pt-24 sm:pb-16 sm:pt-32 lg:flex-row lg:gap-0',
        )}
      >
        <div
          className={cn(
            'relative z-10 mx-auto flex w-full max-w-2xl flex-shrink-0 flex-col items-center text-center',
          )}
        >
          {isBookTeaser ? (
            <div className="relative mb-5 inline-flex items-center justify-center overflow-hidden rounded-full bg-border p-px sm:mb-8">
              <div className="relative z-10 inline-flex rounded-full bg-background px-4 py-1.5 font-sans text-sm font-normal text-salmon-foreground">
                Book Teaser
              </div>
              {!shouldReduceMotion && (
                <motion.div
                  className="absolute h-40 w-5 bg-salmon/75 blur-sm"
                  animate={{
                    rotateZ: [0, 360],
                  }}
                  transition={{
                    duration: 5,
                    ease: 'linear',
                    repeat: Infinity,
                  }}
                />
              )}
            </div>
          ) : (
            <Link
              href="/articles"
              className="group mb-5 flex items-center gap-1 text-sm text-primary opacity-75 transition hover:opacity-100 sm:mb-8 sm:text-base"
            >
              <span
                aria-hidden="true"
                className="relative transition group-hover:-translate-x-1"
              >
                ←
              </span>
              <span>All Articles</span>
            </Link>
          )}
          <h1 className="block text-balance font-text text-4xl font-bold sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <div className="mt-10 flex w-full justify-center gap-10">
            <div
              className={cn('flex items-center gap-3', {
                // 'flex-grow': !isBookTeaser,
              })}
            >
              <div className="flex items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={require('../../public/matt-pocock.jpg')}
                  alt="Matt Pocock"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-lg font-semibold">{config.author}</span>
                <span className="max-w-sm text-balance text-sm text-slate-400 sm:text-base">
                  {config.authorBio}
                </span>
              </div>
            </div>
          </div>
        </div>
        {isBookTeaser && (
          <div className="absolute top-14 after:absolute after:bottom-0 after:left-0 after:h-32 after:w-full after:bg-gradient-to-t after:from-background after:via-background after:to-transparent after:content-[''] sm:top-16">
            <Image
              src={require('../../public/assets/book-teaser-bg@2x.jpg')}
              width={800}
              alt=""
              quality={100}
              priority
              aria-hidden="true"
            />
          </div>
        )}
      </header>
      <main className="relative z-10 px-5 pt-10">
        <div
          className={cn('', {
            'mx-auto flex h-full w-full max-w-screen-xl justify-center gap-5':
              toc,
          })}
        >
          <div className="prose relative z-10 mx-auto w-full max-w-3xl sm:prose-lg md:prose-xl prose-p:text-gray-300 prose-a:text-cyan-300 prose-a:transition hover:prose-a:text-cyan-200 sm:prose-pre:-mx-5">
            {articleBody && (
              <MDX
                contents={articleBody}
                components={{
                  ShareImage: ShareImageMDX,
                  ArticleBodyCTA: ({children, ...props}) => (
                    <ArticleBodyCTA {...props}>{children}</ArticleBodyCTA>
                  ),
                  ...linkedHeadingComponents,
                  hr: () => <hr className="border-gray-700" />,
                  FeedbackFormButton: (props) => (
                    <FeedbackFormButton {...props} />
                  ),
                }}
              />
            )}
            <div className="mx-auto flex w-32 -rotate-6 items-center gap-2 text-slate-500">
              <Image
                src={require('../../public/assets/signature.svg')}
                alt="Matt's signature"
              />
            </div>
          </div>
          {toc && <ArticleToC toc={toc} visibleHeadingId={visibleHeadingId} />}
        </div>
        <section className="relative z-10 overflow-hidden px-5 pb-24 pt-16">
          <ArticleCTA article={article} />
          <Share
            title={title}
            contentType={
              article.articleType === 'bookTeaser' ? 'Book Teaser' : undefined
            }
          />
        </section>
        <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 pb-32 sm:grid-cols-2">
          {articles
            .filter((article) => article.state === 'published')
            .map((article) => {
              return <ArticleTeaser article={article} key={article.slug} />
            })}
        </section>
      </main>
      {toc && (
        <MobileArticleToC
          toc={toc}
          article={article}
          className="flex lg:hidden"
          visibleHeadingId={visibleHeadingId}
        />
      )}
    </Layout>
  )
}

export default ArticleTemplate

const ArticleBodyCTA: React.FC<
  React.PropsWithChildren<{
    href: string
    label?: string
    action?: string
    title: string
    image?: string
  }>
> = ({
  href,
  label = 'Free tutorial',
  title,
  image,
  children,
  action = 'Learn more',
}) => {
  return (
    <div className="not-prose group my-16 flex flex-col overflow-hidden rounded-lg bg-white text-gray-950 sm:flex-row lg:-mx-16">
      {image && (
        <div className="flex flex-shrink-0 items-center justify-center bg-gradient-to-tr from-gray-800 to-gray-900 p-3">
          <Image src={image} alt="" width={300} height={300} aria-hidden />
        </div>
      )}
      <div className="h-full p-5 sm:p-8">
        <div className="mb-3 inline-flex rounded-full bg-amber-300 px-2 py-1 font-mono text-xs font-bold uppercase text-black">
          {label}
        </div>
        <h3 className="text-4xl font-bold">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={href}
            className="hover:underline"
          >
            {title}
          </Link>
        </h3>
        <div className="py-3 text-lg">{children}</div>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={href}
          className="mt-5 inline-flex rounded-md bg-gray-950 px-4 py-2 text-lg font-medium text-white transition hover:bg-gray-800"
        >
          {action}
        </Link>
      </div>
    </div>
  )
}

const ArticleCTA: React.FC<{article: Article}> = ({article}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()

  switch (article.articleType) {
    case 'bookTeaser':
      return <BookTeaserCTA className="max-w-4xl" />
    default:
      return !subscriber && !loadingSubscriber ? (
        <ArticleNewsletterCta article={article} />
      ) : null
  }
}

const BookTeaserCTA: React.FC<{withImage?: boolean; className?: string}> = ({
  withImage = true,
  className,
}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  const router = useRouter()
  const ckBookInterest = {
    [`book_interest`.toLowerCase()]: new Date().toISOString().slice(0, 10),
  }

  return (
    <Link
      href="/books/total-typescript-essentials"
      className={cn(
        'mx-auto flex w-full max-w-3xl flex-col items-center gap-0 rounded-lg border bg-card py-5 transition duration-300 ease-in-out hover:bg-white/5 md:flex-row',
        className,
      )}
    >
      {withImage && (
        <div className="-my-5 flex-shrink-0">
          <Image
            src={require('../../public/assets/book@2x.png')}
            aria-hidden="true"
            alt=""
            width={495 / 1.5}
            height={523 / 1.5}
            quality={100}
            priority
            className="relative md:-ml-10 md:rotate-[16deg]"
          />
        </div>
      )}
      <div
        className={cn(
          'flex w-full flex-col items-start gap-2 text-xl leading-relaxed text-gray-200',
          {
            '-mt-10 p-5 md:mt-0 md:py-0 md:pl-0 md:pr-10': withImage,
            'p-5 sm:p-10': !withImage,
          },
        )}
      >
        <p className=" text-balance pb-3 font-heading text-5xl font-bold text-white md:text-5xl lg:text-6xl">
          <div className="text-2xl font-normal text-primary">
            Total TypeScript
          </div>
          <div>Essentials</div>
        </p>
        <div>
          <p className="text-balance text-base text-gray-300">
            Check out my free book for devs of all levels to learn advanced type
            manipulation and real-world application development patterns in
            TypeScript.
          </p>
        </div>
        <Button asChild className="mt-5">
          <div>Continue Reading</div>
        </Button>
      </div>
    </Link>
  )
}
