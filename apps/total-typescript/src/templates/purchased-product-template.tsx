import React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import {trpc} from '../trpc/trpc.client'
import {Icon, IconNames} from '@skillrecordings/skill-lesson/icons'
import {format} from 'date-fns'
import Link from 'next/link'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {useSession} from 'next-auth/react'
import {ProductPageProps, Purchase} from '@/pages/products/[slug]'
import Spinner from '@skillrecordings/skill-lesson/spinner'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import {ClaimedTeamSeats} from '@skillrecordings/skill-lesson/team/claimed-team-seats'
import pluralize from 'pluralize'
import {Transfer} from '@/purchase-transfer/purchase-transfer'
import cx from 'classnames'
import {
  FormattedPrice,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {usePriceCheck} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {PriceDisplay} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {QueryStatus} from '@tanstack/react-query'
import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'

const PurchasedProductTemplate: React.FC<ProductPageProps> = ({
  purchases = [],
  product,
  existingPurchase,
  userId,
}) => {
  const purchasesForCurrentProduct = purchases.filter((purchase) => {
    return purchase.productId === product.productId
  })
  const purchase = purchasesForCurrentProduct[0]

  const {data: session} = useSession()

  const [personalPurchase, setPersonalPurchase] = React.useState<any>(
    purchase.bulkCoupon ? existingPurchase : purchase,
  )
  const {data: purchaseUserTransfers, refetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: purchase.id,
    })

  const isTransferAvailable =
    !purchase.bulkCoupon &&
    Boolean(
      purchaseUserTransfers?.filter((purchaseUserTransfer) =>
        ['AVAILABLE', 'INITIATED', 'COMPLETED'].includes(
          purchaseUserTransfer.transferState,
        ),
      ).length,
    )
  const {merchantCoupon} = usePriceCheck()
  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery({
    productId: product.productId,
    quantity: 1,
    merchantCoupon: merchantCoupon || undefined,
  })
  const {data: purchaseToUpgrade} = trpc.purchases.getPurchaseById.useQuery({
    purchaseId: formattedPrice?.upgradeFromPurchaseId,
  })
  const isRestrictedUpgrade = purchaseToUpgrade?.status === 'Restricted'

  return (
    <Layout
      meta={{
        title: product.name,
        description: product.description,
        ogImage: {
          url: `${
            process.env.NEXT_PUBLIC_URL
          }/api/og/og-product?title=${encodeURIComponent(
            product.title || product.name,
          )}&image=${product.image.url}`,
          alt: product.name,
        },
      }}
    >
      <main
        data-product-page=""
        className="mx-auto flex w-full flex-col-reverse gap-10 lg:flex-row"
      >
        <aside className="-mb-16 flex flex-shrink-0 flex-col items-center border-t border-gray-900 bg-black/30 py-10 pl-5 pr-5 md:mb-0 lg:mt-16 lg:min-h-screen lg:w-4/12 lg:items-end lg:pl-8 lg:pr-16">
          <Image
            src={product.image.url}
            alt={product.name}
            width={300}
            height={300}
          />
          <div>
            <span className="block pb-4 text-sm font-semibold uppercase">
              Contents
            </span>
            {product.modules.map((module) => {
              return (
                <ModuleProgressProvider moduleSlug={module.slug}>
                  <ModuleItem module={module} />
                </ModuleProgressProvider>
              )
            })}
          </div>
        </aside>
        <article className="w-full max-w-4xl px-5 pt-20 lg:pb-28 lg:pr-10 lg:pt-28">
          <Link
            href="/products"
            className="group mb-10 inline-flex gap-1 text-gray-400 transition hover:text-gray-200"
          >
            <span className="transition group-hover:-translate-x-1">←</span>{' '}
            <span>Products</span>
          </Link>
          <header className="pb-5">
            <h1 className="font-text text-4xl font-semibold sm:text-5xl">
              {product.name}
            </h1>
            <p className="pt-4 text-gray-300 sm:text-lg">
              You've purchased {process.env.NEXT_PUBLIC_SITE_TITLE}{' '}
              {product.name} on{' '}
              {format(new Date(purchase.createdAt), 'MMMM dd, y')}.
            </p>
          </header>
          <div className="pt-10">
            {purchase.bulkCoupon && (
              <div className="flex flex-col border-t border-gray-800 pt-10 lg:flex-row lg:gap-10">
                <div className="lg:w-2/3">
                  <h2 className="pb-2 text-lg font-medium sm:text-xl">
                    Invite your team
                  </h2>
                  <InviteTeam
                    session={session}
                    purchase={purchasesForCurrentProduct[0]}
                    existingPurchase={existingPurchase}
                    setPersonalPurchase={setPersonalPurchase}
                  />
                </div>
                <div className="mt-10 border-t border-gray-800 pt-10 lg:mt-0 lg:w-1/3 lg:border-transparent lg:pt-0">
                  <h2 className="pb-5 text-lg font-medium sm:text-xl">
                    Team members
                  </h2>
                  <ClaimedTeamSeats
                    session={session}
                    purchase={purchase}
                    existingPurchase={existingPurchase}
                    setPersonalPurchase={setPersonalPurchase}
                  />
                </div>
              </div>
            )}
            {isRestrictedUpgrade ? (
              <>
                <h2 className="mt-10 flex border-t border-gray-800 pb-3 pt-10 text-lg font-medium sm:text-xl">
                  Upgrade
                </h2>
                <Upgrade
                  purchaseToUpgrade={purchaseToUpgrade}
                  formattedPrice={formattedPrice}
                  formattedPriceStatus={status}
                  product={product}
                  purchase={purchase}
                  userId={purchase.userId}
                />
              </>
            ) : (
              <>
                <h2 className="mt-10 flex border-t border-gray-800 pb-3 pt-10 text-lg font-medium sm:text-xl">
                  Buy more seats
                </h2>
                <BuyMoreSeats productId={purchase.productId} userId={userId} />
              </>
            )}
            {isTransferAvailable && purchaseUserTransfers && (
              <>
                <h2 className="mt-10 flex border-t border-gray-800 pb-3 pt-10 text-lg font-medium sm:text-xl">
                  Transfer purchase to another email address
                </h2>
                <Transfer
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
                />
              </>
            )}
            <h2 className="mt-10 flex border-t border-gray-800 pb-3 pt-10 text-lg font-medium sm:text-xl">
              Purchases
            </h2>
            <Purchases
              purchasesForCurrentProduct={purchasesForCurrentProduct}
            />
          </div>
        </article>
      </main>
    </Layout>
  )
}

export default PurchasedProductTemplate

const Upgrade: React.FC<{
  purchase: Purchase
  product: SanityProduct
  userId: string | undefined
  purchaseToUpgrade: any
  formattedPrice: FormattedPrice | undefined
  formattedPriceStatus: QueryStatus
}> = ({formattedPrice, userId, formattedPriceStatus}) => {
  const formActionPath = buildStripeCheckoutPath({
    userId,
    quantity: formattedPrice?.quantity,
    productId: formattedPrice?.id,
    bulk: Boolean(formattedPrice?.bulk),
    couponId: formattedPrice?.appliedMerchantCoupon?.id,
    upgradeFromPurchaseId: formattedPrice?.upgradeFromPurchaseId,
  })

  return (
    <div>
      <p className="pb-3 text-gray-300">
        You've purchased a regional license for lower price. You can upgrade to
        get full access to all materials and bonuses from anywhere in the world.
      </p>
      <form
        action={formActionPath}
        method="POST"
        className="mt-4 flex items-center gap-3"
      >
        <PriceDisplay
          formattedPrice={formattedPrice}
          status={formattedPriceStatus}
        />
        <button
          type="submit"
          className="rounded bg-cyan-300 px-3 py-2 font-semibold text-black"
        >
          Upgrade to full license
        </button>
      </form>
    </div>
  )
}

const ModuleItem: React.FC<{
  module: SanityProductModule
}> = ({module}) => {
  const moduleProgress = useModuleProgress()
  const {sections, slug} = module
  const isModuleInProgress = (moduleProgress?.completedLessonCount || 0) > 0
  const nextSection = moduleProgress?.nextSection
  const nextLesson = moduleProgress?.nextLesson

  const firstSection = sections && sections[0]
  const firstLesson = firstSection?.lessons && firstSection?.lessons[0]

  return (
    <div className="flex items-center gap-3 py-2">
      {module.image.url && (
        <Image
          src={module.image.url}
          alt={module.title}
          width={80}
          height={80}
        />
      )}
      <div className="flex flex-col">
        <Link
          href={`/${pluralize(module.moduleType)}/${module.slug}`}
          className="font-medium hover:underline"
        >
          {module.title}
        </Link>
        <div className="text-sm text-gray-300">
          {module.sections && (
            <span>
              {module?.sections.length > 1 &&
                `${module.sections.length} sections`}
            </span>
          )}{' '}
          {module?.sections && module?.lessons && (
            <span>
              {sectionsFlatMap(module?.sections).length ||
                module?.lessons.length}{' '}
              lessons
            </span>
          )}
        </div>
        <div className="pt-0.5">
          {isModuleInProgress && (
            <>
              <Link
                href={
                  firstSection && sections
                    ? {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[section]/[lesson]`,
                        query: {
                          module: slug,
                          section: isModuleInProgress
                            ? nextSection?.slug
                            : firstSection.slug,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                    : {
                        pathname: `/${pluralize(
                          module.moduleType,
                        )}/[module]/[lesson]`,
                        query: {
                          module: slug,
                          lesson: isModuleInProgress
                            ? nextLesson?.slug
                            : firstLesson?.slug,
                        },
                      }
                }
                className={cx('flex font-medium text-cyan-300 hover:underline')}
                onClick={() => {
                  track('clicked start learning', {module: slug})
                }}
              >
                {isModuleInProgress ? 'Continue' : 'Start'}
              </Link>
              <div className="relative flex w-full items-center justify-between gap-1">
                <div className="pr-1 text-xs font-semibold text-gray-300">
                  {moduleProgress?.percentComplete}%
                </div>
                <div className="h-1 w-full bg-gray-800">
                  <div
                    className="h-1 bg-cyan-400"
                    style={{width: moduleProgress?.percentComplete + '%'}}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const Purchases: React.FC<{purchasesForCurrentProduct: Purchase[]}> = ({
  purchasesForCurrentProduct,
}) => {
  return (
    <table className="min-w-full divide-y divide-gray-700">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold uppercase text-white sm:pl-0"
          >
            date
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase text-white"
          >
            seats
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase text-white"
          >
            price
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase text-white"
          >
            status
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase text-white"
          >
            Invoice
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-800">
        {purchasesForCurrentProduct.map((purchase) => {
          return <PurchaseRow purchase={purchase} key={purchase.id} />
        })}
      </tbody>
    </table>
  )
}

const PurchaseRow: React.FC<{purchase: Purchase}> = ({purchase}) => {
  const {data: chargeDetails, status} = trpc.invoices.getChargeDetails.useQuery(
    {
      merchantChargeId: purchase.merchantChargeId as string,
    },
  )

  const quantity = chargeDetails?.result?.quantity ?? 1

  return (
    <tr key={purchase.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium text-white sm:pl-0">
        {format(new Date(purchase.createdAt), 'MMMM dd, y')}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base text-gray-300">
        {status === 'loading' ? <Spinner className="w-4" /> : quantity}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base text-gray-300">
        <Price amount={Number(purchase.totalAmount)} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base text-gray-300">
        {purchase.status === 'Restricted'
          ? 'Region restricted'
          : purchase.status}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        <Link
          className="text-cyan-300 underline"
          href={`/invoices/${purchase.merchantChargeId}`}
        >
          View
        </Link>
        {/* <br />
        <button
          className="text-cyan-300 underline"
          type="button"
          onClick={() => {
            alert('not implemented')
          }}
        >
          Download
        </button> */}
      </td>
    </tr>
  )
}

const Row: React.FC<
  React.PropsWithChildren<{label: string; icon: IconNames}>
> = ({children, label = 'Label', icon = null}) => {
  return children ? (
    <div className="flex w-full items-start justify-between px-3 py-4">
      <div className="flex items-center gap-2 text-gray-200">
        {icon && <Icon className="text-gray-500" name={icon} />} {label}
      </div>
      <div className="w-2/4 text-left font-medium">{children}</div>
    </div>
  ) : null
}

export const Price: React.FC<{
  amount: number
  className?: string
  withUsd?: boolean
}> = ({amount, className = '', withUsd = true}) => {
  const {dollars, cents} = formatUsd(amount)
  return (
    <div className={className}>
      {withUsd && (
        <sup className="relative !top-0.5 pr-0.5 text-gray-300">USD</sup>
      )}
      <span className="font-medium">{dollars}</span>
      <sup className="!top-0.5 pl-0.5 text-xs text-gray-300">{cents}</sup>
    </div>
  )
}

export const DatePurchased: React.FC<{date: string}> = ({date}) => {
  return <>{format(new Date(date), 'MMMM dd, y')}</>
}

export const formatUsd = (amount: number = 0) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
  const formattedPrice = formatter.format(amount).split('.')

  return {dollars: formattedPrice[0], cents: formattedPrice[1]}
}

const sectionsFlatMap = (sections: any[]) => {
  const map = sections.flatMap((section) => {
    return section.lessons || []
  })

  return map
}
