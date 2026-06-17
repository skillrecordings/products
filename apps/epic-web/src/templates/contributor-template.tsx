import React from 'react'
import Layout from 'components/app/layout'
import {type Contributor, type ContributorResource} from 'lib/contributors'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import pluralize from 'pluralize'
import Link from 'next/link'
import {cn} from '@skillrecordings/ui/utils/cn'
import {ShieldCheckIcon} from '@heroicons/react/solid'
import {getOgImage} from 'utils/get-og-image'

// Build the canonical path for a resource, mirroring the route structure:
// modules live under their pluralized moduleType (`/workshops/…`), articles at
// the root (`/slug`), everything else under its pluralized type (`/talks/…`).
const getResourcePath = (resource: ContributorResource): string => {
  if (resource._type === 'module') {
    return resource.moduleType
      ? `/${pluralize(resource.moduleType)}/${resource.slug}`
      : `/${resource.slug}`
  }
  if (resource._type === 'article') return `/${resource.slug}`
  return `/${pluralize(resource._type)}/${resource.slug}`
}

const muxThumbnail = (id: string) =>
  `https://image.mux.com/${id}/thumbnail.png?width=480&height=384&fit_mode=preserve&time=16`

const ArrowIcon: React.FC<{className?: string}> = ({className}) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
)

const Badge: React.FC<{
  children: React.ReactNode
  variant?: 'muted' | 'free' | 'pro'
}> = ({children, variant = 'muted'}) => (
  <span
    className={cn(
      'inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
      {
        'bg-foreground/5 text-foreground/60': variant === 'muted',
        'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400/90':
          variant === 'free',
        'border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400/90':
          variant === 'pro',
      },
    )}
  >
    {children}
  </span>
)

const SectionHeading: React.FC<{
  title: string
  count?: number
  free?: boolean
  pro?: boolean
}> = ({title, count, free, pro}) => (
  <div className="mb-6 flex flex-wrap items-center gap-3">
    <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
    {typeof count === 'number' && (
      <span className="rounded bg-foreground/5 px-2 py-0.5 text-sm font-medium text-foreground/55">
        {count}
      </span>
    )}
    {free && <Badge variant="free">Free</Badge>}
    {pro && <Badge variant="pro">Pro</Badge>}
  </div>
)

// A text-first card used for articles: bold title, description, then an
// author + reading-time footer.
const ArticleCard: React.FC<{
  resource: ContributorResource
  author: Pick<Contributor, 'name' | 'picture'>
}> = ({resource, author}) => (
  <li className="h-full">
    <Link
      href={getResourcePath(resource)}
      className="group flex h-full flex-col rounded-lg border bg-card p-6 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-7"
    >
      <h3 className="text-lg font-semibold leading-snug tracking-tight sm:text-xl">
        {resource.title}
      </h3>
      {resource.description && (
        <p className="mt-3 leading-relaxed text-foreground/60">
          {resource.description}
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-x-8 gap-y-4 pt-8">
        <div className="flex items-center gap-3">
          {author.picture?.url && (
            <Image
              src={author.picture.url}
              alt={author.picture.alt || author.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full bg-foreground/5 object-cover"
            />
          )}
          <div className="text-sm leading-tight">
            <div className="font-medium">Written by</div>
            <div className="text-foreground/60">{author.name}</div>
          </div>
        </div>
        {resource.readingTime ? (
          <div className="text-sm leading-tight">
            <div className="font-medium">Time to read</div>
            <div className="text-foreground/60">
              ~ {resource.readingTime}{' '}
              {resource.readingTime === 1 ? 'minute' : 'minutes'}
            </div>
          </div>
        ) : null}
      </div>
    </Link>
  </li>
)

// A media card used for talks, tips, and modules: thumbnail + title + CTA.
const MediaCard: React.FC<{
  resource: ContributorResource
  cta: string
}> = ({resource, cta}) => {
  const thumbnail = resource.image
    ? resource.image
    : resource.muxPlaybackId
    ? muxThumbnail(resource.muxPlaybackId)
    : null
  const isVideo = !resource.image && Boolean(resource.muxPlaybackId)

  return (
    <li className="h-full">
      <Link
        href={getResourcePath(resource)}
        className="group flex h-full flex-col overflow-hidden rounded-lg border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
      >
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden border-b bg-foreground/5">
          {thumbnail && (
            <Image
              src={thumbnail}
              alt={resource.title}
              fill
              className={cn(isVideo ? 'object-cover' : 'object-contain p-6')}
            />
          )}
          {isVideo && (
            <span className="absolute grid h-11 w-11 place-items-center rounded-full bg-white/85 shadow-md">
              <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4 fill-black/80">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold leading-snug">
            {resource.title}
          </h3>
          {resource.description && (
            <p className="mt-2 line-clamp-2 text-sm text-foreground/60">
              {resource.description}
            </p>
          )}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-medium text-foreground/80">
            {cta}
            <ArrowIcon className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </li>
  )
}

const ContributorTemplate: React.FC<{
  contributor: Contributor
  resources: ContributorResource[]
}> = ({contributor, resources}) => {
  const isKent = contributor.slug === 'kent-c-dodds'
  const ogImage = getOgImage({
    title: contributor.name,
    image: contributor?.picture?.url,
    path: '/contributor',
  })

  const safeResources = resources || []
  // Free resources (articles, talks/tips, tutorials) lead the page; paid
  // workshops get their own section at the end.
  const articles = safeResources.filter((r) => r._type === 'article')
  const talks = safeResources.filter((r) => r._type === 'talk')
  const tips = safeResources.filter((r) => r._type === 'tip')
  const freeMedia = [...talks, ...tips]
  const tutorials = safeResources.filter(
    (r) => r._type === 'module' && r.moduleType === 'tutorial',
  )
  const workshops = safeResources.filter(
    (r) => r._type === 'module' && r.moduleType === 'workshop',
  )

  return (
    <Layout
      meta={{
        title: `${contributor.name} is Instructor on EpicWeb.Dev`,
        description: contributor.bio?.slice(0, 100),
        ogImage,
      }}
    >
      {/* ——— Author hero ——— */}
      <header className="border-b">
        <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center gap-8 px-5 py-14 text-center md:flex-row md:items-center md:text-left">
          {contributor.picture?.url && (
            <div className="relative h-32 w-32 flex-shrink-0 sm:h-36 sm:w-36">
              <Image
                fill
                src={contributor.picture.url}
                alt={contributor.picture?.alt || contributor.name}
                className="rounded-full bg-foreground/5 object-cover ring-2 ring-background"
                priority
              />
              {isKent && (
                <div className="absolute bottom-1 right-1 flex items-center justify-center rounded-full border bg-background p-1.5">
                  <ShieldCheckIcon className="w-5 text-indigo-500 dark:text-amber-300" />
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col items-center md:items-start">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {contributor.name}
            </h1>
            {contributor.bio && (
              <ReactMarkdown className="prose prose-sm mt-3 max-w-xl dark:prose-invert prose-p:opacity-80 prose-a:text-primary">
                {contributor.bio}
              </ReactMarkdown>
            )}
            {contributor.links && contributor.links.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 md:justify-start">
                {contributor.links.map(
                  (link) =>
                    link.url && (
                      <a
                        key={link.url}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border bg-card px-3 py-1.5 text-sm font-medium text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
                      >
                        {link.label || link.url.replace(/^https?:\/\//, '')}
                      </a>
                    ),
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-screen-lg px-5 pb-20">
        {/* ——— Intro / counts ——— */}
        <div className="mt-10 flex flex-col gap-5 rounded-lg border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-foreground/70">
            Start with the <strong className="text-foreground">free</strong>{' '}
            articles, talks, and tutorials. The Pro workshops at the bottom go
            deeper for the complete, hands-on path.
          </p>
          <div className="flex gap-8">
            {[
              {n: articles.length, l: 'Articles'},
              {n: freeMedia.length, l: 'Talks & Tips'},
              {n: tutorials.length, l: 'Tutorials'},
              {n: workshops.length, l: 'Workshops'},
            ]
              .filter((s) => s.n > 0)
              .map((s) => (
                <div key={s.l} className="text-center">
                  <div className="text-xl font-semibold tracking-tight">
                    {s.n}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wide text-foreground/40">
                    {s.l}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* ——— Articles (free, 3-up grid) ——— */}
        {articles.length > 0 && (
          <section className="pt-14">
            <SectionHeading title="Articles" count={articles.length} free />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((resource) => (
                <ArticleCard
                  key={resource._id}
                  resource={resource}
                  author={contributor}
                />
              ))}
            </ul>
          </section>
        )}

        {/* ——— Talks & Tips (free) ——— */}
        {freeMedia.length > 0 && (
          <section className="pt-14">
            <SectionHeading
              title={
                talks.length && tips.length
                  ? 'Talks & Tips'
                  : talks.length
                  ? 'Talks'
                  : 'Tips'
              }
              count={freeMedia.length}
              free
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {freeMedia.map((resource) => (
                <MediaCard
                  key={resource._id}
                  resource={resource}
                  cta={resource._type === 'talk' ? 'Watch' : 'Watch tip'}
                />
              ))}
            </ul>
          </section>
        )}

        {/* ——— Tutorials (free) ——— */}
        {tutorials.length > 0 && (
          <section className="pt-14">
            <SectionHeading title="Tutorials" count={tutorials.length} free />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tutorials.map((resource) => (
                <MediaCard
                  key={resource._id}
                  resource={resource}
                  cta="Start tutorial"
                />
              ))}
            </ul>
          </section>
        )}

        {/* ——— Pro workshops (paid) ——— */}
        {workshops.length > 0 && (
          <section className="mt-16 border-t border-dashed pt-12">
            <SectionHeading
              title="Pro Workshops"
              count={workshops.length}
              pro
            />
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workshops.map((resource) => (
                <MediaCard
                  key={resource._id}
                  resource={resource}
                  cta="Start workshop"
                />
              ))}
            </ul>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default ContributorTemplate
