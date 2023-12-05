import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import ResetProgress from '@skillrecordings/skill-lesson/video/reset-progress'
import {isBrowser} from '@/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import first from 'lodash/first'
import {LockClosedIcon} from '@heroicons/react/solid'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {Module} from '@skillrecordings/skill-lesson/schemas/module'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import * as process from 'process'
import {trpc} from '../trpc/trpc.client'
import Balancer from 'react-wrap-balancer'
import ModuleCertificate from '@/certificate/module-certificate'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import Testimonials from '@/testimonials'
import pluralize from 'pluralize'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {useRouter} from 'next/router'
import {Skeleton} from '@skillrecordings/ui'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import {cn} from '@skillrecordings/ui/utils/cn'

const WorkshopTemplate: React.FC<{
  workshop: Module
  workshopBodySerialized: MDXRemoteSerializeResult
  product?: SanityProduct
}> = ({workshop, workshopBodySerialized}) => {
  const product = workshop.product
  const {title, ogImage, testimonials, description, slug} = workshop
  const pageTitle = `${title} Workshop`
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({productId: product?.productId})
  const router = useRouter()

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: workshop.slug.current,
        moduleType: workshop.moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()

  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')
  const canView = ability.can('view', 'Content')

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: workshop.slug.current,
    })
  const {data: defaultCouponData, status: defaultCouponStatus} =
    trpc.pricing.defaultCoupon.useQuery()

  return (
    <Layout
      className={cn('mx-auto w-full pt-20 lg:max-w-4xl lg:pb-24', {
        'pt-24 sm:pt-16 lg:pt-24': defaultCouponData,
      })}
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
      <Header
        module={workshop}
        hasPurchased={canView}
        product={product as SanityProduct}
      />
      <main
        data-workshop-template={slug.current}
        className="relative z-10 flex flex-col gap-5 lg:flex-row"
      >
        <div className="px-5">
          {product && (
            <RegionRestrictedBanner
              workshop={workshop}
              productId={product?.productId}
            />
          )}
          <article className="prose prose-lg w-full max-w-none text-white prose-a:text-cyan-300 hover:prose-a:text-cyan-200 lg:max-w-xl">
            <MDX contents={workshopBodySerialized} />
          </article>
          {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
        </div>
        <div className="flex w-full flex-col px-5 pt-8 lg:max-w-xs lg:px-0 lg:pt-0">
          {product && commercePropsStatus === 'loading' ? (
            <div className="mb-8 flex flex-col space-y-2" role="status">
              <div className="sr-only">Loading commerce details</div>
              {new Array(8).fill(null).map((_, i) => (
                <Skeleton key={i} className="h-3 w-full bg-gray-800" />
              ))}
            </div>
          ) : (
            <>
              {!canView && product && (
                <PriceCheckProvider
                  purchasedProductIds={commerceProps?.purchases?.map(
                    (p) => p.id,
                  )}
                >
                  <Pricing
                    canViewRegionRestriction={canViewRegionRestriction}
                    product={product as SanityProduct}
                    allowPurchase={commerceProps?.allowPurchase}
                    cancelUrl={process.env.NEXT_PUBLIC_URL + router.asPath}
                    userId={commerceProps?.userId}
                    options={{
                      withGuaranteeBadge: true,
                      withImage: true,
                    }}
                  />
                </PriceCheckProvider>
              )}
              {canView && product && (
                <div className="mb-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gray-800 p-5 text-lg text-cyan-300">
                  <Icon name="Checkmark" />
                  Purchased
                </div>
              )}
              {workshop && (
                <Collection.Root
                  module={workshop}
                  lockIconRenderer={() => {
                    return (
                      <LockClosedIcon
                        className="relative z-10 flex-shrink-0 translate-y-1 text-gray-400"
                        width={15}
                        height={15}
                        aria-hidden="true"
                      />
                    )
                  }}
                >
                  <div className="flex w-full items-baseline justify-between pb-3">
                    <h3 className="text-2xl font-semibold">Contents</h3>
                    <Collection.Metadata className="font-mono text-sm font-semibold uppercase text-gray-300" />
                  </div>
                  <Collection.Sections>
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Section className="border px-3 py-3 [&>[data-check-icon]]:text-cyan-300 [&>[data-check-icon]]:opacity-100 [&>[data-progress]]:bg-gray-400/5">
                        <Collection.Lessons className="border-x border-b border-border bg-black/20">
                          <Collection.Lesson className="before:pl-8 [&>div>div]:hover:underline [&>div>span]:font-mono [&>div]:pl-2 [&>div]:pr-3" />
                        </Collection.Lessons>
                      </Collection.Section>
                    ) : (
                      <Skeleton className="border bg-background py-6" />
                    )}
                  </Collection.Sections>
                  <Collection.Lessons className="border-x-0 border-b-0">
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Lesson className="before:pl-6 [&>div>div]:hover:underline [&>div>span]:font-mono [&>div]:px-0" />
                    ) : (
                      <Skeleton className="my-2 border bg-background py-5" />
                    )}
                  </Collection.Lessons>
                </Collection.Root>
              )}
            </>
          )}
          <ResetProgress module={workshop} />
          <ModuleCertificate module={workshop} />
        </div>
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const RegionRestrictedBanner: React.FC<{
  workshop: Module
  productId: string
}> = ({workshop, productId}) => {
  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: workshop.slug.current,
        moduleType: workshop.moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {data: purchaseData} = trpc.purchases.getPurchaseByProductId.useQuery({
    productId: productId,
  })
  const {ability} = useAbilities()
  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')
  const countryCode = purchaseData?.purchase?.country
  const regionNames = new Intl.DisplayNames(['en'], {type: 'region'})
  const country = countryCode && regionNames.of(countryCode)

  return canViewRegionRestriction ? (
    <div
      className="mb-5 flex items-start space-x-4 rounded-md bg-white/5 p-5 text-lg"
      role="alert"
    >
      <div className="flex items-center justify-center rounded-full bg-yellow-200/10 p-3">
        <LockClosedIcon className="h-5 w-5 text-yellow-200" />
      </div>
      <div className="flex flex-col space-y-3 pt-2">
        <p className="font-medium">
          Your license is restricted to{' '}
          {country ? (
            <>
              <img
                className="inline-block"
                src={`https://hardcore-golick-433858.netlify.app/image?code=${countryCode}`}
                alt={`${country} flag`}
              />{' '}
              {country}
            </>
          ) : (
            'a specific region'
          )}
          .
        </p>
        <p className="text-gray-200">
          You can upgrade to an unrestricted license to view this workshop
          anywhere.
        </p>
      </div>
    </div>
  ) : null
}

const Header: React.FC<{
  module: Module
  product?: SanityProduct
  hasPurchased: boolean
}> = ({module, product, hasPurchased = false}) => {
  const {title, slug, sections, image, github} = module
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons)

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pb-16 pt-0 sm:pb-8 sm:pt-8 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/workshops"
            className="pb-1 font-mono text-sm font-semibold uppercase tracking-wide text-cyan-300"
          >
            Pro Workshop
          </Link>
          <h1 className="font-text text-4xl font-bold sm:text-5xl lg:text-6xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full">
                  <Image
                    src={require('../../public/matt-pocock.jpeg')}
                    alt="Matt Pocock"
                    width={48}
                    height={48}
                    placeholder="blur"
                  />
                </div>
                <span>Matt Pocock</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              <Link
                href={
                  firstSection && sections
                    ? {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[section]/[lesson]`,
                        query: {
                          module: slug.current,
                          section:
                            isModuleInProgress && nextSection
                              ? nextSection?.slug
                              : firstSection.slug,
                          lesson:
                            isModuleInProgress && nextLesson
                              ? nextLesson?.slug
                              : firstLesson?.slug,
                        },
                      }
                    : {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[lesson]`,
                        query: {
                          module: slug.current,
                          lesson:
                            isModuleInProgress && nextLesson
                              ? nextLesson?.slug
                              : firstLesson?.slug,
                        },
                      }
                }
                className={cx(
                  'flex w-full min-w-[208px] items-center justify-center rounded  px-5 py-4 font-semibold leading-tight transition  md:w-auto',
                  {
                    'animate-pulse': moduleProgressStatus === 'loading',
                    'bg-cyan-400 text-black hover:bg-cyan-300':
                      hasPurchased || !product,
                    'bg-cyan-300/20 text-cyan-300 hover:bg-cyan-300/30':
                      !hasPurchased && product,
                  },
                )}
                onClick={() => {
                  track('clicked start learning', {module: slug.current})
                }}
              >
                {hasPurchased || !product ? (
                  <>{isModuleInProgress ? 'Continue' : 'Start'} Learning</>
                ) : (
                  <>Preview</>
                )}
                <span className="pl-2" aria-hidden="true">
                  →
                </span>
              </Link>
              {github?.repo && (
                <a
                  className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-gray-800 px-5 py-4 font-medium leading-tight transition hover:bg-gray-800 md:w-auto"
                  href={`https://github.com/total-typescript/${github.repo}`}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" size="24" /> Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="flex flex-shrink-0 items-center justify-center lg:-mr-16">
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
      <Image
        fill
        aria-hidden="true"
        alt=""
        src={require('../../public/assets/landing/bg-divider-3.png')}
        className="-z-10 object-contain object-top"
      />
    </>
  )
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description?: string | null
}) => (
  <CourseJsonLd
    courseName={title}
    description={description || process.env.NEXT_PUBLIC_PRODUCT_DESCRIPTION}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)
