import React from 'react'
import Layout from '@/components/app/layout'
import {SanityDocument} from '@sanity/client'
import Link from 'next/link'
import Image from 'next/image'
import {getAllWorkshops} from '@/lib/workshops'
import {getAllBonuses} from '@/lib/bonuses'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Balancer from 'react-wrap-balancer'
import Heading from '@/components/heading'
import Sparkle from 'react-sparkle'
import {useActivePromotion} from '@/hooks/use-active-promotion'

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
  const coreVolumeWorkshops = modules.filter((module) =>
    module.product.find(
      ({slug}: {slug: string}) => slug === 'core-volume-react-bundle',
    ),
  )
  const {activePromotion, buyUrl, getCookie, setCookie} = useActivePromotion()

  const standaloneWorkshops = modules.filter((module) => {
    // filter out core-volume product
    const coreVolume = module.product.find(
      ({slug}: {slug: string}) => slug === 'core-volume-react-bundle',
    )
    if (coreVolume) {
      return false
    }
    return true
  })

  return (
    <Layout
      meta={{
        title: `Professional TypeScript Workshops from Matt Pocock`,
        description: `Professional TypeScript workshops by Matt Pocock that will help you learn TypeScript as a professional web developer through exercise driven examples.`,
      }}
    >
      <Heading
        title="TypeScript Pro Complete"
        description="A collection of professional, exercise-driven, in-depth, self-paced TypeScript workshops for you to achieve TypeScript wizardry."
      >
        {activePromotion ? (
          <h2 className="mt-8">
            <Link
              href="/#buy"
              className="relative inline-block max-w-screen-sm text-balance text-lg text-white"
            >
              Become a TypeScript Wizard —{' '}
              <span className="font-semibold text-yellow-300 underline">
                Get Access Today
              </span>
              <Sparkle
                flickerSpeed="slowest"
                count={10}
                color="rgb(253, 224, 71)"
                flicker={false}
                fadeOutSpeed={10}
                overflowPx={15}
              />
            </Link>
          </h2>
        ) : (
          <div aria-hidden="true" className="flex h-[60px] w-full" />
        )}
      </Heading>
      <main className="relative z-10 flex flex-col items-center justify-center">
        {modules && (
          <ul className="flex max-w-screen-lg flex-col px-5 py-10 sm:py-10">
            <div className="space-y-14">
              {coreVolumeWorkshops.length > 0 && (
                <div>
                  {standaloneWorkshops.map((module, i) => (
                    <div className="mb-5" key={module.slug.current}>
                      <WorkshopTeaser
                        module={module}
                        i={i}
                        key={module.slug.current}
                      />
                    </div>
                  ))}
                  {coreVolumeWorkshops.map((module, i) => (
                    <div className="mb-5" key={module.slug.current}>
                      <WorkshopTeaser module={module} i={i} />
                    </div>
                  ))}
                  {bonuses && (
                    <div className="mt-10 flex w-full items-center space-x-2 pb-3">
                      <h2 className="text-xl font-medium text-gray-300 sm:text-2xl">
                        Bonuses
                      </h2>
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
            </div>
          </ul>
        )}
      </main>
    </Layout>
  )
}

const WorkshopTeaser: React.FC<{module: SanityDocument; i: number}> = ({
  module,
  i,
}) => {
  const {title, slug, image, description, sections, state} = module
  return (
    <li className="relative flex flex-col items-center gap-10 rounded-lg border bg-card p-10 shadow-2xl after:absolute after:-top-px after:left-0 after:h-px after:w-full after:bg-gradient-to-r after:from-transparent after:via-[#57687C]/40 after:to-transparent after:content-[''] md:flex-row">
      <Link
        href={{
          pathname: '/workshops/[module]',
          query: {
            module: slug.current,
          },
        }}
        className="flex flex-shrink-0 items-center justify-center"
      >
        <Image
          src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
          alt={title}
          width={300}
          quality={100}
          height={300}
        />
      </Link>
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
        <div className="pb-3 pt-4 font-mono text-xs font-semibold uppercase text-primary">
          {state === 'draft' ? (
            <span className="mr-3 rounded-full bg-gray-700 px-2 py-0.5 font-sans font-semibold uppercase text-gray-200">
              Coming Soon
            </span>
          ) : (
            i === 0 && (
              <span className="mr-3 rounded-full bg-primary px-2 py-0.5 font-sans font-semibold uppercase text-primary-foreground">
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
        {description && <p className="mt-5 text-gray-300">{description}</p>}
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
            <span className="pr-2">Workshop Details</span>
            <span
              aria-hidden="true"
              className="absolute text-gray-300 transition group-hover:translate-x-1 group-hover:text-white"
            >
              →
            </span>
          </Link>
        )}
      </div>
    </li>
  )
}

const BonusTeaser: React.FC<{module: SanityDocument}> = ({module}) => {
  const {title, slug, image, description, sections, lessons, state} = module
  if (state === 'draft') return null

  return (
    <li className="relative flex flex-col items-center gap-10 overflow-hidden rounded-lg border border-gray-700/50 bg-gray-800/20 p-8 shadow-2xl md:flex-row">
      <Link
        href={{
          pathname: '/bonuses/[module]',
          query: {
            module: slug.current,
          },
        }}
        className="flex flex-shrink-0 items-center justify-center"
      >
        <Image
          src={`https://res.cloudinary.com/dg3gyk0gu/image/fetch/h_600/f_auto/${image}`}
          alt={title}
          width={300}
          quality={100}
          height={300}
        />
      </Link>
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
    </li>
  )
}

export default WorkshopsPage
