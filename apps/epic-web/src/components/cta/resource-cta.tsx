import {ChevronRightIcon, StarIcon, TicketIcon} from '@heroicons/react/outline'
import {PlayIcon} from '@heroicons/react/solid'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {productOnSalePathBuilder} from 'components/app/navigation'
import ResourceContributor from 'components/resource-contributor'
import Image from 'next/image'
import Link from 'next/link'
import Countdown, {zeroPad} from 'react-countdown'
import type {
  CTA_ActivePromotion,
  CTA_ActiveLiveEvent,
  CTA_ContributorProduct,
} from 'trpc/routers/cta'
import {trpc} from 'trpc/trpc.client'
import {track} from 'utils/analytics'

export const ResourceCTA = ({
  resourceIdOrSlug,
  className,
}: {
  resourceIdOrSlug: string
  className?: string
}) => {
  const {data: cta, status} = trpc.cta.forResource.useQuery({
    slugOrId: resourceIdOrSlug,
  })

  if (status === 'loading') {
    return null
  }

  if (cta?.CURRENT_ACTIVE_LIVE_EVENT) {
    return (
      <ActiveLiveEventCta
        currentActiveLiveEvent={cta.CURRENT_ACTIVE_LIVE_EVENT}
        className={className}
      />
    )
  } else if (cta?.CURRENT_ACTIVE_PROMOTION) {
    return (
      <ActivePromotionCTA
        currentActivePromotion={cta.CURRENT_ACTIVE_PROMOTION}
        className={className}
      />
    )
  } else if (cta?.HAS_PRODUCT) {
    return (
      <ContributorProductCta
        currentContributorProduct={cta.HAS_PRODUCT}
        className={className}
      />
    )
  } else {
    return <DefaultCta className={className} />
  }
}

const ContributorProductCta = ({
  currentContributorProduct,
  className,
}: {
  currentContributorProduct: CTA_ContributorProduct
  className?: string
}) => {
  if (!currentContributorProduct) {
    return null
  }

  const title = currentContributorProduct.title
  const description = currentContributorProduct?.modules?.[0].description
  const contributor = currentContributorProduct.modules?.[0].instructor
  const totalLessons = currentContributorProduct.modules?.[0].totalLessons

  return (
    <div
      className={cn('mx-auto w-full max-w-3xl px-3 pb-10 sm:px-0', className)}
    >
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card">
        <div className="flex w-full flex-col items-center justify-center gap-8 px-5 pt-10 sm:flex-row">
          {currentContributorProduct.image?.url && (
            <Link
              href={productOnSalePathBuilder(currentContributorProduct)}
              className="flex-shrink-0"
              onClick={() => {
                track('cta_clicked', {
                  cta: 'contributor_product',
                  product: title,
                  location: 'image',
                })
              }}
            >
              <Image
                src={currentContributorProduct.image?.url}
                alt={title}
                width={220}
                height={220}
              />
            </Link>
          )}
          <div className="flex w-full flex-col items-start gap-3">
            <strong className="text-sm font-semibold uppercase text-orange-500 dark:text-orange-300">
              Recommended for you
            </strong>
            {title && (
              <h3 className="text-balance text-2xl font-semibold sm:text-3xl">
                <Link
                  href={productOnSalePathBuilder(currentContributorProduct)}
                  className="hover:underline"
                  onClick={() => {
                    track('cta_clicked', {
                      cta: 'contributor_product',
                      product: title,
                      location: 'title',
                    })
                  }}
                >
                  {title}
                </Link>
              </h3>
            )}
            {contributor && (
              <ResourceContributor
                className="text-sm [&_img]:w-10"
                as="div"
                {...contributor}
                image={contributor.picture?.url}
              />
            )}
            {description && (
              <p className="text-balance opacity-90">{description}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 rounded-b-lg bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-white sm:flex-row">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Link
              href={productOnSalePathBuilder(currentContributorProduct)}
              className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold leading-none text-foreground"
              aria-hidden="true"
              onClick={() => {
                track('cta_clicked', {
                  cta: 'contributor_product',
                  product: title,
                  location: 'icon',
                })
              }}
            >
              <PlayIcon className="h-5 w-5 transition duration-300 ease-in-out group-hover:scale-125" />
            </Link>
            <div className="pl-2 text-sm font-medium">
              {totalLessons !== 0 && `${totalLessons} Lessons`} ・ Progress
              Tracking ・ Completion Certificate ・ & More!
            </div>
          </div>
          <Button
            asChild
            className="w-full bg-white pr-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 sm:w-auto"
          >
            <Link
              href={productOnSalePathBuilder(currentContributorProduct)}
              onClick={() => {
                track('cta_clicked', {
                  cta: 'contributor_product',
                  product: title,
                  location: 'button',
                })
              }}
            >
              Learn more <ChevronRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const ActiveLiveEventCta = ({
  currentActiveLiveEvent,
  className,
}: {
  currentActiveLiveEvent: CTA_ActiveLiveEvent
  className?: string
}) => {
  if (!currentActiveLiveEvent || !currentActiveLiveEvent.product) {
    return null
  }
  const title = currentActiveLiveEvent.product.title
  const description = currentActiveLiveEvent.product.description

  return (
    <div
      className={cn('mx-auto w-full max-w-3xl px-3 pb-10 sm:px-0', className)}
    >
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card">
        <div className="flex w-full flex-col items-center justify-center gap-8 px-5 pt-10 sm:flex-row">
          {currentActiveLiveEvent.product.image?.url && (
            <Link
              href={productOnSalePathBuilder(currentActiveLiveEvent.product)}
              className="flex-shrink-0"
              onClick={() => {
                track('cta_clicked', {
                  cta: 'live_event',
                  product: currentActiveLiveEvent.product.title,
                  location: 'image',
                })
              }}
            >
              <Image
                src={currentActiveLiveEvent.product.image?.url}
                alt={currentActiveLiveEvent.product.title}
                width={220}
                height={220}
              />
            </Link>
          )}
          <div className="flex w-full flex-col items-start gap-3">
            <strong className="text-sm font-semibold uppercase text-primary dark:brightness-150">
              New live event scheduled
            </strong>
            {title && (
              <h3 className="text-balance text-2xl font-semibold sm:text-3xl">
                <Link
                  href={productOnSalePathBuilder(
                    currentActiveLiveEvent.product,
                  )}
                  className="hover:underline"
                  onClick={() => {
                    track('cta_clicked', {
                      cta: 'live_event',
                      product: currentActiveLiveEvent.product.title,
                      location: 'title',
                    })
                  }}
                >
                  {title}
                </Link>
              </h3>
            )}

            {description && (
              <p className="text-balance opacity-90">{description}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 rounded-b-lg bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-white sm:flex-row">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold leading-none text-foreground"
              aria-hidden="true"
            >
              <TicketIcon className="h-4 w-4" />
            </div>
            {currentActiveLiveEvent.quantityAvailable && (
              <span>
                <strong>
                  {currentActiveLiveEvent.quantityAvailable} spots left
                </strong>
              </span>
            )}
          </div>
          <Button
            asChild
            className="w-full bg-white pr-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 sm:w-auto"
          >
            <Link
              href={productOnSalePathBuilder(currentActiveLiveEvent.product)}
              onClick={() => {
                track('cta_clicked', {
                  cta: 'live_event',
                  product: currentActiveLiveEvent.product.title,
                  location: 'button',
                })
              }}
            >
              Get Your Ticket <ChevronRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const ActivePromotionCTA = ({
  currentActivePromotion,
  className,
}: {
  currentActivePromotion: CTA_ActivePromotion
  className?: string
}) => {
  if (!currentActivePromotion || !currentActivePromotion.product) {
    return null
  }

  // TODO: This is a temporary fix to check if the product is a megabundle,
  // it would be better to have a flag in the product itself!
  const IS_MEGABUNDLE =
    currentActivePromotion.product.slug.includes('megabundle')

  const title = currentActivePromotion.product.title
  const contributor = currentActivePromotion.product.modules?.[0].instructors[0]
  const description = IS_MEGABUNDLE
    ? currentActivePromotion.product.description
    : currentActivePromotion.product.modules?.[0].description

  return (
    <div
      className={cn('mx-auto w-full max-w-3xl px-3 pb-10 sm:px-0', className)}
    >
      <strong className="inline-flex pb-2 text-sm uppercase text-amber-600 dark:text-amber-300">
        Limited Offer — Save{' '}
        {(Number(currentActivePromotion.percentageDiscount) * 100).toString()}%
      </strong>
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card">
        <div className="flex w-full flex-col items-center justify-center gap-8 px-5 pt-10 sm:flex-row">
          {currentActivePromotion.product.image?.url && (
            <Link
              href={productOnSalePathBuilder(currentActivePromotion.product)}
              className="flex-shrink-0"
              onClick={() => {
                track('cta_clicked', {
                  cta: 'active_promotion',
                  product: title,
                  location: 'image',
                })
              }}
            >
              <Image
                src={currentActivePromotion.product.image?.url}
                alt={currentActivePromotion.product.title}
                width={220}
                height={220}
              />
            </Link>
          )}
          <div className="flex w-full flex-col items-start gap-3">
            {!IS_MEGABUNDLE && (
              <strong className="text-sm font-semibold uppercase text-primary dark:brightness-150">
                New self-paced workshop
              </strong>
            )}
            {title && (
              <h3 className="text-balance text-2xl font-semibold sm:text-3xl">
                <Link
                  href={productOnSalePathBuilder(
                    currentActivePromotion.product,
                  )}
                  className="hover:underline"
                  onClick={() => {
                    track('cta_clicked', {
                      cta: 'active_promotion',
                      product: title,
                      location: 'title',
                    })
                  }}
                >
                  {title}
                </Link>
              </h3>
            )}
            {contributor && !IS_MEGABUNDLE && (
              <ResourceContributor
                className="text-sm [&_img]:w-10"
                as="div"
                {...contributor}
                image={contributor.picture?.url}
              />
            )}
            {description && !IS_MEGABUNDLE && (
              <p className="text-balance opacity-90">{description}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 rounded-b-lg bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-white sm:flex-row">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold leading-none text-foreground"
              aria-hidden="true"
            >
              %
            </div>
            <Countdown
              date={currentActivePromotion.expires?.toString()}
              renderer={({days, hours, minutes, seconds}) => {
                return (
                  <span className="">
                    <strong>
                      Save{' '}
                      {(
                        Number(currentActivePromotion.percentageDiscount) * 100
                      ).toString()}
                      % for limited time only.
                    </strong>{' '}
                    <span>Price goes up in:</span>{' '}
                    <span className="font-orig tabular-nums">{days}d</span>{' '}
                    <span className="font-orig tabular-nums">{hours}h</span>{' '}
                    <span className="font-orig tabular-nums">{minutes}m</span>{' '}
                    <span className="font-orig tabular-nums">
                      {zeroPad(seconds)}s
                    </span>
                  </span>
                )
              }}
            />
          </div>
          <Button
            asChild
            className="w-full bg-white pr-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 sm:w-auto"
          >
            <Link
              href={productOnSalePathBuilder(currentActivePromotion.product)}
              onClick={() => {
                track('cta_clicked', {
                  cta: 'active_promotion',
                  product: title,
                  location: 'button',
                })
              }}
            >
              Learn more <ChevronRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

const DefaultCta = ({className}: {className?: string}) => {
  const title = 'Full Stack Vol 1'
  const path = '/products/full-stack-vol-1'
  const description = 'A comprehensive guide to full stack development'
  const image =
    'https://res.cloudinary.com/epic-web/image/upload/v1701332598/full-stack-vol-1.png'
  const totalLessons = 166

  return (
    <div
      className={cn('mx-auto w-full max-w-3xl px-3 pb-10 sm:px-0', className)}
    >
      <div className="flex w-full flex-col items-center justify-center gap-8 rounded-lg border bg-card">
        <div className="flex w-full flex-col items-center justify-center gap-8 px-5 pt-10 sm:flex-row sm:px-10">
          <Link
            href={path}
            className="flex-shrink-0"
            onClick={() => {
              track('cta_clicked', {
                cta: 'default',
                product: title,
                location: 'image',
              })
            }}
          >
            <Image src={image} alt={title} width={220} height={220} />
          </Link>
          <div className="flex w-full flex-col items-start gap-3">
            <strong className="text-sm font-semibold uppercase text-orange-500 dark:text-orange-300">
              You might also like
            </strong>
            {title && (
              <h3 className="text-balance text-2xl font-semibold sm:text-3xl">
                <Link
                  href={path}
                  className="hover:underline"
                  onClick={() => {
                    track('cta_clicked', {
                      cta: 'default',
                      product: title,
                      location: 'title',
                    })
                  }}
                >
                  {title}
                </Link>
              </h3>
            )}
            <ResourceContributor className="text-sm [&_img]:w-10" as="div" />
            {description && (
              <p className="text-balance opacity-90">{description}</p>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-between gap-3 rounded-b-lg bg-gradient-to-r from-primary to-indigo-500 px-5 py-3 text-white sm:flex-row">
          <div className="flex items-center gap-2 text-sm sm:text-base">
            <Link
              href={path}
              className="group flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold leading-none text-foreground"
              aria-hidden="true"
              onClick={() => {
                track('cta_clicked', {
                  cta: 'default',
                  product: title,
                  location: 'icon',
                })
              }}
            >
              <PlayIcon className="h-5 w-5 transition duration-300 ease-in-out group-hover:scale-125" />
            </Link>
            <div className="pl-2 text-sm font-medium">
              {`${totalLessons} Interactive Exercises`} ・ Progress Tracking ・
              Completion Certificate
            </div>
          </div>
          <Button
            asChild
            className="w-full bg-white pr-2.5 text-sm font-semibold text-primary shadow-lg hover:bg-gray-100 sm:w-auto"
          >
            <Link
              href={path}
              onClick={() => {
                track('cta_clicked', {
                  cta: 'default',
                  product: title,
                  location: 'button',
                })
              }}
            >
              Learn more <ChevronRightIcon className="w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
