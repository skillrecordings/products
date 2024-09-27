import Image from 'next/image'
import Layout from '@/components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import React from 'react'
import {Purchase} from '@skillrecordings/database'
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
  SelectTrigger,
  SelectValue,
} from '@skillrecordings/ui'
import {useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {trpc} from '@/trpc/trpc.client'
import {
  PriceDisplayProps,
  formatUsd,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Spinner from '@/components/spinner'
import {Bonuses, PurchasedBadge} from '@/templates/purchased-product-template'
import {getUserAndSubscriber} from '@/lib/users'
import {sanityClientNoCdn} from '@/utils/sanity-client'
import groq from 'groq'
import {couponForPurchases, eRv1PurchasedOnDate} from '@/lib/purchases'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, res, query} = context
  const token = await getToken({req})
  const {user, subscriber} = await getUserAndSubscriber({req, res, query})
  const pricingActive = await sanityClientNoCdn.fetch(
    groq`*[_type == 'pricing' && active == true][0]`,
  )

  const erV1PurchasedOnDate = eRv1PurchasedOnDate(user?.purchases)
  const coupon =
    (await couponForPurchases(
      erV1PurchasedOnDate,
      z
        .string()
        .optional()
        .parse(query?.coupon || query?.code),
    )) || query?.coupon

  const allowPurchase =
    pricingActive ||
    query?.allowPurchase === 'true' ||
    query?.coupon ||
    query?.code

  const products = await getAllProducts()

  const {props: commerceProps} = await propsForCommerce({
    query: {
      ...query,
      coupon,
    },
    token,
    products,
  })
  const productLabels = [
    'er-v1-upgrade-75-6ab7',
    'er-v1-upgrade-50-2dg1',
  ].includes(coupon?.id)
    ? {
        'kcd_product-clzlrf0g5000008jm0czdanmz': 'Exclusive Upgrade Discount',
      }
    : {}

  return {props: {...commerceProps, productLabels}}
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
  productLabels?: {[productId: string]: string}
  couponIdFromCoupon?: string
}

const Products: React.FC<ProductsIndexProps> = ({
  products,
  productLabels,
  couponIdFromCoupon,
}) => {
  const {
    purchases,
    displayedProducts,
    purchasedProductIds,
    purchasedProducts,
    setDisplayedProducts,
    setDefaultFilterValue,
  } = useProductsIndex()
  const router = useRouter()

  return (
    <>
      {displayedProducts &&
        displayedProducts.length > 0 &&
        displayedProducts
          .sort((a, b) => {
            const modulesLengthA = a.modules ? a.modules.length : 0
            const modulesLengthB = b.modules ? b.modules.length : 0
            return modulesLengthB - modulesLengthA
          })
          .map((product) => {
            const purchase = purchases?.find(
              (p) => p.productId === product.productId,
            )

            return (
              <PriceCheckProvider
                key={product.slug}
                purchasedProductIds={purchasedProductIds}
              >
                <ProductCard
                  product={product}
                  purchase={purchase}
                  couponId={couponIdFromCoupon}
                />
              </PriceCheckProvider>
            )
          })
          .reverse()}
      {purchasedProducts.length === 0 ? (
        <div>
          You haven't purchased any Epic React products yet.{' '}
          {products && (
            <button
              onClick={() => {
                router.push('/products', undefined, {shallow: true})
                setDefaultFilterValue({state: 'all'})
                setDisplayedProducts(products)
              }}
              className="text-primary underline"
            >
              Browse
            </button>
          )}
        </div>
      ) : null}
    </>
  )
}

const ProductsIndex: React.FC<ProductsIndexProps> = ({
  purchases,
  products,
  couponIdFromCoupon,
}) => {
  console.log({purchases, products})
  return (
    <Layout meta={{title: 'Products'}}>
      <header className="flex items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Products</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-md space-y-4 px-5 pb-16">
        <ProductsIndexProvider products={products} purchases={purchases}>
          <StateFilter />
          <Products
            purchases={purchases}
            products={products}
            couponIdFromCoupon={couponIdFromCoupon}
          />
        </ProductsIndexProvider>
      </main>
    </Layout>
  )
}

export default ProductsIndex

const ProductCard: React.FC<{
  product: SanityProduct
  purchase: PurchaseWithProduct | undefined
  couponId?: string
}> = ({product, purchase, couponId}) => {
  const {data: formattedPrice, status: formattedPriceStatus} =
    trpc.pricing.formatted.useQuery({
      productId: product.productId as string,
      quantity: 1,
      couponId,
    })

  const buyHref = `/buy`
  const purchasedHref = `/products/${product.slug}`

  if (product.state === 'unavailable' && !purchase) {
    return null
  }

  return (
    <Card className="relative border-er-gray-200 bg-transparent">
      <div className="flex">
        <div className="grid w-[100px] place-items-center py-5 pl-5 md:w-[120px]">
          {product?.image?.url && (
            <Image
              className="rounded-full"
              src={product.image.url}
              alt={product.title || product.name}
              width={200}
              height={200}
            />
          )}
        </div>
        <div className="grow">
          <CardHeader className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
            <CardTitle className="w-full text-xl hover:underline">
              <Link
                href={purchase ? purchasedHref : `/products/${product.slug}`}
                className="whitespace-nowrap"
              >
                {product.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-3">
              {purchase ? <PurchasedBadge /> : null}
            </div>
          </CardHeader>
          <CardFooter className="space-x-2">
            {purchase ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  asChild
                  className="bg-blue-500 font-semibold text-white hover:bg-blue-600"
                >
                  <Link href={purchasedHref}>
                    {purchase.bulkCoupon
                      ? 'Manage & Details'
                      : 'Manage & Details'}
                  </Link>
                </Button>
                {purchase.merchantChargeId && (
                  <Button
                    variant="outline"
                    asChild
                    size="sm"
                    className="bg-gray-500 font-semibold text-white hover:bg-gray-600 hover:text-white"
                  >
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
                )}
              </>
            ) : (
              <>
                {product.state === 'unavailable' ? (
                  'Unavailable'
                ) : (
                  <>
                    {product.slug && (
                      <Button
                        size="sm"
                        asChild
                        className="border border-yellow-300 bg-transparent font-semibold text-text hover:bg-yellow-400 hover:text-white"
                      >
                        <Link href={buyHref}>Buy</Link>
                      </Button>
                    )}
                    {purchase ? null : (
                      <div className="flex items-center space-x-3 pt-2 text-sm text-muted-foreground">
                        <>
                          <PriceDisplay
                            formattedPrice={formattedPrice}
                            status={formattedPriceStatus}
                          />
                        </>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </CardFooter>
          <div className="px-5 [&_h2]:mt-0 [&_h2]:pb-4 [&_h2]:pt-2 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:uppercase [&_h2]:tracking-wide [&_h2]:opacity-90 [&_ul]:pb-5">
            <Bonuses purchase={purchase as any} />
          </div>
        </div>
      </div>
    </Card>
  )
}

const StateFilter = () => {
  const router = useRouter()
  const {
    products,
    purchasedProducts,
    defaultFilterValue,
    setDisplayedProducts,
    setDefaultFilterValue,
  } = useProductsIndex()

  const {data: sessionData} = useSession()

  const handleValueChange = (value: string) => {
    if (value === 'all') {
      router.push('/products', undefined, {shallow: true})
      setDisplayedProducts(products)
      setDefaultFilterValue({state: 'all'})
    } else {
      router.push('/products?s=' + value, undefined, {shallow: true})
      setDisplayedProducts(purchasedProducts)
      setDefaultFilterValue({state: value})
    }
  }

  return (
    <>
      <SelectGroup>
        <Select
          onValueChange={handleValueChange}
          value={defaultFilterValue.state}
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
    </>
  )
}
const useProductsIndex = () => {
  return React.useContext(ProductsIndexContext)
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
    <div className="flex w-full flex-shrink-0 items-center text-sm">
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
          <div aria-live="polite" className="flex items-center space-x-3">
            {formattedPrice?.calculatedPrice &&
              formatUsd(formattedPrice?.calculatedPrice).dollars}
            <sup className="-top-0.5" aria-hidden="true">
              {formattedPrice?.calculatedPrice &&
                formatUsd(formattedPrice?.calculatedPrice).cents}
            </sup>
            {Boolean(appliedMerchantCoupon || isDiscount(formattedPrice)) && (
              <div>
                <div aria-hidden="true" className="flex items-center space-x-2">
                  <div className="line-through">{'$' + fullPrice}</div>
                  <div className="whitespace-nowrap">Save {percentOff}%</div>
                </div>
                <div className="sr-only">
                  {appliedMerchantCoupon?.type === 'bulk' ? (
                    <div>Team discount.</div>
                  ) : null}{' '}
                  {percentOffLabel}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const defaultProductsIndexContext = {
  purchases: [],
  products: [],
  defaultFilterValue: {state: 'all'},
  purchasedProductIds: [],
  setDefaultFilterValue: () => {},
  setDisplayedProducts: () => {},
  displayedProducts: [],
  purchasedProducts: [],
}

const ProductsIndexContext = React.createContext<{
  purchases: PurchaseWithProduct[]
  products: SanityProduct[]
  defaultFilterValue: {state: string}
  purchasedProductIds: string[]
  setDefaultFilterValue: (value: {state: string}) => void
  setDisplayedProducts: (products: SanityProduct[]) => void
  displayedProducts?: SanityProduct[]
  purchasedProducts: SanityProduct[]
}>(defaultProductsIndexContext)

const ProductsIndexProvider: React.FC<
  React.PropsWithChildren<{
    purchases: PurchaseWithProduct[]
    products: SanityProduct[]
  }>
> = ({purchases, products, children}) => {
  const router = useRouter()
  const [defaultFilterValue, setDefaultFilterValue] = React.useState({
    state: (router.query.s as string) || 'all',
  })
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const purchasedProducts = products.filter((product) =>
    purchasedProductIds?.includes(product.productId),
  )

  const initialProducts = React.useMemo(() => {
    if (defaultFilterValue.state === 'all') {
      return products
    } else {
      return purchasedProducts
    }
  }, [defaultFilterValue, products, purchasedProducts])

  const [displayedProducts, setDisplayedProducts] =
    React.useState<SanityProduct[]>(initialProducts)

  return (
    <ProductsIndexContext.Provider
      value={{
        purchases,
        products,
        defaultFilterValue,
        purchasedProductIds,
        setDefaultFilterValue,
        setDisplayedProducts,
        displayedProducts,
        purchasedProducts,
      }}
    >
      {children}
    </ProductsIndexContext.Provider>
  )
}
