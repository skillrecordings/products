import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from '@/trpc/trpc.client'
import {capitalize} from 'lodash'
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Skeleton} from '@skillrecordings/ui'
import {CogIcon} from '@heroicons/react/outline'
import {WorkshopAppBanner} from '@/components/workshop-app'
import {getModuleLessonPath, type Workshop} from '@/lib/workshops'
import ResetProgress from '@skillrecordings/skill-lesson/video/reset-progress'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import ModuleCertificate from '@/certificate/module-certificate'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import type {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {useRouter} from 'next/router'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {cn} from '@skillrecordings/ui/utils/cn'
import type {Tutorial} from '@/lib/tutorials'

export const ModuleTemplate: React.FC<{
  module: Workshop | Tutorial
  moduleBodySerialized: MDXRemoteSerializeResult
}> = ({module, moduleBodySerialized}) => {
  const {title, ogImage, description} = module
  const router = useRouter()
  const pageTitle = `${title} ${capitalize(module.moduleType)}`

  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({})

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: module.slug.current,
        moduleType: module.moduleType,
      })
    return {
      ability: createAppAbility(abilityRules || []),
      status: abilityRulesStatus,
    }
  }
  const {ability, status: abilityRulesStatus} = useAbilities()

  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const product = module?.product as unknown as SanityProduct
  const canView = ability.can('view', 'Content')
  const purchases = commerceProps?.purchases || []
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' ||
    product.state === 'active' ||
    Boolean(product.active)

  return (
    <Layout
      className="mx-auto w-full max-w-screen-xl lg:pb-24"
      meta={{
        title: pageTitle,
        description: module.description || '',
        ...(ogImage && {
          ogImage: {
            url: ogImage,
            alt: pageTitle,
          },
        }),
      }}
    >
      <CourseMeta title={pageTitle} description={description} />
      {module.state === 'draft' && (
        <div className="sm:px-3">
          <div className="mt-2 flex w-full items-center justify-center gap-2 bg-orange-500/10 px-5 py-3 text-sm leading-tight text-amber-600 dark:bg-orange-400/10 dark:text-orange-300 sm:mt-0 sm:rounded-b sm:text-base">
            <CogIcon className="h-4 w-4" /> {capitalize(module.moduleType)}{' '}
            under development — you're viewing a draft version.
          </div>
        </div>
      )}
      <Header canView={canView} module={module} />
      <main className="relative z-10 flex flex-col gap-5 px-5 lg:flex-row">
        <div className="w-full">
          <article className="prose prose-lg w-full max-w-none dark:prose-invert lg:max-w-3xl">
            {moduleBodySerialized && <MDX contents={moduleBodySerialized} />}
          </article>
        </div>
        <aside data-workshop="" className="relative h-full w-full lg:max-w-sm">
          {ALLOW_PURCHASE && (
            <>
              {abilityRulesStatus === 'loading' ? (
                <>
                  <Skeleton className="mb-5 flex h-full w-full flex-col items-center gap-3 rounded-lg border bg-transparent p-5">
                    <Skeleton className="mb-5 flex h-5 w-1/2 rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-10 w-2/3 rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-8 w-full rounded-md bg-transparent delay-75" />
                    <Skeleton className="flex h-14 w-full rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-8 w-full rounded-md bg-transparent delay-75" />
                    <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                    <Skeleton className="flex h-10 w-full rounded-md border bg-foreground/5 delay-75" />
                  </Skeleton>
                </>
              ) : (
                <>
                  {product && !canView ? (
                    <>
                      <PriceCheckProvider
                        purchasedProductIds={purchasedProductIds}
                      >
                        <WorkshopPricingWidget product={product} />
                      </PriceCheckProvider>
                    </>
                  ) : null}
                </>
              )}
            </>
          )}
          {module && (
            <Collection.Root
              module={module as Module}
              lessonPathBuilder={getModuleLessonPath}
              withNumbers={false}
            >
              <div className="flex w-full items-center justify-between pb-3">
                {(module.lessons || module.sections) && (
                  <h3 className="text-xl font-bold">Contents</h3>
                )}
                <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
              </div>
              <Collection.Sections className="space-y-0 overflow-hidden rounded-md border border-er-gray-200 [&_[data-state]]:animate-none">
                {moduleProgressStatus === 'success' ? (
                  <Collection.Section className="border-er-gray-200 bg-transparent font-semibold leading-tight transition data-[state='open']:rounded-none data-[state]:rounded-none data-[state='closed']:border-b hover:bg-er-gray-100 dark:hover:bg-er-gray-100 [&>[data-check-icon]]:w-3.5 [&>[data-check-icon]]:text-emerald-600 dark:[&>[data-check-icon]]:text-emerald-600 [&>[data-progress='100']]:bg-transparent [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-emerald-500 [&_[data-progress]]:dark:bg-emerald-400">
                    <Collection.Lessons className="rounded-none border-x-0 border-b border-border bg-transparent py-0">
                      <Collection.Lesson className='bg-transparent pl-1 transition before:hidden data-[active="true"]:bg-white hover:bg-er-gray-100 dark:data-[active="true"]:bg-er-gray-200 dark:hover:bg-er-gray-100 dark:hover:data-[active="true"]:bg-er-gray-300 [&_[data-check-icon]]:mr-[3px] [&_[data-check-icon]]:w-3 [&_[data-check-icon]]:text-emerald-600 [&_[data-check-icon]]:opacity-100 dark:[&_[data-check-icon]]:text-emerald-600 [&_[data-item]:has(span)]:items-center [&_[data-item]>div]:leading-tight [&_[data-item]>div]:transition [&_[data-item]]:min-h-[44px] [&_[data-item]]:items-center [&_[data-lock-icon]]:mr-[3px] [&_[data-lock-icon]]:w-3  [&_[data-lock-icon]]:text-gray-400 dark:[&_[data-lock-icon]]:text-gray-500' />
                    </Collection.Lessons>
                  </Collection.Section>
                ) : (
                  <Skeleton className="rounded-none border bg-foreground/5 py-6" />
                )}
              </Collection.Sections>
              {/* Used if module has either none or single section so they can be styled differently */}
              <Collection.Lessons>
                {moduleProgressStatus === 'success' ? (
                  <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:bg-er-gray-300 hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>[data-check-icon]]:text-red-500 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300" />
                ) : (
                  <Skeleton className="my-2 rounded-none border bg-foreground/5 py-5" />
                )}
              </Collection.Lessons>
            </Collection.Root>
          )}
          <WorkshopAppBanner
            moduleSlug={module.slug.current || ''}
            className="mt-3 rounded border sm:p-5"
          />
          <ResetProgress module={module as Module} />
          {module.moduleType === 'workshop' && (
            <ModuleCertificate module={module} />
          )}
        </aside>
      </main>
    </Layout>
  )
}

const Header: React.FC<{module: Workshop | Tutorial; canView?: boolean}> = ({
  module,
  canView,
}) => {
  const {title, slug, sections, image, github} = module
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const getAllLessons = (module: Workshop | Tutorial) => {
    const lessons: {
      title: string
      slug: string
      _type: string
    }[] = []
    if (module.resources) {
      for (const resource of module.resources) {
        if (resource._type === 'section') {
          if (resource.lessons) {
            for (const lesson of resource.lessons) {
              lessons.push(lesson)
            }
          }
        } else {
          lessons.push(resource)
        }
      }
    }
    return lessons
  }

  const allLessons = getAllLessons(module)

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstLesson = allLessons?.[0]

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between px-5 pb-10 pt-8 sm:pb-16 sm:pt-12 md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href="/workshops"
            className="inline-block pb-4 text-xs font-semibold uppercase tracking-wide text-blue-500 dark:text-blue-400"
          >
            Pro Workshop
          </Link>
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start"></div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              {(module.lessons || module.sections) && (
                <Link
                  href={{
                    pathname: '/workshops/[module]/[lesson]',
                    query: {
                      module: slug.current,
                      lesson: isModuleInProgress
                        ? nextLesson?.slug
                        : firstLesson?.slug,
                    },
                  }}
                  className={cn(
                    'relative flex w-full items-center justify-center rounded-md border px-5 py-4 text-lg font-semibold capitalize transition hover:brightness-110 focus-visible:ring-white md:max-w-[240px]',
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
                    <>Preview {module.moduleType}</>
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
          <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0">
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
  const {validCoupon} = useCoupon(commerceProps?.couponFromCode)
  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? couponFromCode?.id : undefined)

  const purchases = commerceProps?.purchases || []
  const purchasedProductIds = purchases.map((purchase) => purchase.productId)
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'
  const {merchantCoupon, setMerchantCoupon, quantity} = usePriceCheck()
  const upgradableTo = product?.upgradableTo
  const hasPurchasedUpgrade =
    upgradableTo && purchasedProductIds.includes(upgradableTo.productId)

  return (
    <div id="buy" className="mb-5 rounded-lg border pt-8" key={product.name}>
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
        index={1}
        cancelUrl={process.env.NEXT_PUBLIC_URL + router.asPath}
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
