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
import Balancer from 'react-wrap-balancer'
import {
  FormattedPrice,
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {
  ModuleProgressProvider,
  useModuleProgress,
} from '@skillrecordings/skill-lesson/video/module-progress'
import {motion, useScroll, useTransform} from 'framer-motion'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {usePriceCheck} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {PriceDisplay} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {QueryStatus} from '@tanstack/react-query'
import {buildStripeCheckoutPath} from '@skillrecordings/skill-lesson/utils/build-stripe-checkout-path'
import {Button} from '@skillrecordings/ui'
import {cn} from '@skillrecordings/ui/utils/cn'
import {useRouter} from 'next/router'
import {RxDiscordLogo} from 'react-icons/rx'
import MuxPlayer from '@mux/mux-player-react'
import ReactMarkdown from 'react-markdown'
import {useBonuses} from '@/hooks/use-bonuses'
import toast from 'react-hot-toast'

const PurchasedProductTemplate: React.FC<ProductPageProps> = ({
  purchases = [],
  product,
  existingPurchase,
  userId,
}) => {
  const router = useRouter()
  const {data: session, status: sessionStatus} = useSession()

  const isUpgrade = Boolean(router.query.upgrade)
  const withWelcomeBanner = isUpgrade || Boolean(router.query.welcome)

  const purchasesForCurrentProduct = purchases.filter((purchase: Purchase) => {
    return (
      purchase.productId === product.productId &&
      ['Valid', 'Restricted'].includes(purchase.status)
    )
  })
  const purchase = purchasesForCurrentProduct[0]

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

  const getPurchaseLabel = () => {
    switch (true) {
      case isRestrictedUpgrade:
        return 'Purchased: Regional License'
      case Boolean(purchase.bulkCoupon):
        return 'Purchased: Team License'
      default:
        'Purchased: Full License'
    }
  }

  const {scrollY} = useScroll()
  const welcomeBannerScrollAnimation = useTransform(
    scrollY,
    // Map y from these values:
    [0, 600],
    // Into these values:
    ['0deg', '-3deg'],
  )

  return (
    <Layout meta={{title: product.name}}>
      {withWelcomeBanner ? (
        <motion.div
          style={{
            transformOrigin: 'top center',
            transformPerspective: 300,
            rotateX: welcomeBannerScrollAnimation,
          }}
          className="relative mx-auto mt-8 flex w-full max-w-screen-lg flex-col items-center px-5"
        >
          <section className="relative flex w-full flex-col-reverse overflow-hidden rounded-md border border-white/5 bg-gradient-to-tr from-primary to-indigo-500 text-primary-foreground selection:bg-gray-900 md:grid md:grid-cols-8">
            <div className="col-span-4 flex flex-col justify-between p-5 pt-8 sm:p-8 md:pt-8">
              <div className="space-y-3">
                <p className="text-xl font-semibold">
                  Hey {session?.user?.name || 'there'}{' '}
                  <span role="img" aria-label="waving hand">
                    👋
                  </span>
                </p>
                {isUpgrade ? (
                  <Balancer>
                    <p>
                      You've succesfully upgraded {purchase.product.name}!
                      Below, you'll find everything you need to manage your
                      purchase and access related information. If you have any
                      questions or need assistance at any point, please don't
                      hesitate to{' '}
                      <Link className="text-white underline" href="/contact">
                        contact us
                      </Link>
                      .
                    </p>
                  </Balancer>
                ) : (
                  <>
                    <p>
                      <Balancer>
                        Welcome to {process.env.NEXT_PUBLIC_SITE_TITLE}! We're
                        thrilled to have you here. Below, you'll find everything
                        you need to manage your purchase and access related
                        information. If you have any questions or need
                        assistance at any point, please don't hesitate to{' '}
                        <Link className="text-white underline" href="/contact">
                          contact us
                        </Link>
                        .
                      </Balancer>
                    </p>
                    <p>
                      <Balancer>
                        Ready to dive in? Our{' '}
                        <Link
                          href="/get-started"
                          className="text-white underline"
                          target="_blank"
                        >
                          Getting Started guide
                        </Link>{' '}
                        will help you get started smoothly.
                      </Balancer>
                    </p>
                  </>
                )}
              </div>
              <div className="mt-10 flex items-center space-x-2">
                <Button
                  size="sm"
                  className="shadow-soft-md bg-white font-medium text-gray-900"
                  asChild
                >
                  <Link href="/get-started" target="_blank">
                    Get Started
                  </Link>
                </Button>
                <Button
                  size="sm"
                  className="shadow-soft-md bg-gray-900 font-medium text-white"
                  asChild
                >
                  <Link href="https://kcd.im/discord" target="_blank">
                    <RxDiscordLogo className="mr-1 h-4 w-4" />
                    Join Discord
                  </Link>
                </Button>
              </div>
            </div>
            <div className="col-span-4 flex w-full items-center justify-center p-5 sm:p-8 md:pl-0">
              <MuxPlayer
                playbackId="uAWjlKTFcFwHpqUzpwbBehoa00aS3iIO77Wm2g9hJb4A"
                className="w-full rounded shadow-xl"
                accentColor="#3b82f6"
                poster="https://res.cloudinary.com/epic-web/image/upload/v1697358228/after-purchase-video-poster.jpg"
              />
            </div>
          </section>
          <div
            className="h-1 w-[99%] rounded-b-md bg-primary brightness-125 dark:brightness-75"
            aria-hidden
          />
          <div
            className="h-1 w-[98%] rounded-b-md bg-primary brightness-150 dark:brightness-50"
            aria-hidden
          />
        </motion.div>
      ) : null}
      <main
        data-product-page=""
        className="mx-auto flex w-full max-w-screen-lg flex-col gap-10 lg:flex-row"
      >
        <article className="w-full max-w-4xl px-5 pb-0 pt-16 sm:pb-16">
          {withWelcomeBanner ? null : (
            <Link
              href="/products"
              className="group mb-10 inline-flex gap-1 text-sm opacity-75 transition hover:opacity-100"
            >
              <span className="transition group-hover:-translate-x-1">←</span>{' '}
              <span>All Products</span>
            </Link>
          )}
          <header className="">
            <PurchasedBadge>{getPurchaseLabel()}</PurchasedBadge>
            <h1 className="font-text pt-5 text-3xl font-semibold sm:text-4xl">
              <Balancer>{product.name}</Balancer>
            </h1>
          </header>
          <div className="">
            {purchase.bulkCoupon && (
              <>
                <H2>Invite your team</H2>
                <InviteTeam
                  className="[&_[data-redeem]>[data-sr-button]]:bg-primary [&_[data-redeem]>[data-sr-button]]:text-base [&_[data-redeem]>[data-sr-button]]:!text-primary-foreground [&_[data-redeem]]:flex [&_[data-redeem]]:w-full [&_[data-redeem]]:!justify-end [&_[data-sr-button]]:border-none  [&_[data-sr-button]]:bg-secondary [&_[data-sr-button]]:text-sm [&_[data-sr-button]]:font-medium [&_[data-sr-button]]:!text-foreground dark:[&_[data-sr-button]]:!text-white [&_input]:!border-border [&_input]:!bg-input [&_input]:selection:!text-white dark:[&_input]:!bg-input"
                  session={session}
                  purchase={purchasesForCurrentProduct[0]}
                  existingPurchase={existingPurchase}
                  setPersonalPurchase={setPersonalPurchase}
                />

                <H2>Team members</H2>
                <ClaimedTeamSeats
                  session={session}
                  purchase={purchase}
                  existingPurchase={existingPurchase}
                  setPersonalPurchase={setPersonalPurchase}
                />
              </>
            )}
            <Bonuses purchase={purchase} />
            {isTransferAvailable && purchaseUserTransfers && (
              <>
                <H2>Purchase Transfer</H2>
                <Transfer
                  className="[&_h2]:hidden"
                  purchaseUserTransfers={purchaseUserTransfers}
                  refetch={refetch}
                />
              </>
            )}
            <H2>Invoices</H2>
            <div className="overflow-x-auto scrollbar-thin">
              <Purchases
                purchasesForCurrentProduct={purchasesForCurrentProduct}
              />
            </div>
            {isRestrictedUpgrade ? (
              <>
                <H2 className="pt-10">Regional License</H2>
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
                <H2>Buy more seats</H2>
                <p className="pb-5">
                  Want to get the rest of your team onboard and learning? You
                  can always buy more seats and receive a cumulative discount.
                </p>
                <BuyMoreSeats
                  className="flex [&>fieldset]:flex-col [&>fieldset]:sm:flex-row [&_[data-full-price]]:line-through [&_[data-percent-off]]:text-primary dark:[&_[data-percent-off]]:text-blue-300 [&_[data-price-container]]:!flex [&_[data-price-container]]:!w-full [&_[data-price-discounted]]:flex [&_[data-price-discounted]]:items-center [&_[data-price-discounted]]:gap-2 [&_[data-price-discounted]]:pl-3 [&_[data-price-discounted]]:text-base [&_[data-price-discounted]]:font-medium [&_[data-price]]:flex [&_[data-price]]:text-2xl [&_[data-price]]:font-bold [&_[data-pricing-product-header]]:w-full [&_[data-pricing-product]]:w-full [&_button]:!bg-primary [&_button]:!px-4 [&_button]:!py-1.5 [&_button]:!font-medium [&_button]:!text-primary-foreground [&_input]:text-sm [&_sup]:top-2.5 [&_sup]:pr-1 [&_sup]:opacity-75"
                  productId={purchase.productId}
                  userId={userId}
                />
              </>
            )}
          </div>
        </article>
        <aside className="flex flex-shrink-0 flex-col items-center py-10 pr-5 md:mb-0 lg:min-h-screen lg:w-4/12 lg:items-end">
          {product?.image?.url && (
            <Image
              className="rounded-full"
              src={product.image.url}
              alt={product.name}
              width={300}
              height={300}
            />
          )}
          <div className="pt-10">
            <span className="block pb-4 text-sm font-semibold uppercase">
              Workshops
            </span>
            {product?.modules?.map((module) => {
              return (
                <ModuleProgressProvider
                  key={module.slug}
                  moduleSlug={module.slug}
                >
                  <ModuleItem module={module} />
                </ModuleProgressProvider>
              )
            })}
          </div>
        </aside>
      </main>
    </Layout>
  )
}

export default PurchasedProductTemplate

export const Bonuses: React.FC<{purchase?: Purchase}> = ({purchase}) => {
  const {availableBonuses} = useBonuses(purchase?.id)

  if (!purchase) return null
  if (availableBonuses.length === 0) return null

  return (
    <>
      <H2>Available bonuses</H2>
      <ul className="space-y-10 sm:space-y-3">
        {availableBonuses.map((bonus: any) => {
          return (
            <li
              key={bonus.slug}
              className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:justify-start sm:text-left"
            >
              {bonus?.image && (
                <Image
                  src={bonus.image}
                  alt={bonus.title}
                  width={58}
                  height={58}
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{bonus.title}</h3>
                {bonus.description && (
                  <ReactMarkdown
                    className="prose dark:prose-invert prose-p:opacity-90"
                    components={{
                      a: (props) => (
                        <a {...props} target="_blank" rel="noopener" />
                      ),
                    }}
                  >
                    {bonus.description}
                  </ReactMarkdown>
                )}
              </div>
              {/* <RedeemBonusButton bonus={bonus} purchaseId={purchase.id} /> */}
            </li>
          )
        })}
      </ul>
    </>
  )
}

// const RedeemBonusButton = ({
//   bonus,
//   purchaseId,
// }: {
//   bonus: {slug: string; title: string}
//   purchaseId: string
// }) => {
//   const {mutate: redeemBonus} = trpc.bonuses.redeemBonus.useMutation({
//     onSettled: async (result: any) => {
//       console.log(result)
//       switch (result?.status) {
//         case 'claimed':
//           track('claimed bonus', {bonus: bonus.slug})
//           toast.success(
//             `You've successfully claimed ${bonus.title}! Please check your inbox to log in. 🎉`,
//           )
//           break
//         case 'error':
//           track('claimed bonus failed', {bonus: bonus.slug})
//           toast.success(
//             `Please check your inbox to log in to ${bonus.title}. 📧`,
//           )
//           break
//         default:
//           toast(
//             `Something went wrong. It's our fault. Please email ${process.env.NEXT_PUBLIC_SUPPORT_EMAIL} if you need support.`,
//           )
//       }
//     },
//   })
//   return (
//     <Button
//       className="sm:ml-auto"
//       size="sm"
//       onClick={() => {
//         redeemBonus({
//           bonusSlug: bonus.slug,
//           purchaseId,
//         })
//       }}
//     >
//       Redeem
//     </Button>
//   )
// }

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
      <p className="pb-3">
        You've purchased a regional license for lower price. You can upgrade to
        get full access to all materials and bonuses from anywhere in the world.
      </p>
      <form
        action={formActionPath}
        method="POST"
        className="mt-4 flex w-full flex-col items-center justify-between gap-3 rounded border bg-white p-5 dark:bg-gray-900 sm:flex-row"
      >
        <PriceDisplay
          className="flex [&_[data-full-price]]:line-through [&_[data-percent-off]]:text-primary dark:[&_[data-percent-off]]:text-blue-300 [&_[data-price-discounted]]:flex [&_[data-price-discounted]]:items-center [&_[data-price-discounted]]:gap-2 [&_[data-price-discounted]]:pl-3 [&_[data-price-discounted]]:text-base [&_[data-price-discounted]]:font-medium [&_[data-price]]:flex [&_[data-price]]:text-2xl [&_[data-price]]:font-bold [&_sup]:top-2.5 [&_sup]:pr-1 [&_sup]:opacity-75"
          formattedPrice={formattedPrice}
          status={formattedPriceStatus}
        />
        <Button type="submit">Upgrade to full license</Button>
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
  const firstLesson =
    (firstSection?.lessons && firstSection?.lessons[0]) ||
    (module?.lessons && module.lessons[0])

  const lessonType = firstLesson?._type
  const length =
    module?.sections &&
    module?.lessons &&
    (sectionsFlatMap(module?.sections).length || module?.lessons.length)
  return (
    <div className="flex items-center gap-3 py-2">
      {module?.image?.url && (
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
          className="font-semibold hover:underline"
        >
          {module.title}
        </Link>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {module.sections && (
            <span>
              {module?.sections.length > 1 &&
                `${module.sections.length} sections`}
            </span>
          )}{' '}
          {module?.sections && module?.lessons && (
            <span>
              {length} {lessonType ? pluralize(lessonType, length) : null}
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
                className={cx(
                  'flex font-medium text-blue-600 hover:underline dark:text-blue-300',
                )}
                onClick={() => {
                  track('clicked start learning', {module: slug})
                }}
              >
                {isModuleInProgress ? 'Continue' : 'Start'}
              </Link>
              <div className="relative flex w-full items-center justify-between gap-1">
                <div className="pr-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {moduleProgress?.percentComplete}%
                </div>
                <div className="h-1 w-full bg-gray-200 dark:bg-gray-800">
                  <div
                    className="h-1 bg-blue-500 dark:bg-blue-400"
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
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold uppercase sm:pl-0"
          >
            date
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            seats
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            price
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            status
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold uppercase"
          >
            Invoice
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
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
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-base font-medium sm:pl-0">
        {format(new Date(purchase.createdAt), 'MMMM dd, y')}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        {status === 'loading' ? <Spinner className="w-4" /> : quantity}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        <Price amount={Number(purchase.totalAmount)} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-base">
        {purchase.status === 'Restricted'
          ? 'Region restricted'
          : purchase.status}
      </td>
      <td
        className={cn(
          'flex justify-end whitespace-nowrap py-4 pl-3 text-base',
          {
            'justify-end': purchase.merchantChargeId,
            'justify-start': !purchase.merchantChargeId,
          },
        )}
      >
        {purchase.merchantChargeId ? (
          <Button size="sm" asChild variant="secondary" className="w-full">
            <Link href={`/invoices/${purchase.merchantChargeId}`}>View</Link>
          </Button>
        ) : (
          'Not available'
        )}
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
        <sup className="relative !-top-1 pr-0.5 text-gray-600 dark:text-gray-400">
          USD
        </sup>
      )}
      <span className="font-medium">{dollars}</span>
      <sup className="!-top-1 pl-0.5 text-gray-600 dark:text-gray-400">
        {cents}
      </sup>
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

const H2: React.FC<React.PropsWithChildren<{className?: string}>> = ({
  children,
  className,
}) => {
  return (
    <h2
      className={cn(
        "relative mt-4 flex items-center pb-3 pt-10 text-lg font-semibold text-black after:ml-5 after:h-px after:w-full after:bg-gray-200 after:content-[''] dark:text-white dark:after:bg-gray-800 sm:text-xl",
        className,
      )}
    >
      <span className="flex-shrink-0">{children}</span>
    </h2>
  )
}

export const PurchasedBadge: React.FC<
  React.PropsWithChildren<{className?: string}>
> = ({className, children = 'purchased'}) => {
  return (
    <div
      className={cn(
        'inline-flex rounded-full border border-emerald-600/75 bg-gradient-to-tr from-teal-500 to-emerald-500 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-white shadow-inner dark:border-emerald-500 dark:from-teal-600 dark:to-emerald-600',
        className,
      )}
    >
      <span className="drop-shadow-md">{children}</span>
    </div>
  )
}
