import React from 'react'
import Layout from '@/components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/legacy/image'
import {getAllWorkshops} from '@/lib/workshops'
import {getAllBonuses} from '@/lib/bonuses'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Balancer from 'react-wrap-balancer'

const CLOUDINARY_FETCH_BASE_URL = `https://res.cloudinary.com/total-typescript/image/fetch/dpr_auto,f_auto,q_auto:good/`

export async function getStaticProps() {
  const workshops = await getAllWorkshops()
  const bonuses = await getAllBonuses()

  return {
    props: {modules: workshops.reverse(), bonuses: bonuses.reverse()},
    revalidate: 10,
  }
}

const WorkshopsPage: React.FC<{
  modules: SanityDocument[]
  bonuses: SanityDocument[]
}> = ({modules, bonuses}) => {
  const coreVolumeWorkshops = modules.filter(
    (module) => module.product?.slug === 'core-volume',
  )

  return (
    <Layout
      meta={{
        title: `Professional TypeScript Workshops from Matt Pocock`,
        description: `Professional TypeScript workshops by Matt Pocock that will help you learn TypeScript as a professional web developer through exercise driven examples.`,
      }}
    >
      <main className="relative z-10 flex flex-col items-center justify-center py-32 sm:py-40">
        <h1 className="px-5 text-center font-heading text-5xl font-bold sm:text-5xl">
          Professional TypeScript Workshops
        </h1>
        <p className="max-w-lg px-5 pt-8 text-center text-lg text-rose-100/90">
          <Balancer>
            A collection of professional, exercise-driven, in-depth, self-paced
            TypeScript workshops for you to achieve TypeScript wizardry.
          </Balancer>
        </p>
        {modules && (
          <ul className="flex max-w-screen-md flex-col px-5 pt-10 sm:pt-20">
            <div className="space-y-5 sm:space-y-8">
              {coreVolumeWorkshops.length > 0 && (
                <div>
                  <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-cyan-300">
                    <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                      FEATURED
                    </span>
                  </div>
                  <h2 className="pb-8 font-heading text-4xl font-bold sm:text-4xl">
                    Core Volume
                  </h2>
                  {coreVolumeWorkshops.map((module, i) => (
                    <div className="mb-5" key={module.slug.current}>
                      <WorkshopTeaser module={module} i={i} />
                    </div>
                  ))}
                  {bonuses && (
                    <div className="mb-6 mt-10 flex items-center justify-center border-t border-gray-800">
                      <span className="absolute bg-gray-900 px-2.5 text-sm font-medium uppercase tracking-wide text-gray-400">
                        bonuses
                      </span>
                    </div>
                  )}
                  {bonuses.map((module, i) => {
                    return (
                      <div className="mb-5" key={module.slug.current}>
                        <BonusTeaser module={module} />
                      </div>
                    )
                  })}
                </div>
              )}
              {modules
                .filter((module) => module.product?.slug !== 'core-volume')
                .map((module, i) => (
                  <div className="mb-5" key={module.slug.current}>
                    <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-cyan-300">
                      <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                        NEW
                      </span>
                    </div>
                    <h2 className="pb-8 font-heading text-4xl font-bold sm:text-4xl">
                      Standalone Workshops
                    </h2>
                    <WorkshopTeaser module={module} i={i} />
                  </div>
                ))}
            </div>
          </ul>
        )}
      </main>
      <Image
        layout="fill"
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        objectPosition={'top'}
        className="-z-10 object-contain"
      />
    </Layout>
  )
}

const WorkshopTeaser: React.FC<{module: SanityDocument; i: number}> = ({
  module,
  i,
}) => {
  const {title, slug, image, description, sections, state} = module
  return (
    <li className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-8 shadow-2xl md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center">
        <Image
          src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
          alt={title}
          width={300}
          quality={100}
          height={300}
        />
      </div>
      <div className="w-full">
        {state === 'draft' ? (
          <h2 className="text-3xl font-semibold sm:text-4xl">
            <Balancer>{title}</Balancer>
          </h2>
        ) : (
          <Link
            href={{
              pathname: '/workshops/[module]',
              query: {
                module: slug.current,
              },
            }}
          >
            <h2 className="text-3xl font-semibold hover:underline sm:text-4xl">
              <Balancer>{title}</Balancer>
            </h2>
          </Link>
        )}
        <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-cyan-300">
          {state === 'draft' ? (
            <span className="mr-3 rounded-full bg-gray-700 px-2 py-0.5 font-sans font-semibold uppercase text-gray-200">
              Coming Soon
            </span>
          ) : (
            i === 0 && (
              <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                New
              </span>
            )
          )}
          {sections && state !== 'draft' ? (
            <>
              {sections.length} sections,{' '}
              {sections.reduce(
                (acc: number, section: {lessons?: any[]}) =>
                  section.lessons?.length ? section.lessons?.length + acc : acc,
                0,
              )}{' '}
              exercises
            </>
          ) : (
            <br />
          )}
        </div>
        {description && <p className="text-gray-300">{description}</p>}
        {state !== 'draft' && (
          <Link
            href={{
              pathname: '/workshops/[module]',
              query: {
                module: slug.current,
              },
            }}
            className="group mt-5 inline-block gap-2 rounded bg-gray-800 py-2 pl-4 pr-6 font-medium transition hover:bg-gray-700"
            onClick={() => {
              track('clicked view workshop module', {
                module: slug.current,
              })
            }}
          >
            <span className="pr-2">View</span>
            <span
              aria-hidden="true"
              className="absolute text-gray-300 transition group-hover:translate-x-1 group-hover:text-white"
            >
              →
            </span>
          </Link>
        )}
      </div>
      <StripesLeft className="absolute left-0 top-0 hidden w-5 md:block" />
    </li>
  )
}

const BonusTeaser: React.FC<{module: SanityDocument}> = ({module}) => {
  const {title, slug, image, description, sections, lessons, state} = module
  if (state === 'draft') return null

  return (
    <li className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-black/20 p-8 shadow-2xl md:flex-row">
      <div className="flex flex-shrink-0 items-center justify-center">
        <Image
          src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
          alt={title}
          width={300}
          quality={100}
          height={300}
        />
      </div>
      <div className="w-full">
        <span className="mb-3 inline-flex rounded-full bg-yellow-200/10 px-2.5 py-0.5 text-sm font-semibold uppercase tracking-wide text-yellow-200">
          Bonus
        </span>
        <Link
          href={{
            pathname: '/bonuses/[module]',
            query: {
              module: slug.current,
            },
          }}
        >
          <h2 className="text-3xl font-semibold hover:underline sm:text-4xl">
            <Balancer>{title}</Balancer>
          </h2>
        </Link>
        <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-gray-400">
          {lessons.length} videos
        </div>
        {description && <p className="text-gray-300">{description}</p>}
        {state !== 'draft' && (
          <Link
            href={{
              pathname: '/bonuses/[module]',
              query: {
                module: slug.current,
              },
            }}
            className="group mt-5 inline-block gap-2 rounded bg-gray-800 py-2 pl-4 pr-6 font-medium transition hover:bg-gray-700"
            onClick={() => {
              track('clicked view workshop module', {
                module: slug.current,
              })
            }}
          >
            <span className="pr-2">View</span>
            <span
              aria-hidden="true"
              className="absolute text-gray-300 transition group-hover:translate-x-1 group-hover:text-white"
            >
              →
            </span>
          </Link>
        )}
      </div>
      <StripesLeft className="absolute left-0 top-0 hidden w-5 md:block" />
    </li>
  )
}

const StripesLeft: React.FC<{className?: string}> = ({className = ''}) => {
  return (
    <svg
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 28 570"
    >
      <path
        fill="#1F2937"
        fillRule="evenodd"
        d="M0 24.586v2.828l26-26V0h-1.414L0 24.586Zm26-12-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-26 26v2.828l26-26v-2.828Zm0 14-24.96 24.96c.229.696.492 1.377.79 2.039L26 533.414v-2.828Zm0 14L6.447 564.139c.481.463.985.904 1.509 1.32L26 547.414v-2.828Zm0 14-10.646 10.646c.757.211 1.532.381 2.322.506L26 561.414v-2.828Z"
        clipRule="evenodd"
      />
      <path stroke="#1F2937" strokeWidth="2" d="M27 0v570" />
    </svg>
  )
}

export default WorkshopsPage
