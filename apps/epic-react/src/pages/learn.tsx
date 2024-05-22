import * as React from 'react'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import {twMerge} from 'tailwind-merge'
import * as Dialog from '@radix-ui/react-dialog'

import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getWorkshopsForProduct, Workshop, WorkshopSchema} from '@/lib/workshops'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {getAllProducts} from '@/lib/products'
import {Bonus, BonusSchema, getBonusesForProduct} from '@/lib/bonuses'
import {getOgImage} from '@/utils/get-og-image'
import Layout from '@/components/app/layout'
import Footer from '@/components/app/footer'
import WelcomeBanner from '@/components/welcome-banner'
import CertificateForm from '@/certificate/certificate-form'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  // TODO: load the user's purchases and figure out what product they should have access to
  const token = await getToken({req})
  const products = await getAllProducts()
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })
  const productId = 'kcd_2b4f4080-4ff1-45e7-b825-7d0fff266e38'
  const workshops = await getWorkshopsForProduct({productId})
  const bonuses = await getBonusesForProduct({productId})

  return {
    props: {
      workshops,
      bonuses,
      commerceProps,
    },
  }
}

const ResourceLink: React.FC<{
  title: string
  workshopSlug: string
  resourceSlug: string
  isCompleted: boolean
  isBonusModule?: boolean
}> = ({title, workshopSlug, resourceSlug, isCompleted, isBonusModule}) => {
  const [isHovered, setHovered] = React.useState<Boolean>(false)
  return (
    <li>
      <Link
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        href={`/modules/${workshopSlug}/${resourceSlug}`}
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

type WorkshopResource = Workshop['resources'][0]
type BonusResource = Bonus['resources'][0]

type Module = {
  _id: string
  _type: string
  title: string
  moduleType: string
  body: string | null
  slug: {
    current: string
  }
  github?: {
    repo: string
  } | null
  resources: Array<WorkshopResource | BonusResource>
}

const WorkshopItem = ({
  module,
  isMounted,
}: {
  module: Module
  isMounted?: boolean
}) => {
  const isBonusModule = module.moduleType === 'bonus'

  const moduleProgress = useModuleProgress()
  return (
    <div
      className={twMerge(
        cx(
          "relative w-full before:absolute before:left-4 before:top-0 before:z-[-1] before:h-[calc(100%+8rem)] before:w-px before:bg-er-gray-300 before:content-[''] sm:before:bg-er-gray-200",
          {'before:top-[-3rem]': isBonusModule},
        ),
      )}
    >
      <div className="pl-0 sm:pl-11">
        <h3 className="mb-2 text-2xl font-semibold sm:text-3xl">
          <Link
            href={`/modules/${module.slug.current}/${module.resources[0]?.slug}`}
          >
            {module.title}
          </Link>
        </h3>
        <div className="text-base text-er-gray-700 sm:text-lg">
          {module.body}
        </div>
        {module.github?.repo && (
          <div className="mt-6 flex">
            <Link
              href={module.github.repo}
              className="focus:shadow-outline-blue active:bg-er-gray-50 inline-flex items-center rounded-lg border border-er-gray-300 bg-er-gray-100 px-3 py-2 text-sm font-semibold leading-4 text-er-gray-700 duration-150 hover:bg-er-gray-200 focus:border-blue-300 focus:outline-none active:text-er-gray-800"
            >
              <svg className="mr-1" width="20" height="20" viewBox="0 0 24 24">
                <g fill="currentColor">
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"></path>
                </g>
              </svg>
              Repository
            </Link>
          </div>
        )}
      </div>
      <ul className="mt-6 w-full">
        {module.resources.map((resource) => {
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
                workshopSlug={module.slug.current}
                resourceSlug={resource.slug}
                isCompleted={isCompleted}
                isBonusModule={isBonusModule}
              />
            )
          }

          if (resource._type === 'section' && resource?.lessons) {
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
                workshopSlug={module.slug.current}
                resourceSlug={resource.lessons[0].slug}
                isCompleted={isCompleted}
              />
            )
          }
        })}
      </ul>
      {isMounted && moduleProgress?.moduleCompleted && (
        <div className="relative mt-8 bg-background">
          <Dialog.Root>
            <Dialog.Trigger
              className={cx(
                'flex items-center rounded-lg border-2 border-emerald-600 px-4 py-3 text-base font-semibold text-text transition-colors duration-100 ease-in-out hover:bg-indigo-300 hover:bg-opacity-25',
              )}
            >
              {/* prettier-ignore */}
              <svg className="mr-2 text-text" width="18" height="18" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><g fill="none" ><path fillRule="evenodd" clipRule="evenodd" d="M3 17a1 1 0 0 1 1-1h12a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1zm3.293-7.707a1 1 0 0 1 1.414 0L9 10.586V3a1 1 0 1 1 2 0v7.586l1.293-1.293a1 1 0 1 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z" fill="currentColor"/></g></svg>
              Workshop Certificate
            </Dialog.Trigger>
            <CertificateForm module={module} />
          </Dialog.Root>
        </div>
      )}
    </div>
  )
}

const Learn: React.FC<{
  workshops: any[]
  bonuses: any[]
  commerceProps: CommerceProps
}> = ({
  workshops: unparsedWorkshops,
  bonuses: unparsedBonuses,
  commerceProps,
}) => {
  const [isMounted, setIsMounted] = React.useState(false)
  const title = 'Learn'

  const workshops = WorkshopSchema.array().parse(unparsedWorkshops)
  const bonuses = BonusSchema.array().parse(unparsedBonuses)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

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
      {isMounted && commerceProps?.purchases && (
        <WelcomeBanner purchases={commerceProps.purchases} />
      )}
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
                  <WorkshopItem module={workshop} isMounted={isMounted} />
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
                  <WorkshopItem module={bonus} />
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
