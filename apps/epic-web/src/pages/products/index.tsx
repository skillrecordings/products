import React from 'react'
import Layout from 'components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {createAppAbility} from '@skillrecordings/skill-lesson/utils/ability'
import {Purchase} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {
  Button,
  Card,
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
import {trpc} from 'trpc/trpc.client'
import {
  formatUsd,
  PriceDisplayProps,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Spinner from 'components/spinner'
import {Bonuses, PurchasedBadge} from 'templates/purchased-product-template'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const products = await getAllProducts()
  const {req, query} = context
  const token = await getToken({req})

  return await propsForCommerce({
    query,
    token,
    products: products.filter(
      (product: {type: string; state: string}) => product.type === 'self-paced',
    ),
  })
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

const Products: React.FC<ProductsIndexProps> = ({products}) => {
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
          .sort((product) => {
            const purchase = purchases?.find(
              (p) => p.productId === product.productId,
            )
            if (purchase) {
              return -1
            } else {
              return 1
            }
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
                <ProductCard product={product} purchase={purchase} />
              </PriceCheckProvider>
            )
          })}
      {purchasedProducts.length === 0 ? (
        <div>
          You haven't purchased any Epic Web products yet.{' '}
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

const ProductsIndex: React.FC<ProductsIndexProps> = ({purchases, products}) => {
  return (
    <Layout meta={{title: 'Products'}}>
      <header className="flex items-center justify-center py-16 text-center">
        <h1 className="text-2xl font-bold">Products</h1>
      </header>
      <main className="mx-auto w-full max-w-screen-md space-y-4 px-5 pb-16">
        <ProductsIndexProvider products={products} purchases={purchases}>
          <StateFilter />
          <Products purchases={purchases} products={products} />
        </ProductsIndexProvider>
      </main>
    </Layout>
  )
}

export default ProductsIndex

const ProductCard: React.FC<{
  product: SanityProduct
  purchase: PurchaseWithProduct | undefined
}> = ({product, purchase}) => {
  const {data: formattedPrice, status: formattedPriceStatus} =
    trpc.pricing.formatted.useQuery({
      productId: product.productId as string,
      quantity: 1,
    })

  const isSingleModuleProduct = product.modules.length === 1
  const buyHref = isSingleModuleProduct ? `/workshops/${product.slug}` : '/buy'
  const purchasedHref = `/products/${product.slug}`

  const useAbilities = () => {
    const {data: abilityRules, status: abilityRulesStatus} =
      trpc.modules.rules.useQuery({
        moduleSlug: product.modules[0].slug,
        moduleType: product.modules[0].moduleType,
      })
    return {
      ability: createAppAbility(abilityRules || []),
      status: abilityRulesStatus,
    }
  }
  const {ability} = useAbilities()

  const canView = ability.can('view', 'Content')

  return (
    <>
      {(product.state === 'active' ||
        (product.state === 'unavailable' && purchase)) && (
        <Card className="relative">
          <CardHeader className="flex w-full flex-col-reverse justify-between gap-2 sm:flex-row sm:items-center">
            <CardTitle className="w-full text-xl hover:underline">
              <Link href={purchase ? purchasedHref : buyHref}>
                {product.title}
              </Link>
            </CardTitle>
            <div className="flex items-center gap-3">
              {purchase ? <PurchasedBadge /> : null}
            </div>
          </CardHeader>
          <CardFooter className="flex items-center space-x-2">
            {purchase ? (
              <>
                <Button variant="secondary" size="sm" asChild>
                  <Link href={purchasedHref}>
                    {purchase.bulkCoupon
                      ? 'Manage & Details'
                      : 'Manage & Details'}
                  </Link>
                </Button>
                {purchase.merchantChargeId && (
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
                )}
              </>
            ) : (
              <>
                {product.state === 'unavailable' ? (
                  'Unavailable'
                ) : (
                  <>
                    {isSingleModuleProduct && canView ? (
                      <p className="opacity-80">Included in your bundle.</p>
                    ) : (
                      <>
                        {product.slug && (
                          <Button size="sm" asChild>
                            <Link href={buyHref}>Get Access</Link>
                          </Button>
                        )}
                      </>
                    )}
                    {purchase || (isSingleModuleProduct && canView) ? null : (
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
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
        </Card>
      )}
    </>
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
