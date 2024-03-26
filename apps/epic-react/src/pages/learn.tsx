import * as React from 'react'
import {GetServerSideProps} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'

import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {
  getWorkshopsForProduct,
  WorkshopSchema,
  type Workshop,
} from '@/lib/workshops'
import {BonusSchema, getBonusesForProduct, type Bonus} from '@/lib/bonuses'
import {getOgImage} from '@/utils/get-og-image'
import Layout from '@/components/app/layout'
import Footer from '@/components/app/footer'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  // TODO: load the user's purchases and figure out what product they should have access to
  const productId = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'
  const workshops = await getWorkshopsForProduct({productId})
  const bonuses = await getBonusesForProduct({productId})

  return {
    props: {workshops, bonuses},
  }
}

const ResourceLink: React.FC<{
  title: string
  workshopSlug: string
  resourceSlug: string
  isCompleted: boolean
}> = ({title, workshopSlug, resourceSlug, isCompleted}) => {
  const [isHovered, setHovered] = React.useState<Boolean>(false)
  return (
    <li>
      <Link
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        href={`/workshops/${workshopSlug}/${resourceSlug}`}
        className="-mx-3 flex w-full items-center rounded-lg p-3 transition-colors duration-75 ease-in-out hover:bg-er-gray-100"
      >
        {/* {isCompleted && '✅'}
        {title} */}
        <div
          className={`${
            isCompleted ? 'bg-green-500' : 'bg-blue-500'
          } flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-er-gray-100 text-white`}
        >
          {isCompleted ? (
            isHovered ? (
              /* prettier-ignore */
              <svg width="12" height="12" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M2.7703788,0.495243511 L8.34575007,4.07941076 C8.5780351,4.22873685 8.6452866,4.53809377 8.49596052,4.7703788 C8.45722752,4.83063012 8.4060014,4.88185624 8.34575007,4.92058924 L2.7703788,8.50475649 C2.53809377,8.65408257 2.22873685,8.58683107 2.07941076,8.35454605 C2.02756519,8.27389738 2,8.18004306 2,8.08416725 L2,0.915832749 C2,0.639690374 2.22385763,0.415832749 2.5,0.415832749 C2.59587581,0.415832749 2.68973013,0.443397939 2.7703788,0.495243511 Z"/></svg>
            ) : (
              /* prettier-ignore */
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8"><path fill="currentColor" d="M9.61758474,0.604546834 C9.98992108,0.232322926 10.5742099,0.201304267 10.9818717,0.511490857 L11.088381,0.604546834 L11.181454,0.711073215 C11.460673,1.07802033 11.4634675,1.58799129 11.1898583,1.95777394 L11.088418,2.07545417 L5.54082318,7.62304901 C5.16848685,7.99527292 4.58419802,8.02629158 4.17650775,7.71607647 L4.06998989,7.62301199 L1.29198741,4.84493546 C0.897792985,4.43679585 0.90343052,3.78803751 1.30465812,3.38680991 C1.67245009,3.01901794 2.24823664,2.98363151 2.65932864,3.28717119 L2.76708129,3.37836276 L4.80527808,5.41663154 L9.61758474,0.604546834 Z"/></svg>
            )
          ) : (
            /* prettier-ignore */
            <svg width="12" height="12" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" d="M2.7703788,0.495243511 L8.34575007,4.07941076 C8.5780351,4.22873685 8.6452866,4.53809377 8.49596052,4.7703788 C8.45722752,4.83063012 8.4060014,4.88185624 8.34575007,4.92058924 L2.7703788,8.50475649 C2.53809377,8.65408257 2.22873685,8.58683107 2.07941076,8.35454605 C2.02756519,8.27389738 2,8.18004306 2,8.08416725 L2,0.915832749 C2,0.639690374 2.22385763,0.415832749 2.5,0.415832749 C2.59587581,0.415832749 2.68973013,0.443397939 2.7703788,0.495243511 Z"/></svg>
          )}
        </div>
        <h4 className="ml-3 flex w-full flex-wrap items-center text-base leading-tight sm:text-xl sm:font-medium">
          {workshopSlug === 'welcome-to-epic-react' &&
            resourceSlug === 'welcome-to-epic-react' && (
              <span className="my-1 mr-2 flex items-center rounded-full bg-yellow-300 px-2 py-1 text-xs font-semibold uppercase leading-none text-yellow-800">
                Start here
              </span>
            )}
          {title}
        </h4>
      </Link>
    </li>
  )
}

const isResourceCompleted = (
  resourceId: string,
  resourceType: 'lesson' | 'section',
  arr: {
    id: string
    lessonCompleted?: boolean
    sectionCompleted?: boolean
  }[],
) => {
  const result = arr.find((item) => item.id === resourceId)
  return result
    ? resourceType === 'lesson'
      ? result.lessonCompleted
      : result.sectionCompleted
    : false
}

const WorkshopItem = ({
  workshop,
  bonus,
}: {
  workshop?: Workshop
  bonus?: Bonus
}) => {
  const computedResource = workshop || bonus
  const moduleProgress = useModuleProgress()
  return (
    <div
      className={twMerge(
        cx(
          "relative w-full before:absolute before:left-4 before:top-0 before:z-[-1] before:h-[calc(100%+8rem)] before:w-px before:bg-er-gray-300 before:content-[''] sm:before:bg-er-gray-200",
          {'before:top-[-3rem]': Boolean(bonus)},
        ),
      )}
    >
      {computedResource && (
        <>
          <div className="pl-0 sm:pl-11">
            <h3 className="mb-2 text-2xl font-semibold sm:text-3xl">
              <Link
                href={`/workshops/${computedResource.slug.current}/${computedResource.resources[0].slug}`}
              >
                {computedResource.title}
              </Link>
            </h3>
            <div className="text-base text-er-gray-700 sm:text-lg">
              {computedResource.body}
            </div>
          </div>
          <ul className="mt-6 w-full">
            {computedResource.resources.map((resource) => {
              if (
                resource._type === 'explainer' ||
                resource._type === 'interview'
              ) {
                const isCompleted = Boolean(
                  moduleProgress &&
                    isResourceCompleted(
                      resource._id,
                      'lesson',
                      moduleProgress?.lessons,
                    ),
                )
                return (
                  <ResourceLink
                    key={resource._id}
                    title={resource.title}
                    workshopSlug={computedResource.slug.current}
                    resourceSlug={resource.slug}
                    isCompleted={isCompleted}
                  />
                )
              }

              if (resource._type === 'section' && resource?.resources) {
                const isCompleted = Boolean(
                  moduleProgress &&
                    isResourceCompleted(
                      resource._id,
                      'section',
                      moduleProgress?.sections,
                    ),
                )
                return (
                  <ResourceLink
                    key={resource._id}
                    title={resource.title}
                    workshopSlug={computedResource.slug.current}
                    resourceSlug={resource.resources[0].slug}
                    isCompleted={isCompleted}
                  />
                )
              }
            })}
          </ul>
        </>
      )}
    </div>
  )
}

const Learn: React.FC<{workshops: any[]; bonuses: any[]}> = ({
  workshops: unparsedWorkshops,
  bonuses: unparsedBonuses,
}) => {
  const title = 'Learn'

  const workshops = WorkshopSchema.array().parse(unparsedWorkshops)
  const bonuses = BonusSchema.array().parse(unparsedBonuses)

  return (
    <Layout
      meta={{
        title,
        openGraph: {
          images: [getOgImage({title})],
        },
      }}
    >
      <section>
        <Image
          src="/assets/flying-rocket-xl@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:xl:block"
          priority
        />
        <Image
          src="/assets/flying-rocket-light-xl@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full xl:block dark:xl:hidden"
          priority
        />
        <Image
          src="/assets/flying-rocket@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:md:block dark:xl:hidden"
          priority
        />
        <Image
          src="/assets/flying-rocket-light@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full md:block dark:md:hidden xl:hidden"
          priority
        />
        <Image
          src="/assets/flying-rocket-sm@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="hidden w-full dark:block dark:md:hidden"
          priority
        />
        <Image
          src="/assets/flying-rocket-light-sm@2x.webp"
          alt=""
          width={1600}
          height={273}
          className="block w-full dark:hidden md:hidden"
          priority
        />
      </section>
      <main className="mx-auto w-full max-w-screen-lg px-4 pb-20 pt-4 sm:px-8 sm:pt-20">
        <ul className="grid grid-cols-1 gap-4 sm:gap-16">
          {workshops.map((workshop) => {
            return (
              <ModuleProgressProvider
                moduleSlug={workshop.slug.current}
                key={workshop._id}
              >
                <li className="flex flex-col items-center rounded-lg bg-er-gray-100 p-8 sm:flex-row sm:items-start sm:bg-transparent sm:p-0">
                  <div className="mb-4 mr-0 w-full max-w-xs p-8 sm:mb-0 sm:mr-8">
                    <Image
                      src={workshop.image}
                      alt=""
                      width={256}
                      height={256}
                    />
                  </div>
                  <WorkshopItem workshop={workshop} />
                </li>
              </ModuleProgressProvider>
            )
          })}
          {bonuses.map((bonus) => {
            return (
              <ModuleProgressProvider
                moduleSlug={bonus.slug.current}
                key={bonus._id}
              >
                <li className="flex flex-col items-center rounded-lg bg-er-gray-100 p-8 sm:flex-row sm:items-start sm:bg-transparent sm:p-0">
                  <div className="mb-4 mr-0 w-full max-w-xs p-8 sm:mb-0 sm:mr-8">
                    <Image src={bonus.image} alt="" width={200} height={200} />
                  </div>
                  <WorkshopItem bonus={bonus} />
                </li>
              </ModuleProgressProvider>
            )
          })}
        </ul>
      </main>
      <Footer />
    </Layout>
  )
}

export default Learn
