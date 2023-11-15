import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/legacy/image'
import Link from 'next/link'
import {CourseJsonLd} from '@skillrecordings/next-seo'
import {Icon} from '@skillrecordings/skill-lesson/icons'
import {isBrowser} from '@skillrecordings/skill-lesson/utils/is-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {Lesson} from '@skillrecordings/skill-lesson/schemas/lesson'
import {trpc} from '@/trpc/trpc.client'
import {type Module} from '@skillrecordings/skill-lesson/schemas/module'
import {capitalize, first} from 'lodash'
import {Section} from '@skillrecordings/skill-lesson/schemas/section'
import cx from 'classnames'
import * as Collection from '@skillrecordings/ui/module/collection'
import Balancer from 'react-wrap-balancer'
// import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {Button, Skeleton} from '@skillrecordings/ui'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import ModuleCertificate from '@/certificate/module-certificate'
import ResetProgress from '@skillrecordings/skill-lesson/video/reset-progress'
import {ArrowLeft, CogIcon, PlayIcon} from 'lucide-react'
import Container from '@/components/app/container'
import {cn} from '@skillrecordings/ui/utils/cn'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {useRouter} from 'next/router'
import {pricingClassNames} from '@/styles/commerce'

const WorkshopTemplate: React.FC<{
  workshop: Module
  workshopBodySerialized: MDXRemoteSerializeResult
}> = ({workshop, workshopBodySerialized}) => {
  const {title, ogImage, description, testimonials} = workshop
  const pageTitle = `${title} ${capitalize(workshop.moduleType)}`
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: workshop.slug.current,
    })

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({})

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )
  const product = workshop.product as SanityProduct

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
  const router = useRouter()

  return (
    <Layout
      className="mx-auto w-full lg:pb-24"
      meta={{
        title: pageTitle,
        description: description as string,
        openGraph: {
          images: [{url: ogImage as string, alt: pageTitle}],
        },
      }}
    >
      <Container className="px-0 sm:px-0 lg:px-0">
        {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
        <CourseMeta title={pageTitle} description={description} />
        {workshop.state === 'draft' && (
          <div className="flex w-full items-center justify-center gap-2 border border-orange-500/20 bg-orange-500/10 px-5 py-3 text-xs leading-tight text-amber-600 dark:bg-orange-400/10 dark:text-orange-300 sm:text-sm">
            <CogIcon className="h-4 w-4 animate-[spin_10s_linear_infinite]" />{' '}
            {capitalize(workshop.moduleType)} under development — you're viewing
            a draft version.
          </div>
        )}
      </Container>
      <Container className="grid grid-cols-8 border-b">
        <main className="col-span-5 pt-10">
          <Header tutorial={workshop} />
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
        </main>
        <aside className="col-span-3 border-l pl-10">
          <div className="flex w-full flex-col px-5 lg:max-w-sm lg:px-0">
            {product && commercePropsStatus === 'loading' ? (
              <Skeleton className="mt-12 h-32 w-full" />
            ) : (
              <div
                className={pricingClassNames(
                  '[&_article]:x-[border-b,-mx-10,p-10]',
                )}
              >
                {!canView && product && (
                  <PriceCheckProvider
                    purchasedProductIds={commerceProps?.purchases?.map(
                      (p) => p.id,
                    )}
                  >
                    <Pricing
                      canViewRegionRestriction={canViewRegionRestriction}
                      product={product}
                      allowPurchase={product.state === 'active'}
                      cancelUrl={process.env.NEXT_PUBLIC_URL + router.asPath}
                      purchases={commerceProps?.purchases}
                      userId={commerceProps?.userId}
                      options={{
                        withGuaranteeBadge: false,
                        withImage: true,
                      }}
                    />
                  </PriceCheckProvider>
                )}
              </div>
            )}
            {workshop && (
              <div className="-mx-10 border-b px-10 pb-10">
                <Collection.Root module={workshop}>
                  <div className="flex w-full items-center justify-between pb-3 pt-8">
                    <h3 className="text-lg font-semibold">Contents</h3>
                    <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
                  </div>
                  <Collection.Sections>
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Section className="border border-transparent shadow-xl shadow-gray-300/20 transition hover:brightness-100 dark:border-white/5 dark:shadow-none dark:hover:brightness-125 [&_[data-check-icon]]:text-blue-400 [&_[data-check-icon]]:opacity-100 [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-blue-500 [&_[data-progress]]:dark:bg-gray-600">
                        <Collection.Lessons>
                          <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-primary hover:opacity-100 dark:opacity-90 dark:before:text-teal-300 dark:hover:opacity-100 [&>div>svg]:text-primary [&>div>svg]:opacity-100 dark:[&>div>svg]:text-teal-300" />
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
                <ResetProgress
                  className="flex w-full justify-end pt-3 text-sm text-muted-foreground transition hover:text-foreground"
                  module={workshop}
                />
              </div>
            )}
            {workshop.moduleType === 'workshop' && (
              <ModuleCertificate module={workshop} />
            )}
          </div>
        </aside>
      </Container>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{tutorial: Module}> = ({tutorial}) => {
  const {title, slug, sections, image, github} = tutorial
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: tutorial.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || tutorial.lessons)
  const instructorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between md:flex-row">
        <div className="w-full text-center md:text-left">
          {tutorial.moduleType === 'bonus' ? (
            <Link
              href="/bonuses"
              className="inline-block pb-4 text-xs font-bold uppercase tracking-wide text-orange-500 dark:text-orange-300"
            >
              Bonus
            </Link>
          ) : (
            <Link
              href="/workshops"
              className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
            >
              <ArrowLeft className="w-3" /> All Pro Workshops
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
                    src={require('../../public/instructor.png')}
                    alt={instructorName}
                    width={48}
                    height={48}
                    priority
                    placeholder="blur"
                  />
                </div>
                <span>{instructorName}</span>
              </div>
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 pt-8 md:flex-row md:justify-start">
              <Button
                size="lg"
                asChild
                className={cn('gap-2', {
                  'animate-pulse': moduleProgressStatus === 'loading',
                })}
              >
                <Link
                  href={
                    firstSection && sections
                      ? {
                          pathname: `/[type]/[module]/[section]/[lesson]`,
                          query: {
                            type:
                              tutorial.moduleType === 'bonus'
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
                              tutorial.moduleType === 'bonus'
                                ? 'bonuses'
                                : 'workshops',
                            module: slug.current,
                            lesson: isModuleInProgress
                              ? nextLesson?.slug
                              : firstLesson?.slug,
                          },
                        }
                  }
                  onClick={() => {
                    track('clicked start learning', {module: slug.current})
                  }}
                >
                  {isModuleInProgress ? 'Continue' : 'Start'} Learning
                  <PlayIcon className="h-4 w-4" />{' '}
                </Link>
              </Button>
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
          <div className="mb-10 flex flex-shrink-0 items-center justify-center md:mb-0 lg:-mr-5">
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
