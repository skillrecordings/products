import React from 'react'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import cx from 'classnames'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import first from 'lodash/first'
import * as Accordion from '@radix-ui/react-accordion'
import {
  CheckIcon,
  ChevronDownIcon,
  LockClosedIcon,
  PlayIcon,
} from '@heroicons/react/solid'
import {trpc} from 'trpc/trpc.client'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {portableTextComponents} from '@skillrecordings/skill-lesson/portable-text'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import Spinner from 'components/spinner'
import {BadgeCheckIcon} from '@heroicons/react/outline'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import {getBaseUrl} from '@skillrecordings/skill-lesson/utils/get-base-url'
import {capitalize} from 'lodash'

const WorkshopTemplate: React.FC<{
  workshop: Module & {
    description: string
    ogImage: string
    sections: Section[]
    product: SanityProduct
  }
  commerceProps?: CommerceProps
}> = ({workshop, commerceProps}) => {
  const {title, body, ogImage, description, product} = workshop
  const pageTitle = `${title} Workshop`
  const purchasedProductIds =
    commerceProps?.purchases &&
    commerceProps.purchases.map((purchase) => purchase.productId)

  const hasPurchased = Boolean(
    product &&
      purchasedProductIds &&
      purchasedProductIds.includes(product.productId),
  )

  return (
    <Layout
      className="mx-auto w-full px-5 pt-10 lg:max-w-screen-lg lg:pb-24"
      meta={{
        title: pageTitle,
        description,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      <Header workshop={workshop} purchased={hasPurchased} />
      <main
        data-workshop={workshop.slug.current}
        className={cx(
          'relative z-10 flex flex-col lg:flex-row lg:items-start lg:gap-8',
          {
            'flex-col-reverse': !hasPurchased,
          },
        )}
      >
        <div className="pt-10 lg:max-w-xl lg:pt-0">
          <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl">
            <PortableText
              value={body}
              components={portableTextComponents({
                loadingIndicator: <Spinner />,
              })}
            />
          </article>
          {workshop && !hasPurchased && (
            <WorkshopSectionNavigator
              purchased={hasPurchased}
              workshop={workshop}
            />
          )}
        </div>

        {hasPurchased ? (
          <>
            {workshop && (
              <div className="lg:max-w-sm">
                <WorkshopSectionNavigator
                  purchased={hasPurchased}
                  workshop={workshop}
                />
              </div>
            )}
          </>
        ) : (
          <>
            {commerceProps && product ? (
              <BuyWorkshop
                product={product}
                workshop={workshop}
                purchasedProductIds={purchasedProductIds}
                hasPurchased={hasPurchased}
                {...commerceProps}
              />
            ) : (
              <div
                role="status"
                className="mx-auto flex w-full max-w-sm flex-col overflow-hidden rounded-lg border border-gray-200/40 bg-white shadow-2xl shadow-gray-400/20"
              >
                <div className="flex aspect-video animate-pulse items-center justify-center bg-gray-200">
                  <Spinner aria-hidden="true" className="h-7 w-7 opacity-80" />
                </div>
                <div className="flex animate-pulse flex-col gap-3 p-7">
                  <div className="h-3 w-2/3 rounded-full bg-gray-200"></div>
                  <div className="h-3 rounded-full bg-gray-200"></div>
                  <div className="h-3 w-1/2 rounded-full bg-gray-200"></div>
                  <div className="h-3 w-5/6 rounded-full bg-gray-200"></div>
                  <div className="h-3 w-2/5 rounded-full bg-gray-200"></div>
                  <div className="h-3 w-1/3 rounded-full bg-gray-200"></div>
                  <span className="sr-only">Loading price</span>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const BuyWorkshop: React.FC<
  CommerceProps & {
    product: SanityProduct
    workshop: Module & {
      sections: Section[]
    }
    purchasedProductIds: string[] | undefined
    hasPurchased: boolean
  }
> = ({
  product,
  workshop,
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
  allowPurchase,
  purchasedProductIds,
  hasPurchased,
}) => {
  const {validCoupon} = useCoupon(couponFromCode)
  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)
  const firstSection = workshop.sections[0]
  const firstLesson = firstSection.lessons && firstSection?.lessons[0]

  const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${
    firstLesson?.videoResourceId
  }`

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-gray-200/40 bg-white shadow-2xl shadow-gray-400/20">
      {!hasPurchased && firstLesson && (
        <Link
          href={{
            pathname: '/workshops/[module]/[section]/[lesson]',
            query: {
              section: workshop.sections[0].slug,
              lesson: firstLesson.slug,
              module: workshop.slug.current,
            },
          }}
          className="group relative flex aspect-video h-full w-full items-center justify-center bg-black"
        >
          <Image
            src={thumbnail}
            layout="fill"
            alt=""
            aria-hidden="true"
            objectFit="cover"
            className="opacity-80"
          />
          <PlayIcon
            className="absolute h-10 w-10 text-white transition group-hover:scale-105"
            aria-hidden="true"
          />
          <div className="absolute bottom-0 left-0 flex w-full items-center justify-center bg-gradient-to-t from-black/80 to-transparent pb-3.5 pt-8 text-sm font-medium text-white">
            Preview this workshop
          </div>
        </Link>
      )}
      <div className="p-5 sm:p-7">
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <Pricing
            userId={userId}
            product={product}
            purchased={hasPurchased}
            purchases={purchases}
            couponId={couponId}
            allowPurchase={allowPurchase}
          />
        </PriceCheckProvider>
      </div>
    </div>
  )
}

const Header: React.FC<
  React.PropsWithChildren<{workshop: Module; purchased: boolean}>
> = ({workshop, purchased, children}) => {
  const {title, slug, sections, image, github} = workshop

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons)
  const instructor = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`

  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: workshop.slug.current,
  })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const completedLessonCount = moduleProgress?.completedLessonCount || 0
  const nextLesson = moduleProgress?.nextLesson
  const nextSection = moduleProgress?.nextSection

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between gap-16 sm:pb-8 md:flex-row lg:pb-16">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-5 pb-4">
            <Link
              href="/workshops"
              className="block font-mono text-sm font-semibold uppercase tracking-wide text-brand-red"
            >
              Pro Workshop
            </Link>
          </div>
          <h1 className="font-text font-heading text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-10 text-base md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/assets/simon-vrachliotis.png')}
                    alt={instructor}
                    width={48}
                    height={48}
                  />
                </div>
                <span>{instructor}</span>
              </div>
              {purchased ? (
                <div className="flex items-center gap-1">
                  <BadgeCheckIcon
                    aria-hidden="true"
                    className="h-7 w-7 text-gray-600"
                  />{' '}
                  Purchased
                </div>
              ) : null}
            </div>
            <div className="mt-8 flex min-h-[3.25rem] items-center justify-center gap-3 md:justify-start">
              {firstSection && purchased && (
                <Link
                  href={{
                    pathname: '/workshops/[module]/[section]/[lesson]',
                    query: {
                      module: slug.current,
                      section: isModuleInProgress
                        ? nextSection?.slug
                        : firstSection.slug,
                      lesson: isModuleInProgress
                        ? nextLesson?.slug
                        : firstLesson?.slug,
                    },
                  }}
                  className="flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  {isModuleInProgress ? 'Continue' : 'Start'} Learning{' '}
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {github?.repo && purchased && (
                <a
                  className="flex items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  href={`https://github.com/pro-tailwind/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" size="20" /> Code
                </a>
              )}
            </div>
          </div>
          {children}
        </div>
        {image && (
          <div className="flex items-center justify-center">
            <Image
              src={image}
              alt={title}
              width={400}
              height={400}
              quality={100}
            />
          </div>
        )}
      </header>
    </>
  )
}

export const WorkshopSectionNavigator: React.FC<{
  workshop: Module & {sections: Section[]}
  className?: string
  purchased: boolean
  path?: string
}> = ({workshop, purchased, className, path = 'workshops'}) => {
  const {sections} = workshop

  if (!sections) return null

  return (
    <nav aria-label="workshop navigator" className="w-full py-8 lg:py-0">
      {sections.length > 1 ? (
        <Accordion.Root type="multiple">
          <div className="flex w-full items-center justify-between pb-3">
            <h2 className="text-2xl font-semibold">Contents</h2>
            <h3 className="font-mono text-sm font-semibold uppercase">
              {sections?.length || 0} Sections
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {sections.map((section, i: number) => {
              return (
                <li key={section.slug}>
                  <Accordion.Item value={section.slug}>
                    <Accordion.Header className="relative z-10 rounded-lg">
                      <Accordion.Trigger className="group flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-lg font-medium shadow-lg transition ">
                        {section.title}
                        <div className="flex items-center">
                          <ChevronDownIcon
                            className="relative h-3 w-3 transition group-hover:opacity-100 group-radix-state-open:rotate-180"
                            aria-hidden="true"
                          />
                        </div>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content>
                      <WorkshopSectionExerciseNavigator
                        section={section}
                        workshop={workshop}
                        path={path}
                      />
                    </Accordion.Content>
                  </Accordion.Item>
                </li>
              )
            })}
          </ul>
        </Accordion.Root>
      ) : sections ? (
        <div>
          <h3 className="pb-4 font-heading text-2xl font-black">
            {capitalize(workshop.moduleType)} content
          </h3>
          <div className="flex gap-1 pb-2 text-sm">
            <span>{sections[0]?.lessons?.length} lessons</span> {'・'}
            <span>
              {
                sections[0]?.lessons?.filter((l: any) => l._type === 'exercise')
                  .length
              }{' '}
              exercises
            </span>
          </div>
          <ul className="rounded-lg border border-gray-100 bg-white py-3 pl-3.5 pr-5 shadow-xl shadow-gray-300/20">
            {sections[0]?.lessons?.map((exercise: Lesson, i: number) => {
              const section = sections[0]
              const moduleSlug = workshop.slug.current
              return (
                <LessonListItem
                  key={exercise.slug}
                  lessonResource={exercise}
                  section={section}
                  workshop={workshop}
                  index={i}
                  purchased={purchased}
                  path={path}
                />
              )
            })}
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="pb-1 font-heading text-lg font-bold">
            No lessons yet!
          </h3>
          <ul className="rounded-lg border border-gray-100 bg-white py-3 pl-3.5 pr-3 shadow-xl shadow-gray-300/20">
            <li className="text-gray-500">...</li>
          </ul>
        </div>
      )}
    </nav>
  )
}

const LessonListItem = ({
  lessonResource,
  section,
  index,
  purchased,
  workshop,
  path,
}: {
  lessonResource: Lesson
  section: Section
  index: number
  purchased?: boolean
  workshop: Module
  path?: string
}) => {
  const {data: moduleProgress} = trpc.moduleProgress.bySlug.useQuery({
    slug: workshop.slug.current,
  })

  const completedLessons = moduleProgress?.lessons.filter(
    (l) => l.lessonCompleted,
  )
  const nextLesson = moduleProgress?.nextLesson
  const completedLessonCount = moduleProgress?.completedLessonCount || 0

  const isExerciseCompleted = completedLessons?.find(
    ({id}) => id === lessonResource._id,
  )

  return (
    <li key={lessonResource.slug}>
      <Link
        href={{
          pathname: `/[path]/[module]/[section]/[lesson]`,
          query: {
            path,
            section: section.slug,
            lesson: lessonResource.slug,
            module: workshop.slug.current,
          },
        }}
        passHref
        className="group relative inline-flex items-baseline py-2.5 pl-7 text-base font-medium"
        onClick={() => {
          track('clicked workshop exercise', {
            module: workshop.slug.current,
            lesson: lessonResource.slug,
            section: section.slug,
            moduleType: section._type,
            lessonType: lessonResource._type,
          })
        }}
      >
        <div className="absolute left-0 translate-y-1">
          {purchased || index === 0 ? (
            <>
              {isExerciseCompleted ? (
                <CheckIcon
                  className="h-5 w-5 text-emerald-500"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="absolute w-5 font-mono text-xs text-gray-400"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              )}
            </>
          ) : (
            <LockClosedIcon
              className="h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
          )}
        </div>
        <span className="w-full cursor-pointer group-hover:underline">
          {lessonResource.title}
        </span>
      </Link>
    </li>
  )
}

const WorkshopSectionExerciseNavigator: React.FC<{
  section: Section
  workshop: Module
  path?: string
}> = ({section, workshop, path}) => {
  const {lessons} = section

  return lessons ? (
    <ul className="-mt-5 rounded-b-lg border pb-3 pl-3.5 pr-3 pt-7">
      {lessons.map((exercise: Lesson, i: number) => {
        return (
          <LessonListItem
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            workshop={workshop}
            index={i}
            path={path}
          />
        )
      })}
    </ul>
  ) : null
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description: string
}) => (
  <CourseJsonLd
    courseName={title}
    description={description}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)
