import Layout from '@/components/app/layout'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'
import {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import React from 'react'
import Balancer from 'react-wrap-balancer'
import Image from 'next/image'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Purchase} from '@skillrecordings/database'
import {GetServerSideProps} from 'next'
import {getToken} from 'next-auth/jwt'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {trpc} from '@/trpc/trpc.client'
import Spinner from '@/components/spinner'
import {
  PriceDisplay,
  getFirstPPPCoupon,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import Link from 'next/link'
import {CheckCircleIcon} from '@heroicons/react/outline'

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

type ProductsIndexProps = CommerceProps

const ProductsIndex: React.FC<ProductsIndexProps> = ({
  purchases,
  products,
  userId,
}) => {
  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)

  return (
    <Layout meta={{title: `${process.env.NEXT_PUBLIC_SITE_TITLE} Products`}}>
      <header className="mx-auto flex w-full max-w-4xl flex-col justify-center px-5 pb-5 pt-32">
        <h1 className="text-2xl font-semibold">Products</h1>
        <h2 className="text-gray-300">
          <Balancer>
            All {process.env.NEXT_PUBLIC_SITE_TITLE} products that you can buy
            today to level up at TypeScript.
          </Balancer>
        </h2>
      </header>
      <main
        id="products-index-page"
        className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5"
      >
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <Products products={products} userId={userId} purchases={purchases} />
        </PriceCheckProvider>
      </main>
    </Layout>
  )
}

export default ProductsIndex

const Products: React.FC<CommerceProps> = ({products, userId, purchases}) => {
  const [isPPPEnabled, setIsPPPEnabled] = React.useState(false)
  const {setMerchantCoupon} = usePriceCheck()
  return (
    <>
      {products?.map((product) => {
        return (
          <ProductTeaser
            isPPPEnabled={isPPPEnabled}
            product={product}
            userId={userId}
            key={product.title}
            purchases={purchases}
          />
        )
      })}
      <div className="flex w-full items-center justify-end border-t border-gray-800 pb-16 pt-3">
        <label className="flex cursor-pointer items-center gap-1.5 text-gray-300 transition hover:text-white">
          <input
            value={isPPPEnabled ? 'on' : 'off'}
            type="checkbox"
            onChange={() => {
              setIsPPPEnabled(!isPPPEnabled)
              isPPPEnabled && setMerchantCoupon(undefined)
            }}
          />
          <span>Enable regional pricing</span>
        </label>
      </div>
    </>
  )
}

type ProductTeaserProps = {
  product: SanityProduct
  userId?: string
  purchases: Purchase[] | undefined
  isPPPEnabled?: boolean
}

const ProductTeaser: React.FC<ProductTeaserProps> = ({
  product,
  userId,
  purchases,
  isPPPEnabled = false,
}) => {
  const {addPrice, isDowngrade, merchantCoupon, setMerchantCoupon} =
    usePriceCheck()
  const {data: formattedPrice, status} = trpc.pricing.formatted.useQuery(
    {
      productId: product.productId,
      userId,
      quantity: 1,
      // couponId,
      merchantCoupon: merchantCoupon || undefined,
    },
    {
      onSuccess: (formattedPrice) => {
        addPrice(formattedPrice, product.productId)
      },
    },
  )

  const {data: purchaseToUpgrade} = trpc.purchases.getPurchaseById.useQuery({
    purchaseId: formattedPrice?.upgradeFromPurchaseId,
  })

  const isRestrictedUpgrade = purchaseToUpgrade?.status === 'Restricted'

  const defaultCoupon = formattedPrice?.defaultCoupon
  const appliedMerchantCoupon = formattedPrice?.appliedMerchantCoupon

  const pppCoupon = getFirstPPPCoupon(formattedPrice?.availableCoupons)

  const purchasedProductIds = purchases?.map((purchase) => purchase.productId)
  const purchased = purchasedProductIds?.includes(product.productId)
  const isPPPAvailable =
    Boolean(pppCoupon || merchantCoupon?.type === 'ppp') &&
    !purchased &&
    !isDowngrade(formattedPrice) &&
    isPPPEnabled

  React.useEffect(() => {
    if (isPPPAvailable && pppCoupon && isPPPEnabled) {
      setMerchantCoupon(pppCoupon)
    }
  }, [isPPPAvailable, pppCoupon, isPPPEnabled, setMerchantCoupon])

  return (
    <article className="border-t border-gray-800 pt-8">
      <div className="flex grid-cols-5 flex-col md:grid">
        <aside className="col-span-2">
          {product.image && (
            <Image
              src={product.image.url}
              alt={product.title || `Product image`}
              width={300}
              height={300}
            />
          )}
        </aside>
        <div className="col-span-3 flex flex-col gap-3 py-5 pl-3 pr-8 pt-5 md:pt-12">
          <h3 className="font-text text-4xl font-bold">
            <Link
              href={{
                pathname: '/products/[slug]',
                query: {
                  slug: product.slug,
                },
              }}
              className="underline decoration-gray-600 underline-offset-4 transition hover:decoration-cyan-300 sm:flex-row"
            >
              <Balancer>{product.title}</Balancer>
            </Link>
          </h3>
          <div className="flex items-center gap-3 pt-2">
            {purchased ? (
              <div className="flex gap-1 text-lg text-cyan-300">
                <CheckCircleIcon className="w-5" /> Purchased
              </div>
            ) : (
              <>
                {status === 'success' ? (
                  <PriceDisplay
                    status={status}
                    formattedPrice={formattedPrice}
                  />
                ) : (
                  <div
                    role="status"
                    aria-label="loading price"
                    className="flex h-9 w-24 animate-pulse items-center justify-center rounded bg-gradient-to-l from-gray-700 to-gray-600"
                  >
                    <Spinner className="w-4" />
                  </div>
                )}
              </>
            )}
          </div>
          <p className="w-full text-gray-300">
            <Balancer>{product.description}</Balancer>
          </p>
          <h4 className="pt-5 text-sm font-semibold uppercase text-gray-300">
            Contents
          </h4>
          <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
            {product.modules.map((module) => {
              return (
                <div className="flex w-full flex-row items-center gap-2">
                  {module.image && (
                    <Image
                      src={module.image.url}
                      alt={module.title}
                      width={72}
                      height={72}
                    />
                  )}
                  <h4 className="w-full leading-tight text-gray-200">
                    <Balancer>{module.title}</Balancer>
                  </h4>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <footer className="flex items-center px-5 py-3"></footer>
    </article>
  )
}
