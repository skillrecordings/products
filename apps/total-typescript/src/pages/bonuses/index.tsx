import React from 'react'
import Layout from '@/components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import Balancer from 'react-wrap-balancer'
import {getAllBonuses} from '../../lib/bonuses'

export async function getStaticProps() {
  const playlists = await getAllBonuses()

  return {
    props: {playlists},
    revalidate: 10,
  }
}

const PlaylistsPage: React.FC<{playlists: SanityDocument[]}> = ({
  playlists,
}) => {
  return (
    <Layout
      meta={{
        title: `Total TypeScript Bonus Content from Matt Pocock`,
        description: `Total TypeScript Bonus Content that will help you learn how to use TypeScript as a professional web developer through exercise driven examples.`,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1681208741/bonuses-card_2x_bvmiya.png',
        },
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl">
          Total TypeScript Bonus Content
        </h1>
        <p className="max-w-lg px-5 pt-8 text-center text-lg text-rose-100/90">
          <Balancer>
            A collection of bonus content featuring TypeScript videos for you to
            use on your journey to TypeScript wizardry.
          </Balancer>
        </p>
        {playlists && (
          <ul className="flex max-w-screen-md flex-col gap-5 px-5 pt-10 sm:gap-8 sm:pt-20">
            {playlists.map(
              ({title, slug, image, description, lessons, moduleType}, i) => {
                return (
                  <li
                    key={slug.current}
                    className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-10 shadow-2xl md:flex-row"
                  >
                    {image && (
                      <div className="flex flex-shrink-0 items-center justify-center">
                        <Image
                          src={image}
                          alt={title}
                          width={300}
                          quality={100}
                          height={300}
                        />
                      </div>
                    )}
                    <div>
                      <Link
                        href={{
                          pathname: '/bonuses/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                        className="text-3xl font-semibold hover:underline sm:text-4xl"
                      >
                        {title}
                      </Link>
                      <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-cyan-300">
                        {i === 0 && (
                          <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                            New
                          </span>
                        )}
                        {lessons.length} videos
                      </div>
                      {description && (
                        <p className="text-gray-300">{description}</p>
                      )}
                      <Link
                        href={{
                          pathname: '/bonuses/[module]',
                          query: {
                            module: slug.current,
                          },
                        }}
                        className="group mt-5 inline-block gap-2 rounded bg-gray-800 px-4 py-2 font-medium transition hover:bg-gray-700"
                      >
                        View{' '}
                        <span
                          aria-hidden="true"
                          className="text-gray-300 transition group-hover:text-white"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </li>
                )
              },
            )}
          </ul>
        )}
      </main>
      <Image
        fill
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        className="-z-10 object-contain object-top"
      />
    </Layout>
  )
}

export default PlaylistsPage
