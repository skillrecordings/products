import {
  FormattedPrice,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import {formatUsd} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Balancer from 'react-wrap-balancer'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import InviteTeam from '@skillrecordings/skill-lesson/team'
import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@skillrecordings/skill-lesson/ui'
import Layout from 'components/app/layout'
import Spinner from 'components/spinner'
import {format} from 'date-fns'
import {useSession} from 'next-auth/react'
import Link from 'next/link'
import {PurchaseWithProduct} from 'pages/products'
import {ProductPageProps} from 'pages/products/[slug]'
import React from 'react'
import {trpc} from 'trpc/trpc.client'
import {ClaimedTeamSeats} from '@skillrecordings/skill-lesson/team/claimed-team-seats'
import {Purchase} from '@skillrecordings/database'
import BuyMoreSeats from '@skillrecordings/skill-lesson/team/buy-more-seats'
import {QueryStatus} from '@tanstack/react-query'
import {Transfer} from 'purchase-transfer/purchase-transfer'

const ProductTemplate: React.FC<ProductPageProps> = ({
  purchases = [],
  product,
  existingPurchase,
  userId,
}) => {
  const {
    isRestrictedUpgrade,
    purchaseToUpgradeStatus,
    formattedPrice,
    formattedPriceStatus,
    currentPurchase,
    setPersonalPurchase,
    teamPurchase,
    purchaseToUpgrade,
    session,
  } = useProductDetails({purchases, product, existingPurchase, userId})

  return (
    <Layout>
      <header className="mx-auto w-full max-w-screen-lg px-5 py-16">
        <h1 className="text-2xl font-bold">{product.name}</h1>
      </header>
      <main
        data-product-page=""
        className="mx-auto w-full max-w-screen-lg space-y-16 px-5 pb-16"
      >
        {teamPurchase && (
          <div className="flex flex-col gap-10 lg:flex-row">
            <div className="lg:w-2/3">
              <h2 className="pb-2 text-lg font-medium sm:text-xl">
                Invite your team
              </h2>
              <InviteTeam
                session={session}
                purchase={teamPurchase}
                existingPurchase={existingPurchase}
                setPersonalPurchase={setPersonalPurchase}
              />
            </div>
            <div className="lg:w-1/3 lg:border-transparent">
              <h2 className="pb-5 text-lg font-medium sm:text-xl">
                Invited team members
              </h2>
              <ClaimedTeamSeats
                session={session}
                purchase={teamPurchase}
                existingPurchase={existingPurchase}
                setPersonalPurchase={setPersonalPurchase}
              />
            </div>
          </div>
        )}
        {purchaseToUpgradeStatus === 'loading' ? (
          <Skeleton className="h-[208px] w-full" />
        ) : isRestrictedUpgrade ? (
          <Upgrade
            purchaseToUpgrade={purchaseToUpgrade}
            formattedPrice={formattedPrice}
            formattedPriceStatus={formattedPriceStatus}
            product={product}
            purchase={currentPurchase}
            userId={currentPurchase.userId}
          />
        ) : (
          <div>
            <h2 className="pb-2 text-lg font-medium sm:text-xl">
              Buy more seats
            </h2>
            <BuyMoreSeats
              productId={currentPurchase.productId}
              userId={userId}
            />
          </div>
        )}
        <Purchases
          purchases={purchases}
          product={product}
          existingPurchase={existingPurchase}
          userId={userId}
        />
      </main>
    </Layout>
  )
}

export default ProductTemplate

const Purchases: React.FC<
  Pick<
    ProductPageProps,
    'purchases' | 'product' | 'existingPurchase' | 'userId'
  >
> = (props) => {
  const {
    isTransferAvailable,
    purchasesForCurrentProduct,
    purchaseUserTransfers,
    purchaseUserTransfersRefetch,
  } = useProductDetails(props)

  return (
    <div>
      <h2 className="pb-2 text-lg font-medium sm:text-xl">Your purchases</h2>
      <Table>
        {/* <TableCaption>A list of your purchases.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Invoice</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchasesForCurrentProduct.map((purchase) => (
            <PurchaseRow key={purchase.id} purchase={purchase} />
          ))}
        </TableBody>
      </Table>
      {isTransferAvailable && purchaseUserTransfers && (
        <div>
          <h2 className="pb-2 text-lg font-medium sm:text-xl">
            Transfer purchase to another email address
          </h2>
          <Transfer
            purchaseUserTransfers={purchaseUserTransfers}
            refetch={purchaseUserTransfersRefetch}
          />
        </div>
      )}
    </div>
  )
}

const Upgrade: React.FC<{
  purchase: Purchase
  product: SanityProduct
  userId: string | null
  purchaseToUpgrade: any
  formattedPrice: FormattedPrice | undefined
  formattedPriceStatus: QueryStatus
}> = ({
  purchaseToUpgrade,
  formattedPrice,
  product,
  userId,
  formattedPriceStatus,
}) => {
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  return (
    <div>
      <h2 className="pb-2 text-lg font-medium sm:text-xl">Upgrade</h2>
      <p className="pb-3 opacity-80">
        <Balancer>
          You've purchased a regional license for lower price. You can upgrade
          to get full access to all materials and bonuses from anywhere in the
          world.
        </Balancer>
      </p>
      <form
        action={`/api/skill/checkout/stripe?productId=${
          formattedPrice?.id
        }&couponId=${appliedMerchantCoupon?.id}&bulk=false&quantity=1${
          userId ? `&userId=${userId}` : ``
        }${
          formattedPrice?.upgradeFromPurchaseId
            ? `&upgradeFromPurchaseId=${formattedPrice?.upgradeFromPurchaseId}`
            : ``
        }`}
        method="POST"
        className="mt-4 flex items-center gap-3"
      >
        <PriceCheckProvider purchasedProductIds={[purchaseToUpgrade.productId]}>
          <PriceDisplay
            formattedPrice={formattedPrice}
            status={formattedPriceStatus}
          />
        </PriceCheckProvider>
        <Button type="submit">Upgrade to full license</Button>
      </form>
    </div>
  )
}

const PurchaseRow: React.FC<{purchase: PurchaseWithProduct}> = ({purchase}) => {
  const {data: chargeDetails, status} = trpc.invoices.getChargeDetails.useQuery(
    {
      merchantChargeId: purchase.merchantChargeId as string,
    },
  )

  const quantity = chargeDetails?.result?.quantity ?? 1

  return (
    <TableRow>
      <TableCell>
        <Price amount={Number(purchase.totalAmount)} />
      </TableCell>
      <TableCell>
        {format(new Date(purchase.createdAt), 'MMMM dd, y')}
      </TableCell>
      <TableCell>
        {status === 'loading' ? <Spinner className="w-4" /> : quantity}
      </TableCell>
      <TableCell>
        {purchase.status === 'Restricted'
          ? 'Region restricted'
          : purchase.status}
      </TableCell>
      <TableCell className="flex items-center justify-end space-x-2 text-right">
        <Button size="sm" variant="outline" className="text-sm" asChild>
          <Link href={`/invoices/${purchase.merchantChargeId}`}>View</Link>
        </Button>
        {/* <Button
          size="sm"
          variant="outline"
          onClick={() => {
            alert('not implemented')
          }}
        >
          Download
        </Button> */}
      </TableCell>
    </TableRow>
  )
}

const Price: React.FC<{
  amount: number
  className?: string
  withUsd?: boolean
}> = ({amount, className = '', withUsd = true}) => {
  const {dollars, cents} = formatUsd(amount)
  return (
    <div className={className}>
      {withUsd && <span className="relative pr-0.5 opacity-80">USD</span>}
      <span className="font-medium">{dollars}</span>
      <sup className="pl-0.5 text-[0.55rem] opacity-80">{cents}</sup>
    </div>
  )
}

const useProductDetails = ({
  purchases,
  product,
  existingPurchase,
  userId,
}: {
  purchases: PurchaseWithProduct[]
  product: SanityProduct
  existingPurchase: {id: string; product: {id: string; name: string}}
  userId: string
}) => {
  const purchasesForCurrentProduct = purchases.filter((purchase) => {
    return purchase.productId === product.productId
  })
  const currentPurchase = purchasesForCurrentProduct[0]

  const {data: session} = useSession()

  const [personalPurchase, setPersonalPurchase] = React.useState<any>(
    currentPurchase.bulkCoupon ? existingPurchase : currentPurchase,
  )
  const {data: purchaseUserTransfers, refetch: purchaseUserTransfersRefetch} =
    trpc.purchaseUserTransfer.forPurchaseId.useQuery({
      id: currentPurchase.id,
    })

  const isTransferAvailable =
    !currentPurchase.bulkCoupon &&
    Boolean(
      purchaseUserTransfers?.filter((purchaseUserTransfer) =>
        ['AVAILABLE', 'INITIATED', 'COMPLETED'].includes(
          purchaseUserTransfer.transferState,
        ),
      ).length,
    )
  const {merchantCoupon} = usePriceCheck()
  const {data: formattedPrice, status: formattedPriceStatus} =
    trpc.pricing.formatted.useQuery({
      productId: product.productId,
      userId,
      quantity: 1,
      merchantCoupon: merchantCoupon || undefined,
    })
  const {data: purchaseToUpgrade, status: purchaseToUpgradeStatus} =
    trpc.purchases.getPurchaseById.useQuery({
      purchaseId: formattedPrice?.upgradeFromPurchaseId,
    })
  const isRestrictedUpgrade = purchaseToUpgrade?.status === 'Restricted'
  const teamPurchase = purchasesForCurrentProduct.find((p) => p.bulkCoupon)

  return {
    purchaseUserTransfers,
    purchaseUserTransfersRefetch,
    formattedPrice,
    purchaseToUpgrade,
    purchaseToUpgradeStatus,
    formattedPriceStatus,
    currentPurchase,
    setPersonalPurchase,
    isTransferAvailable,
    isRestrictedUpgrade,
    purchasesForCurrentProduct,
    teamPurchase,
    session,
  }
}

type PriceDisplayProps = {
  status: QueryStatus
  formattedPrice?: FormattedPrice
}

const PriceDisplay = ({status, formattedPrice}: PriceDisplayProps) => {
  const {isDiscount} = usePriceCheck()

  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const fullPrice =
    (formattedPrice?.unitPrice || 0) * (formattedPrice?.quantity || 0)

  const percentOff = appliedMerchantCoupon
    ? Math.floor(appliedMerchantCoupon.percentageDiscount * 100)
    : formattedPrice && isDiscount(formattedPrice)
    ? Math.floor(
        (formattedPrice.calculatedPrice / formattedPrice.unitPrice) * 100,
      )
    : 0

  const percentOffLabel =
    appliedMerchantCoupon && `${percentOff}% off of $${fullPrice}`

  return (
    <div className="flex items-center">
      {status === 'loading' ? (
        <div>
          <span className="sr-only">Loading price</span>
          <Spinner aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : (
        <>
          <sup aria-hidden="true">US</sup>
          <div aria-live="polite" className="flex">
            {formattedPrice?.calculatedPrice &&
              formatUsd(formattedPrice?.calculatedPrice).dollars}
            <sup className="text-sm" aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </sup>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <>
                {percentOff > 0 && (
                  <div aria-hidden="true" className="flex items-center">
                    <div>{'$' + fullPrice}</div>
                    <div>Save {percentOff}%</div>
                  </div>
                )}
                <div className="sr-only">
                  {appliedMerchantCoupon?.type === 'bulk' ? (
                    <div>Team discount.</div>
                  ) : null}{' '}
                  {percentOffLabel}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
