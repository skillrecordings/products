import Layout from 'components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import React from 'react'

import {Product, Purchase} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'

import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@skillrecordings/skill-lesson/ui'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {DatePurchased, Price} from 'purchase-details/purchase-details-template'
import Link from 'next/link'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpc} from 'trpc/trpc.client'
import {
  PriceDisplayProps,
  formatUsd,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Spinner from 'components/spinner'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await getAllProducts()
  const {req, query} = context
  const token = await getToken({req})

  const commerceProps = await propsForCommerce({
    query,
    token,
    products,
  })

  return commerceProps
}

type PurchaseWithProduct = Purchase & {
  id: string
  bulkCoupon: string
  product: {name: string}
  createdAt: string
  totalAmount: number
  redeemedBulkCouponId: string | null
}

type ProductsIndexProps = {
  purchases: PurchaseWithProduct[]
  products: SanityProduct[]
}

const ProductsIndex: React.FC<ProductsIndexProps> = ({purchases, products}) => {
  const {displayedProducts, purchasedProductIds} = useProductIndex(
    products,
    purchases,
  )

  return (
    <Layout meta={{title: 'Products'}}>
      <header className="flex items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Products</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-lg space-y-4 px-5">
        <StateFilter products={products} purchases={purchases} />
        {displayedProducts.length &&
          displayedProducts.map((product) => {
            const purchase = purchases?.find(
              (p) => p.productId === product.productId,
            )

            return (
              <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
                <ProductCard product={product} purchase={purchase} />
              </PriceCheckProvider>
            )
          })}
      </main>
    </Layout>
  )
}

export default ProductsIndex

const ProductCard: React.FC<{
  product: SanityProduct
  purchase: PurchaseWithProduct | undefined
}> = ({product, purchase}) => {
  const router = useRouter()
  const {data: formattedPrice, status: formattedPriceStatus} =
    trpc.pricing.formatted.useQuery({
      productId: product.productId as string,
      quantity: 1,
    })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.title}</CardTitle>
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          {purchase ? (
            <>
              <Price amount={Number(purchase.totalAmount)} />
              <span>
                Purchased on:{' '}
                <DatePurchased date={purchase.createdAt.toString()} />
              </span>
            </>
          ) : (
            <>
              <PriceDisplay
                formattedPrice={formattedPrice}
                status={formattedPriceStatus}
              />
            </>
          )}
        </div>
      </CardHeader>
      <CardFooter className="space-x-2">
        {purchase ? (
          <>
            <Button variant="secondary" size="sm" asChild>
              <Link href={`/purchases/${purchase.id}`}>
                {purchase.bulkCoupon ? 'Manage' : 'Details'}
              </Link>
            </Button>
            <Button variant="outline" asChild size="sm">
              <Link
                href={{
                  pathname: '/invoices/[merchantChargeId]',
                  query: {
                    merchantChargeId: purchase.merchantChargeId,
                  },
                }}
              >
                Invoice
              </Link>
            </Button>
          </>
        ) : (
          <>
            {product.slug && (
              <Button size="sm" asChild>
                <Link href={product.slug}>Buy</Link>
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  )
}

const StateFilter = ({
  products,
  purchases,
}: Pick<ProductsIndexProps, 'products' | 'purchases'>) => {
  const router = useRouter()
  const {purchasedProducts, defaultFilterValue, setDisplayedProducts} =
    useProductIndex(products, purchases)
  const {data: sessionData, status: sessionStatus} = useSession()

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      router.push('/products', undefined, {shallow: true})
      setDisplayedProducts(products)
    } else {
      router.push('/products?s=' + value, undefined, {shallow: true})
      setDisplayedProducts(purchasedProducts)
    }
  }

  return (
    <>
      {sessionData?.user ? (
        <SelectGroup>
          <Select
            onValueChange={handleValueChange}
            defaultValue={defaultFilterValue.state}
          >
            <SelectTrigger className="h-8 w-[180px]">
              <SelectValue placeholder="Products" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {sessionData?.user && (
                <SelectItem value="purchased">Purchased</SelectItem>
              )}
            </SelectContent>
          </Select>
        </SelectGroup>
      ) : null}
    </>
  )
}
const useProductIndex = (
  products: SanityProduct[],
  purchases: Purchase[] | undefined,
) => {
  const router = useRouter()
  const [defaultFilterValue, setDefaultFilterValue] = React.useState({
    state: (router.query.s as string) || 'all',
  })
  const [displayedProducts, setDisplayedProducts] =
    React.useState<SanityProduct[]>(products)
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const purchasedProducts = products.filter((product) =>
    purchasedProductIds?.includes(product.productId),
  )

  return {
    defaultFilterValue,
    purchasedProductIds,
    setDefaultFilterValue,
    setDisplayedProducts,
    displayedProducts,
    purchasedProducts,
  }
}

const PriceDisplay = ({status, formattedPrice}: PriceDisplayProps) => {
  const {isDiscount} = usePriceCheck()

  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const fullPrice =
    (formattedPrice?.unitPrice || 0) * (formattedPrice?.quantity || 0)

  const percentOff = appliedMerchantCoupon
    ? Math.floor(+appliedMerchantCoupon.percentageDiscount * 100)
    : formattedPrice && isDiscount(formattedPrice)
    ? Math.floor(
        (formattedPrice.calculatedPrice / formattedPrice.unitPrice) * 100,
      )
    : 0

  const percentOffLabel =
    appliedMerchantCoupon && `${percentOff}% off of $${fullPrice}`

  return (
    <div className="flex items-center text-sm">
      {status === 'loading' ? (
        <div>
          <span className="sr-only">Loading price</span>
          <Spinner aria-hidden="true" className="h-8 w-8" />
        </div>
      ) : (
        <>
          <div aria-hidden="true" className="pr-1">
            USD
          </div>{' '}
          <div aria-live="polite">
            {formattedPrice?.calculatedPrice &&
              formatUsd(formattedPrice?.calculatedPrice).dollars}
            <sup aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </sup>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <>
                <div aria-hidden="true">
                  <div>{'$' + fullPrice}</div>
                  <div>Save {percentOff}%</div>
                </div>
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
