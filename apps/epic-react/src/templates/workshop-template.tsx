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
import * as Collection from '@skillrecordings/skill-lesson/video/collection'
import Balancer from 'react-wrap-balancer'
// import Testimonials from 'testimonials'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  Skeleton,
} from '@skillrecordings/ui'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import ModuleCertificate from '@/certificate/module-certificate'
import {useModuleProgressReset} from '@skillrecordings/skill-lesson/video/reset-progress'
import {
  ArrowBigLeftDash,
  ArrowLeft,
  CogIcon,
  PlayIcon,
  RefreshCw,
  TimerReset,
} from 'lucide-react'
import Container from '@/components/app/container'
import {cn} from '@skillrecordings/ui/utils/cn'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {useRouter} from 'next/router'
import {pricingClassNames} from '@/styles/commerce'
import SaleCountdown from '@skillrecordings/skill-lesson/path-to-purchase/sale-countdown'
import {useLesson} from '@skillrecordings/skill-lesson/hooks/use-lesson'
import * as Dialog from '@radix-ui/react-dialog'
import CertificateForm from '@/certificate/certificate-form'
import {RxReset} from 'react-icons/rx'
import pluralize from 'pluralize'

const WorkshopTemplate: React.FC<{
  workshop: Module
  workshopBodySerialized: MDXRemoteSerializeResult
}> = ({workshop, workshopBodySerialized}) => {
  const {title, ogImage, image, description, testimonials} = workshop
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
  const canView = ability.can('view', 'Content')

  const canViewRegionRestriction = ability.can('view', 'RegionRestriction')

  const router = useRouter()
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
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
      <Container className="grid grid-cols-10 border-b border-r-0 lg:pr-0">
        <main className="col-span-6 pr-10 pt-10">
          <Header module={workshop} />
          <article className="prose prose-lg w-full max-w-none py-10 dark:prose-invert">
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
        <aside className="col-span-4 flex flex-col items-center border-x p-10 pt-10">
          <div className="flex w-full flex-col">
            {image && (
              <div className="mb-10 flex w-full justify-center">
                <Image
                  src={image}
                  alt={title}
                  priority
                  width={360}
                  height={360}
                  quality={100}
                />
              </div>
            )}
            {product && commercePropsStatus === 'loading' ? (
              <Skeleton className="mt-16 h-96 w-full flex-grow" />
            ) : (
              <>
                {!canView && product && (
                  <div
                    className={pricingClassNames('mb-10 [&_article]:x-[p-0]')}
                  >
                    <PriceCheckProvider
                      purchasedProductIds={commerceProps?.purchases?.map(
                        (p: any) => p.id,
                      )}
                    >
                      <Pricing
                        canViewRegionRestriction={canViewRegionRestriction}
                        product={product}
                        allowPurchase={product.state === 'active'}
                        cancelUrl={process.env.NEXT_PUBLIC_URL + router.asPath}
                        userId={commerceProps?.userId}
                        options={{
                          withGuaranteeBadge: true,
                          withImage: true,
                          saleCountdownRenderer: (props) => {
                            return (
                              <SaleCountdown
                                data-pricing-product-sale-countdown=""
                                size="sm"
                                {...props}
                              />
                            )
                          },
                        }}
                      />
                    </PriceCheckProvider>
                  </div>
                )}
              </>
            )}
            <WorkshopCTA module={workshop} />
            {workshop && (
              <div className="-mx-10 mt-10 border-t px-10 pt-8">
                <Collection.Root module={workshop}>
                  <div className="flex w-full items-center justify-between pb-3">
                    <h3 className="text-lg font-semibold">Contents</h3>
                    <Collection.Metadata className="font-mono text-xs font-medium uppercase" />
                  </div>
                  <Collection.Sections>
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Section className="border transition hover:brightness-100 [&_[data-check-icon]]:text-primary [&_[data-check-icon]]:opacity-100 [&_[data-progress]]:h-[2px] [&_[data-progress]]:bg-primary">
                        <Collection.Lessons className="border-border">
                          <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-[0.6rem] before:leading-none before:text-muted-foreground hover:opacity-100 [&>div>svg]:text-primary [&>div>svg]:opacity-100" />
                        </Collection.Lessons>
                      </Collection.Section>
                    ) : (
                      <Skeleton className="py-7" />
                    )}
                  </Collection.Sections>
                  {/* Used if module has either none or single section so they can be styled differently */}
                  <Collection.Lessons className="overflow-hidden rounded-md border py-0">
                    {moduleProgressStatus === 'success' ? (
                      <Collection.Lesson className="group opacity-80 transition before:pl-9 before:text-[0.6rem] before:leading-none before:text-muted-foreground hover:opacity-100 [&>div>svg]:text-primary [&>div>svg]:opacity-100" />
                    ) : (
                      <Skeleton className="py-6 first-of-type:rounded-t last-of-type:rounded-b" />
                    )}
                  </Collection.Lessons>
                </Collection.Root>
                {isModuleInProgress && (
                  <ResetProgressTriggerAndDialog module={workshop} />
                )}
              </div>
            )}
            {workshop.moduleType === 'workshop' && (
              <div className="-mx-10 mt-10 border-t px-10">
                <ModuleCertificate module={workshop} />
              </div>
            )}
          </div>
        </aside>
      </Container>
    </Layout>
  )
}

export default WorkshopTemplate

const Header: React.FC<{module: Module}> = ({module}) => {
  const {title, slug, sections, image, github} = module
  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || module.lessons)
  const instructorName = `${process.env.NEXT_PUBLIC_PARTNER_FIRST_NAME} ${process.env.NEXT_PUBLIC_PARTNER_LAST_NAME}`

  return (
    <>
      <header className="relative z-10 flex flex-col-reverse items-center justify-between md:flex-row">
        <div className="w-full text-center md:text-left">
          <Link
            href={`/${pluralize(module.moduleType)}`}
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="w-3" /> All {pluralize(module.moduleType)}
          </Link>
          <h1 className="font-text text-center text-3xl font-bold tracking-tight sm:text-4xl md:text-left lg:text-5xl">
            <Balancer>{title}</Balancer>
          </h1>
          <div className="w-full pt-8 text-lg">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
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

const WorkshopCTA: React.FC<{module: Module; className?: string}> = ({
  module,
  className,
}) => {
  const {sections, slug} = module

  // Progress
  const {data: moduleProgress, status: moduleProgressStatus} =
    trpc.moduleProgress.bySlug.useQuery({
      slug: module.slug.current,
    })

  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = first<Section>(sections)
  const firstLesson = first<Lesson>(firstSection?.lessons || module.lessons)

  // Ability

  const product = module.product as SanityProduct

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: module.slug.current,
        moduleType: module.moduleType,
      })
    return {ability: createAppAbility(abilityRules || []), abilityRulesStatus}
  }
  const {ability, abilityRulesStatus} = useAbilities()
  const canView = ability.can('view', 'Content')

  return (
    <>
      {moduleProgress?.moduleCompleted ? (
        <Dialog.Root>
          <Button
            size="lg"
            asChild
            className={cn('h-14 gap-2 text-base font-semibold', className, {
              'animate-pulse': moduleProgressStatus !== 'success',
            })}
          >
            <Dialog.Trigger>Get Certificate</Dialog.Trigger>
          </Button>
          <CertificateForm module={module} />
        </Dialog.Root>
      ) : (
        <Button
          size="lg"
          variant={canView ? 'default' : 'secondary'}
          asChild
          className={cn('h-14 gap-2 text-base font-semibold', className, {
            'animate-pulse': moduleProgressStatus === 'loading',
          })}
        >
          <Link
            href={
              firstSection && sections
                ? {
                    pathname: `/[type]/[module]/[section]/[lesson]`,
                    query: {
                      type: pluralize(module.moduleType),
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
                      type: pluralize(module.moduleType),
                      module: slug.current,
                      lesson: isModuleInProgress
                        ? nextLesson?.slug
                        : firstLesson?.slug,
                    },
                  }
            }
            onClick={() => {
              track(
                canView ? 'clicked start learning' : 'clicked preview workshop',
                {module: slug.current},
              )
            }}
          >
            {canView ? (
              <>{isModuleInProgress ? 'Continue' : 'Start'} Learning</>
            ) : (
              'Preview'
            )}
            <PlayIcon className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </>
  )
}

const ResetProgressTriggerAndDialog: React.FC<{module: Module}> = ({
  module,
}) => {
  const {handleReset} = useModuleProgressReset(module)
  return (
    <AlertDialog>
      <AlertDialogTrigger className="mt-5 inline-flex gap-1 text-sm text-muted-foreground transition hover:text-foreground">
        <RxReset /> Reset progress
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently reset your
            progress in {module.title}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
