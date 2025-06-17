import React from 'react'
import Layout from 'components/app/layout'
import {type Contributor, type ContributorResource} from 'lib/contributors'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import pluralize from 'pluralize'
import Link from 'next/link'
import {getIcon} from 'pages/search'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useTheme} from 'next-themes'
import {ShieldCheckIcon} from '@heroicons/react/solid'
import {getOgImage} from 'utils/get-og-image'

const ContributorTemplate: React.FC<{
  contributor: Contributor
  resources: ContributorResource[]
}> = ({contributor, resources}) => {
  const {theme} = useTheme()
  const isKent = contributor.slug === 'kent-c-dodds'
  const ogImage = getOgImage({
    title: contributor.name,
    image: contributor?.picture?.url,
    path: '/contributor',
  })
  return (
    <Layout
      meta={{
        title: `${contributor.name} is Instructor on EpicWeb.Dev`,
        description: contributor.bio?.slice(0, 100),
        ogImage,
      }}
    >
      <header className="mx-auto w-full max-w-screen-lg px-5 py-8"></header>
      <main className="relative mx-auto flex w-full max-w-screen-lg grid-cols-12 flex-col gap-5 pb-0 md:grid md:px-5 md:pb-16 lg:px-0">
        <aside className="relative col-span-3 -mt-5 px-5 md:px-0">
          <div className="sticky top-20 flex flex-col">
            {contributor.picture?.url && (
              <div className="relative h-40 w-40">
                <Image
                  fill
                  src={contributor.picture.url}
                  alt={contributor.picture?.alt}
                  className="rounded-full bg-foreground/5 object-cover"
                  priority
                />
                {isKent ? (
                  <div className="absolute bottom-0 right-0 flex items-center justify-center rounded-full border bg-background p-2">
                    <ShieldCheckIcon className="w-5 text-indigo-500 dark:text-amber-300" />
                  </div>
                ) : null}
              </div>
            )}
            <h1 className="pt-3 text-xl font-bold">{contributor.name}</h1>
            {contributor.bio && (
              <ReactMarkdown className="prose prose-sm w-full overflow-y-auto pt-2 dark:prose-invert prose-p:opacity-80">
                {contributor.bio}
              </ReactMarkdown>
            )}
            <hr className="mt-5 flex h-px w-full bg-border md:hidden" />
          </div>
        </aside>
        <article className="col-span-9 md:pl-10">
          <h2 className="px-5 text-xl font-bold md:px-0">Resources</h2>
          <p className="px-5 pt-2 opacity-75 md:px-0">From newest to oldest.</p>
          <ul className="mt-5 flex flex-col md:mt-8">
            {resources &&
              resources.map((resource, i) => {
                const resourceType =
                  resource._type === 'module'
                    ? resource.moduleType || resource._type
                    : resource._type
                const path =
                  resource._type === 'module'
                    ? resource.moduleType && pluralize(resource.moduleType)
                    : resource._type === 'article'
                    ? null
                    : pluralize(resource._type)

                return (
                  <li key={resource._id}>
                    <Link
                      className={cn(
                        'group relative flex items-center gap-2 p-3.5 sm:p-5 md:rounded ',
                        {
                          'bg-card': i % 2 === 0,
                        },
                      )}
                      href={
                        path ? `/${path}/${resource.slug}` : `/${resource.slug}`
                      }
                    >
                      <div className="flex flex-shrink-0">
                        {/* <div className="absolute bottom-1 left-1 hidden items-center gap-1.5 rounded-sm border bg-background p-1 lg:flex">
                          <div className="relative z-10 opacity-100 [&_svg]:h-4 [&_svg]:w-4">
                            {getIcon(resourceType, true, theme)}
                          </div>
                          <span className="absolute -left-1 z-0 rounded-r border-y border-r bg-background px-1 py-0.5 pl-2 text-sm uppercase opacity-0 transition duration-200 group-hover:translate-x-5 group-hover:opacity-100">
                            <span className="font-semibold opacity-0 transition duration-300 group-hover:opacity-100">
                              {resourceType}
                            </span>
                          </span>
                        </div> */}
                        {resource.image && (
                          <Image
                            src={resource.image}
                            alt={resource.title}
                            width={200 / 1.5}
                            height={200 / 1.5}
                            className={cn(
                              'mr-2 max-w-[80px] rounded-sm sm:max-w-full',
                              {
                                'aspect-square object-cover':
                                  resourceType === 'article',
                              },
                            )}
                          />
                        )}
                        {resource.muxPlaybackId && (
                          <Image
                            src={`https://image.mux.com/${resource.muxPlaybackId}/thumbnail.png?width=480&height=384&fit_mode=preserve&time=16`}
                            alt={resource.title}
                            width={200 / 1.5}
                            height={113 / 1.5}
                            aria-hidden="true"
                            className="mr-2 aspect-square max-w-[80px] rounded-sm object-cover sm:max-w-full"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="w-full text-base font-semibold md:text-lg">
                          {resource?.title}
                        </h3>
                        <p className="flex text-sm capitalize opacity-75 ">
                          {/* {getIcon(resourceType, true, theme)} */}
                          {resourceType}
                        </p>
                      </div>
                    </Link>
                  </li>
                )
              })}
          </ul>
        </article>
      </main>
    </Layout>
  )
}

export default ContributorTemplate
