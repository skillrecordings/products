import React from 'react'
import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {PortableText} from '@portabletext/react'
import {SanityDocument} from '@sanity/client'
import {IconGithub} from 'components/icons'
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
import {trpc} from 'utils/trpc'
import {find, isArray} from 'lodash'
import {LessonResource} from '@skillrecordings/skill-lesson/schemas/lesson-resource'
import PortableTextComponents from '../video/portable-text'
import {Pricing} from 'path-to-purchase-react/pricing'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {useCoupon} from 'path-to-purchase-react/use-coupon'
import {PriceCheckProvider} from 'path-to-purchase-react/pricing-check-context'
import Spinner from 'components/spinner'

const WorkshopTemplate: React.FC<{
  workshop: SanityDocument
  commerceProps?: CommerceProps
}> = ({workshop, commerceProps}) => {
  const {title, body, ogImage, description, product} = workshop
  const pageTitle = `${title} Workshop`
  const purchasedProductIds =
    commerceProps?.purchases &&
    commerceProps.purchases.map((purchase) => purchase.productId)

  const hasPurchased = Boolean(
    purchasedProductIds && purchasedProductIds.includes(product.productId),
  )

  return (
    <Layout
      className="mx-auto w-full px-5 pt-5 lg:max-w-screen-lg lg:pb-24"
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
        data-workshop={workshop.slug}
        className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start"
      >
        <div className="max-w-xl">
          <article className="prose w-full max-w-none pb-10 text-gray-900 lg:max-w-xl">
            <PortableText value={body} components={PortableTextComponents} />
          </article>
          {workshop && (
            <WorkshopSectionNavigator
              purchased={hasPurchased}
              workshop={workshop}
            />
          )}
        </div>
        {commerceProps ? (
          <BuyWorkshop
            product={product}
            workshop={workshop}
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
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const BuyWorkshop: React.FC<
  CommerceProps & {product: SanityProduct; workshop: SanityDocument}
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
}) => {
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} =
    useCoupon(couponFromCode)
  const couponId =
    couponIdFromCoupon || (validCoupon ? couponFromCode?.id : undefined)
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const hasPurchased =
    purchasedProductIds && purchasedProductIds.includes(product.productId)
  const firstLesson = workshop.sections[0].lessons[0]
  const thumbnail = `https://protailwind.com/api/video-thumb?videoResourceId=${firstLesson?.videoResourceId}`
  // const thumbnail = `${getBaseUrl()}/api/video-thumb?videoResourceId=${firstLesson?.videoResourceId}`

  return (
    <div className="mx-auto w-full max-w-sm overflow-hidden rounded-lg border border-gray-200/40 bg-white shadow-2xl shadow-gray-400/20">
      {!hasPurchased && (
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
          <div className="absolute left-0 bottom-0 flex w-full items-center justify-center bg-gradient-to-t from-black/80 to-transparent pb-3.5 pt-8 text-sm font-medium text-white">
            Preview this workshop
          </div>
        </Link>
      )}
      <div className="p-7">
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
  React.PropsWithChildren<{workshop: SanityDocument; purchased: boolean}>
> = ({workshop, purchased, children}) => {
  const {title, slug, sections, image, github} = workshop

  const firstSection = first<SanityDocument>(sections)
  const firstExercise = first<SanityDocument>(firstSection?.lessons)
  const instructor = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`
  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between gap-10 pb-16 sm:pb-8 md:flex-row">
        <div className="text-center md:text-left">
          <Link
            href="/workshops"
            className="block pb-4 font-mono text-sm font-semibold uppercase tracking-wide text-brand-red"
          >
            Pro Workshop
          </Link>
          <h1 className="font-text font-heading text-3xl font-extrabold sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <div className="pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
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
            </div>
            <div className="flex items-center justify-center gap-3 pt-8 md:justify-start">
              {firstSection && purchased && (
                <Link
                  href={{
                    pathname: '/workshops/[module]/[section]/[lesson]',
                    query: {
                      module: slug.current,
                      section: firstSection.slug,
                      lesson: firstExercise?.slug,
                    },
                  }}
                  className="flex items-center justify-center rounded-full bg-brand-red px-6 py-3 font-semibold text-white shadow-lg transition hover:brightness-110"
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  Start Learning{' '}
                  <span className="pl-2" aria-hidden="true">
                    →
                  </span>
                </Link>
              )}
              {github?.repo && (
                <a
                  className="flex items-center justify-center gap-2 rounded border-2 border-gray-800 px-5 py-3 font-medium transition hover:bg-gray-800"
                  href={`https://github.com/pro-tailwind/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconGithub className="w-6" /> Code
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

const WorkshopSectionNavigator: React.FC<{
  workshop: SanityDocument
  purchased: boolean
}> = ({workshop, purchased}) => {
  const {sections} = workshop

  return (
    <nav
      aria-label="workshop navigator"
      className="w-full px-5 py-8 lg:px-0 lg:py-0"
    >
      {sections > 1 ? (
        <Accordion.Root type="multiple">
          <div className="flex w-full items-center justify-between pb-3">
            <h2 className="text-2xl font-semibold">Contents</h2>
            <h3 className="font-mono text-sm font-semibold uppercase">
              {sections?.length || 0} Sections
            </h3>
          </div>
          <ul className="flex flex-col gap-2">
            {sections.map((section: SanityDocument, i: number) => {
              return (
                <li key={section.slug}>
                  <Accordion.Item value={section.slug}>
                    <Accordion.Header className="relative z-10 rounded-lg">
                      <Accordion.Trigger className="group flex w-full items-center justify-between rounded-lg border bg-white py-2 px-3 text-lg font-medium shadow-lg transition ">
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
                        moduleSlug={workshop.slug.current}
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
            Workshop content
          </h3>
          <div className="flex gap-1 pb-2 text-sm">
            <span>{sections[0].lessons.length} lessons</span> {'・'}
            <span>
              {
                sections[0].lessons.filter((l: any) => l._type === 'exercise')
                  .length
              }{' '}
              exercises
            </span>
          </div>
          <ul className="rounded-lg border border-gray-100 bg-white py-3 pl-3.5 pr-3 shadow-xl shadow-gray-300/20">
            {sections[0].lessons.map((exercise: LessonResource, i: number) => {
              const section = sections[0]
              const moduleSlug = workshop.slug.current
              return (
                <LessonListItem
                  key={exercise.slug}
                  lessonResource={exercise}
                  section={section}
                  moduleSlug={moduleSlug}
                  index={i}
                  purchased={purchased}
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
  moduleSlug,
  index,
  purchased,
}: {
  lessonResource: LessonResource
  section: SanityDocument
  moduleSlug: string
  index: number
  purchased?: boolean
}) => {
  const {data: solution} = trpc.solutions.getSolution.useQuery({
    exerciseSlug: lessonResource.slug,
  })
  const {data: userProgress} = trpc.progress.get.useQuery()

  const isExerciseCompleted =
    isArray(userProgress) && lessonResource._type === 'exercise'
      ? find(userProgress, ({lessonSlug}) => lessonSlug === solution?.slug)
      : find(userProgress, ({lessonSlug}) => lessonSlug === lessonResource.slug)

  return (
    <li key={lessonResource.slug}>
      <Link
        href={{
          pathname: '/workshops/[module]/[section]/[lesson]',
          query: {
            section: section.slug,
            lesson: lessonResource.slug,
            module: moduleSlug,
          },
        }}
        passHref
        className="group inline-flex items-center py-2.5 text-base font-medium"
        onClick={() => {
          track('clicked workshop exercise', {
            module: moduleSlug,
            lesson: lessonResource.slug,
            section: section.slug,
            moduleType: section._type,
            lessonType: lessonResource._type,
          })
        }}
      >
        {purchased || index === 0 ? (
          <>
            {isExerciseCompleted ? (
              <CheckIcon
                className="mr-2 h-5 w-5 text-emerald-500"
                aria-hidden="true"
              />
            ) : (
              <span
                className="w-7 font-mono text-xs text-gray-400"
                aria-hidden="true"
              >
                {index + 1}
              </span>
            )}
          </>
        ) : (
          <LockClosedIcon
            className="mr-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        )}
        <span className="w-full cursor-pointer leading-tight group-hover:underline">
          {lessonResource.title}
        </span>
      </Link>
    </li>
  )
}

const WorkshopSectionExerciseNavigator: React.FC<{
  section: SanityDocument
  moduleSlug: string
}> = ({section, moduleSlug}) => {
  const {lessons} = section

  return lessons ? (
    <ul className="-mt-5 rounded-b-lg border pl-3.5 pr-3 pt-7 pb-3">
      {lessons.map((exercise: LessonResource, i: number) => {
        return (
          <LessonListItem
            key={exercise.slug}
            lessonResource={exercise}
            section={section}
            moduleSlug={moduleSlug}
            index={i}
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
