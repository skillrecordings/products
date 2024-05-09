import * as React from 'react'
import {useRouter} from 'next/router'
import Balancer from 'react-wrap-balancer'
import {truncate} from 'lodash'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import useClipboard from 'react-use-clipboard'
import {type PodcastFrontMatter} from '@/@types/mdx-podcast'
import Layout from '@/components/app/layout'
import Divider from '@/components/divider'
import mdxComponents from '@/components/mdx-components'
import PodcastPlayer from '@/components/podcasts/podcast-player'
import EpisodesList from '@/components/podcasts/episodes-list'
import SubscribeToReactEmailCourseCta from '@/components/subscribe-react-email-course-cta'

interface PodcastTemplateProps {
  allPodcasts: PodcastFrontMatter[]
  mdx: MDXRemoteSerializeResult
  frontMatter: PodcastFrontMatter
}

const PodcastTemplate: React.FC<PodcastTemplateProps> = ({
  allPodcasts,
  frontMatter,
  mdx,
}) => {
  const router = useRouter()
  const {title, slug, description, simplecastId, image} = frontMatter
  const [isCopiedToClipboard, setCopiedToClipboard] = useClipboard(
    `https://epicreact.dev/podcast/${slug}`,
  )

  return (
    <Layout
      meta={{
        title: truncate(title, {length: 75}),
        description: truncate(description, {length: 155}),
        url: `${process.env.NEXT_PUBLIC_URL}/podcasts/${slug}`,
        ogImage: {url: `${process.env.NEXT_PUBLIC_URL}${image}`, alt: title},
      }}
    >
      <main className="relative mx-auto grid max-w-screen-xl grid-cols-1 gap-8 px-6 pb-6 pt-[31px] sm:px-8 sm:pb-14 sm:pt-[75px] lg:grid-cols-9">
        <article className="col-span-1 lg:col-span-5 xl:col-span-6">
          <header>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl sm:leading-tight lg:text-[2.75rem] lg:leading-tight">
              <Balancer>{title}</Balancer>
            </h1>
            <PodcastPlayer episodeId={simplecastId} />
            <p className="prose-xl max-w-none font-semibold">{description}</p>
            <Divider className="my-10 ml-0" />
          </header>
          <section className="prose prose-lg max-w-none lg:prose-xl">
            <MDX contents={mdx} components={{...mdxComponents}} />
          </section>
          <footer className="py-20">
            <div className="mx-auto mb-16 flex max-w-screen-md flex-col items-center justify-center py-5 sm:py-10">
              <h2 className="text-center text-2xl font-bold leading-tight sm:text-3xl">
                Share This Episode With Your Friends
              </h2>
              <div className="mt-4 flex flex-wrap items-center justify-center">
                <a
                  className="m-1 flex items-center rounded-lg bg-er-gray-100 px-3 py-2 leading-6 transition-colors duration-200 ease-in-out hover:bg-er-gray-200"
                  href={`https://twitter.com/intent/tweet/?text=${encodeURIComponent(
                    title + ', podcast with @kentcdodds',
                  )}&url=${encodeURIComponent(
                    `https://epicreact.dev/podcast/${slug}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* prettier-ignore */}
                  <svg className="mr-1 text-react" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><g fill="currentColor"><path fill="none" d="M0 0h24v24H0z"></path><path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path></g></svg>
                  <span>Tweet</span>
                </a>
                <button
                  className="m-1 flex items-center rounded-lg bg-er-gray-100 px-3 py-2 leading-6 transition-colors duration-200 ease-in-out hover:bg-er-gray-200"
                  onClick={() => setCopiedToClipboard()}
                >
                  <svg
                    className="mr-1 text-react"
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                  >
                    <g fill="none">
                      <path
                        d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101m-.758-4.899a4 4 0 0 0 5.656 0l4-4a4 4 0 0 0-5.656-5.656l-1.1 1.1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                  <span>
                    {isCopiedToClipboard ? 'Copied!' : 'Copy link to clipboard'}
                  </span>
                </button>
              </div>
            </div>
            <div className="mt-20">
              <SubscribeToReactEmailCourseCta>
                <h2 className="mb-2 text-center text-2xl font-bold leading-tight sm:text-3xl">
                  Get my free 7-part email course on React!
                </h2>
                <p className="mb-10 text-center text-base leading-tight text-react">
                  Delivered straight to your inbox.
                </p>
              </SubscribeToReactEmailCourseCta>
            </div>
          </footer>
        </article>
        <EpisodesList episodes={allPodcasts} location={router.asPath} />
      </main>
    </Layout>
  )
}

export default PodcastTemplate
