import Layout from '@/components/app/layout'
import {ArticleJsonLd} from '@skillrecordings/next-seo'
import {Article} from '@/lib/articles'
import Image from 'next/image'
import Share from '@/components/share'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {ArticleNewsletterCta} from '@/components/primary-newsletter-cta'
import {format} from 'date-fns'
import {ArticleTeaser} from '@/pages/articles'
import {type MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import removeMarkdown from 'remove-markdown'
import '@/styles/shiki-twoslash.css'
import {linkedHeadingComponents, ShareImageMDX} from '@/components/mdx'
import {cn} from '@skillrecordings/ui/utils/cn'
import {trpc} from '@/trpc/trpc.client'
import Link from 'next/link'
import config from '@/config'

type ArticleTemplateProps = {
  article: Article
  articles: Article[]
  articleBody: MDXRemoteSerializeResult
}

const ArticleTemplate: React.FC<ArticleTemplateProps> = ({
  article,
  articleBody,
  articles,
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
          'relative z-10 mx-auto flex w-full max-w-screen-lg flex-col items-center justify-center gap-10 px-5 pb-8 pt-20 sm:pb-20 sm:pt-32 lg:flex-row lg:gap-0',
        )}
      >
        <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-shrink-0 flex-col">
          <Link
            href="/articles"
            className="group mb-5 flex items-center gap-1 text-sm text-primary opacity-75 transition hover:opacity-100 sm:mb-12 sm:text-base"
          >
            <span
              aria-hidden="true"
              className="relative transition group-hover:-translate-x-1"
            >
              ←
            </span>
            <span>All Articles</span>
          </Link>
          <h1 className="block text-left font-text text-4xl font-bold sm:text-5xl md:text-6xl">
            {title}
          </h1>
          <div className="mt-10 flex w-full justify-center gap-10">
            <div className="flex flex-grow items-start gap-3">
              <div className="flex items-center justify-center overflow-hidden rounded-full">
                <Image
                  src={require('../../public/matt-pocock.jpg')}
                  alt="Matt Pocock"
                  width={56}
                  height={56}
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{config.author}</span>
                <span className="max-w-sm text-balance text-sm text-slate-400 sm:text-base">
                  {config.authorBio}
                </span>
              </div>
            </div>
          </div>
        </div>
        {image && (
          <div className="relative flex h-full w-full flex-col items-end lg:-ml-40 lg:translate-y-16 lg:brightness-125">
            <Image
              className="scale-[1] rounded-lg sm:scale-100"
              src={image}
              alt=""
              aria-hidden="true"
              width={1920 / 2}
              height={1080 / 2}
              quality={100}
              priority
              // fill
            />
            <time dateTime={_createdAt} className="pt-3 text-sm text-slate-600">
              Published on {format(new Date(_createdAt), 'MMM dd, y')}
            </time>
          </div>
        )}
      </header>
      <main className="relative z-10 px-5 pt-10">
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
              }}
            />
          )}
          <div className="flex w-36 -rotate-6 gap-2 pt-10 text-gray-400">
            —
            <Image
              src={require('../../public/assets/signature.svg')}
              alt="Matt's signature"
            />
          </div>
        </div>
        <section className="relative z-10 overflow-hidden px-5 pb-24">
          <Share title={title} />
          {!subscriber && !loadingSubscriber && (
            <ArticleNewsletterCta article={article} />
          )}
        </section>
        <section className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-8 pb-32 sm:grid-cols-2">
          {articles
            .filter((article) => article.state === 'published')
            .map((article) => {
              return <ArticleTeaser article={article} key={article.slug} />
            })}
        </section>
      </main>
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
