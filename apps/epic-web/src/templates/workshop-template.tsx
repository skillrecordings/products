import React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from 'utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from 'trpc/trpc.client'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {capitalize, first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Skeleton} from '@skillrecordings/ui'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import ModuleCertificate from 'certificate/module-certificate'
import ResetProgress from '@skillrecordings/skill-lesson/video/reset-progress'
import {CogIcon} from '@heroicons/react/outline'
import * as Dialog from '@radix-ui/react-dialog'
import CertificateForm from 'certificate/certificate-form'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {cn} from '@skillrecordings/ui/utils/cn'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {useRouter} from 'next/router'

const WorkshopTemplate: React.FC<{
  workshop: Module
  workshopBodySerialized: MDXRemoteSerializeResult
}> = ({workshop, workshopBodySerialized}) => {
  const {title, ogImage, description, testimonials} = workshop
  const pageTitle = `${title} ${capitalize(workshop.moduleType)}`
  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: workshop.slug.current,
        moduleType: workshop.moduleType,
      })
    return {
      ability: createAppAbility(abilityRules || []),
      status: abilityRulesStatus,
    }
  }
  const {ability, status: abilityRulesStatus} = useAbilities()
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: workshop.slug.current,
    })

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({})

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )
  const product = workshop?.product as SanityProduct

  const canView = ability.can('view', 'Content')
  const router = useRouter()
  const upgradableTo = product.upgradableTo
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)
  const purchases = commerceProps?.purchases || []
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'
  const hasPurchasedUpgrade =
    upgradableTo && purchasedProductIds.includes(upgradableTo.productId)

  return (
    <Layout
      className="mx-auto w-full max-w-screen-lg pt-10 sm:pt-24 lg:pb-24"
      meta={{
        title: pageTitle,
        description,
        ogImage: {
          url: ogImage,
          alt: pageTitle,
        },
      }}
    >
      {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
      <CourseMeta title={pageTitle} description={description} />
      {workshop.state === 'draft' && (
        <div className="sm:px-3">
          <div className="mt-2 flex w-full items-center justify-center gap-2 bg-orange-500/10 px-5 py-3 text-sm leading-tight text-amber-600 dark:bg-orange-400/10 dark:text-orange-300 sm:mt-0 sm:rounded sm:text-base">
            <CogIcon className="h-4 w-4" /> {capitalize(workshop.moduleType)}{' '}
            under development — you're viewing a draft version.
          </div>
        </div>
      )}
      <Header module={workshop} canView={canView} />
      <main className="z-10 flex flex-col gap-5 lg:flex-row">
        <div className="w-full flex-grow px-5">
          <article className="prose prose-lg w-full max-w-none dark:prose-invert lg:max-w-xl">
            {workshopBodySerialized ? (
              <MDX
                contents={workshopBodySerialized}
                components={{
                  Testimonial: ({children, author}) => {
                    return (
                      <blockquote className="rounded-md bg-white px-5 pb-4 pt-1 not-italic text-foreground dark:bg-white/5">
                        {children}
                        {author.name && (
                          <div className="text-base opacity-60">
                            — {author.name}
                          </div>
                        )}
                      </blockquote>
                    )
                  },
                }}
              />
            ) : (
              <p className="opacity-75">No description found.</p>
            )}
          </article>
          {testimonials && testimonials?.length > 0 && (
            <Testimonials testimonials={testimonials} />
          )}
        </div>
        <aside
          className="right-0 top-28 w-full px-5 lg:absolute lg:h-full lg:max-w-sm lg:px-0"
          data-workshop=""
        >
          {abilityRulesStatus === 'loading' ? (
            <>
              <Skeleton className="absolute left-0 top-0 flex h-full w-full flex-col items-center gap-5 rounded-lg border bg-card p-8">
                <Skeleton className="flex aspect-square w-full max-w-[240px] rounded-md border bg-foreground/5 delay-75" />
                <Skeleton className="mt-6 flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                <Skeleton className="flex h-16 w-full rounded-md border bg-foreground/5 delay-75" />
              </Skeleton>
            </>
          ) : (
            <>
              {product &&
                ALLOW_PURCHASE &&
                upgradableTo &&
                !hasPurchasedUpgrade && (
                  <>
                    <h3 className="text-xl font-bold">Bundle & Save</h3>
                    <Link
                      target="_blank"
                      href={`/products/${upgradableTo.slug}`}
                      className="group relative mb-8 mt-3 flex w-full rounded-lg border bg-card p-5 shadow-2xl shadow-gray-500/10 transition hover:brightness-95 dark:hover:brightness-125"
                    >
                      <div className="absolute -top-3 right-4 flex h-6 items-center rounded bg-amber-300 px-2 text-xs font-bold uppercase text-black">
                        Best Value
                      </div>
                      <div className="flex items-center gap-5">
                        {upgradableTo.image && (
                          <Image
                            src={upgradableTo.image.url}
                            alt=""
                            aria-hidden="true"
                            className="rounded-full"
                            width={100}
                            height={100}
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold">
                            {upgradableTo.title}
                          </h4>
                          <p>
                            Includes{' '}
                            {
                              upgradableTo.modules.filter(
                                ({moduleType}: {moduleType: string}) =>
                                  moduleType === 'workshop',
                              ).length
                            }{' '}
                            workshops.
                          </p>
                          {/* <span className="group-hover:underline">View more</span> */}
                        </div>
                      </div>
                    </Link>
                  </>
                )}
              {product && ALLOW_PURCHASE && !canView ? (
                <>
                  <h3 className="mb-3 text-xl font-bold">
                    Individual Workshop
                  </h3>
                  <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
                    <WorkshopPricingWidget product={product} />
                  </PriceCheckProvider>
                </>
              ) : (
                <>
                  {workshop.image && (
                    <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0">
                      <Image
                        priority
                        src={workshop.image}
                        alt={title}
                        width={320}
                        height={320}
                        quality={100}
                      />
                    </div>
                  )}
                </>
              )}

              {workshop && (
                <Collection.Root module={workshop}>
                  <div className="flex w-full items-center justify-between pb-3">
                    <h3 className="text-xl font-bold">Contents</h3>
                    <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
                  </div>
                  <Collection.Sections>
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Section className="border border-border shadow-xl shadow-gray-300/20 transition hover:brightness-100 dark:border-border dark:shadow-none dark:hover:brightness-125 [&_[data-check-icon]]:text-emerald-600 [&_[data-check-icon]]:opacity-100 [&_[data-check-icon]]:dark:text-emerald-400 [&_[data-progress='100']]:bg-transparent [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-emerald-500 [&_[data-progress]]:dark:bg-emerald-400">
                        <Collection.Lessons className="border-border">
                          <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&_svg]:text-teal-600 [&_svg]:opacity-100 [&_svg]:dark:text-teal-300" />
                        </Collection.Lessons>
                      </Collection.Section>
                    ) : (
                      <Skeleton className="border-none bg-transparent bg-gradient-to-r from-white/5 to-transparent py-7" />
                    )}
                  </Collection.Sections>
                  {/* Used if module has either none or single section so they can be styled differently */}
                  <Collection.Lessons className="overflow-hidden rounded-md border border-gray-100 py-0 shadow-xl shadow-gray-500/10 dark:border-gray-900 dark:shadow-none">
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300 [&_[data-item]]:py-3" />
                    ) : (
                      <Skeleton className="border-none bg-transparent bg-gradient-to-r from-white/5 to-transparent py-6 first-of-type:rounded-t last-of-type:rounded-b" />
                    )}
                  </Collection.Lessons>
                </Collection.Root>
              )}
              <ResetProgress module={workshop} />
              {workshop.moduleType === 'workshop' && (
                <ModuleCertificate module={workshop} />
              )}
            </>
          )}
        </aside>
      </main>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{module: Module; canView: boolean}> = ({
  module,
  canView,
}) => {
  const {title, slug, sections, image, github} = module
  const product = module.product as SanityProduct
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || module.lessons)
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-start px-5 pb-10 pt-8 sm:pb-16 sm:pt-10 md:flex-row">
        <div className="w-full text-center md:text-left">
          {module.moduleType === 'bonus' ? (
            <Link
              href="/bonuses"
              className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-orange-500 dark:text-orange-300"
            >
              Bonus
            </Link>
          ) : (
            <Link
              href="/workshops"
              className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-orange-500 dark:text-orange-300"
            >
              Pro Workshop
            </Link>
          )}
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-900">
                  <Image
                    src={require('../../public/kent-c-dodds.png')}
                    alt="Kent C. Dodds"
                    width={48}
                    height={48}
                    priority
                    placeholder="blur"
                  />
                </div>
                <span>Kent C. Dodds</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-start justify-center gap-3 pt-8 md:justify-start lg:flex-row lg:items-center">
              {!canView && product && ALLOW_PURCHASE && (
                <button
                  onClick={() => {
                    track('clicked get access', {module: slug.current})
                    document.getElementById('buy')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                  type="button"
                  className="relative flex w-full items-center justify-center rounded-md bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-4 text-lg font-semibold text-primary-foreground transition hover:brightness-110 focus-visible:ring-white md:hidden md:max-w-[240px]"
                >
                  Get Access
                </button>
              )}
              {moduleProgress?.moduleCompleted ? (
                <Dialog.Root>
                  <Dialog.Trigger
                    className={cx(
                      'relative flex w-full items-center justify-center rounded-md bg-gradient-to-b from-blue-500 to-blue-600 px-5 py-4 text-lg font-semibold text-white transition hover:brightness-110 focus-visible:ring-white md:max-w-[240px]',
                      {
                        'animate-pulse': moduleProgressStatus !== 'success',
                      },
                    )}
                  >
                    Get Certificate
                  </Dialog.Trigger>
                  <CertificateForm module={module} />
                </Dialog.Root>
              ) : (
                <Link
                  href={
                    firstSection && sections
                      ? {
                          pathname: `/[type]/[module]/[section]/[lesson]`,
                          query: {
                            type:
                              module.moduleType === 'bonus'
                                ? 'bonuses'
                                : 'workshops',
                            module: slug.current,
                            section: isModuleInProgress
                              ? nextSection?.slug
                              : firstSection.slug,
                            lesson: isModuleInProgress
                              ? nextLesson?.slug
                              : firstLesson?.slug,
                          },
                        }
                      : {
                          pathname: '/[type]/[module]/[lesson]',
                          query: {
                            type:
                              module.moduleType === 'bonus'
                                ? 'bonuses'
                                : 'workshops',
                            module: slug.current,
                            lesson: isModuleInProgress
                              ? nextLesson?.slug
                              : firstLesson?.slug,
                          },
                        }
                  }
                  className={cn(
                    'relative flex w-full items-center justify-center rounded-md border px-5 py-4 text-lg font-semibold transition hover:brightness-110 focus-visible:ring-white md:max-w-[240px]',
                    {
                      'animate-pulse': moduleProgressStatus === 'loading',
                      'border-transparent bg-gradient-to-b from-blue-500 to-blue-600 text-primary-foreground':
                        canView,
                      'border-foreground/10 bg-foreground/5 text-foreground':
                        !canView,
                    },
                  )}
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  <Icon name="Playmark" aria-hidden="true" className="mr-1.5" />
                  {canView ? (
                    <>{isModuleInProgress ? 'Continue' : 'Start'} Learning</>
                  ) : (
                    <>Preview Workshop</>
                  )}
                </Link>
              )}

              {github?.repo && (
                <a
                  className="flex w-full items-center justify-center gap-2 rounded-md border-none border-gray-300 px-5 py-4 font-medium leading-tight transition hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900 md:w-auto"
                  href={github.repo}
                  onClick={() => {
                    track('clicked github code link', {module: slug.current})
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="Github" size="24" /> Workshop App & Code
                </a>
              )}
            </div>
          </div>
        </div>
        {image && (
          <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0 lg:hidden">
            <Image
              priority
              src={image}
              alt={title}
              width={360}
              height={360}
              quality={100}
            />
          </div>
        )}
      </header>
    </>
  )
}

const CourseMeta = ({
  title,
  description,
}: {
  title: string
  description?: string | null | undefined
}) => (
  <CourseJsonLd
    courseName={title}
    description={description || ''}
    provider={{
      name: `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`,
      type: 'Person',
      url: isBrowser() ? document.location.href : process.env.NEXT_PUBLIC_URL,
    }}
  />
)

const WorkshopPricingWidget: React.FC<{product: SanityProduct}> = ({
  product,
}) => {
  const router = useRouter()

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      productId: product.productId,
      code: router.query.code as string,
    })
  const couponFromCode = commerceProps?.couponFromCode
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)
  console.log({couponFromCode, couponId, commerceProps})
  const purchases = commerceProps?.purchases || []
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'
  const {merchantCoupon, setMerchantCoupon, quantity} = usePriceCheck()
  const upgradableTo = product.upgradableTo
  const hasPurchasedUpgrade =
    upgradableTo && purchasedProductIds.includes(upgradableTo.productId)

  return (
    <div data-pricing-container="" id="buy" key={product.name}>
      <Pricing
        id="workshop-pricing"
        // bonuses={bonuses}
        allowPurchase={ALLOW_PURCHASE}
        userId={commerceProps?.userId}
        product={product}
        options={{
          withImage: true,
          withGuaranteeBadge: true,
        }}
        purchaseButtonRenderer={
          upgradableTo && !hasPurchasedUpgrade
            ? (commerceProps, product) => {
                return (
                  <Link
                    href={`/purchase?productId=${product.productId}&ppp=${
                      merchantCoupon?.type === 'ppp'
                    }&quantity=${quantity}&code=${couponId ?? false}`}
                    data-pricing-product-checkout-button=""
                  >
                    <span>{product?.action || 'Buy Now'}</span>
                  </Link>
                )
              }
            : undefined
        }
        purchased={purchasedProductIds.includes(product.productId)}
        couponId={couponId}
        couponFromCode={couponFromCode}
      />
    </div>
  )
}
