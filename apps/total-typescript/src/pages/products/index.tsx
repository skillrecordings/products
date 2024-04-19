import Layout from '@/components/app/layout'
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
import {CheckIcon} from '@heroicons/react/solid'
import ReactMarkdown from 'react-markdown'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {getAllProducts} from '@skillrecordings/skill-lesson/lib/products'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  const token = await getToken({req})
  const products = await getAllProducts()
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
      <header className="mx-auto flex w-full max-w-4xl flex-col justify-center px-5 pb-5 pt-32 sm:pt-40">
        <h1 className="mb-4 text-center font-heading text-4xl font-semibold sm:text-5xl">
          Total TypeScript Products
        </h1>
        <h2 className="text-center text-gray-300 sm:text-xl">
          <Balancer>
            All {process.env.NEXT_PUBLIC_SITE_TITLE} products that you can buy
            today to level up at TypeScript.
          </Balancer>
        </h2>
      </header>
      <main
        id="products-index-page"
        className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-5 py-16"
      >
        <PriceCheckProvider purchasedProductIds={purchasedProductIds}>
          <Products products={products} userId={userId} purchases={purchases} />
        </PriceCheckProvider>
      </main>
      <Image
        fill
        aria-hidden="true"
        alt=""
        src={require('../../../public/assets/landing/bg-divider-3.png')}
        className="-z-10 object-contain object-top"
      />
    </Layout>
  )
}

export default ProductsIndex

const Products: React.FC<CommerceProps> = ({products, userId, purchases}) => {
  const [isPPPEnabled, setIsPPPEnabled] = React.useState(false)
  const {setMerchantCoupon} = usePriceCheck()

  return (
    <>
      {products.map((product) => {
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
      {/* <div className="flex items-center justify-end w-full pt-3 pb-16 border-t border-gray-800">
        <label>
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
      </div> */}
    </>
  )
}

type ProductTeaserProps = {
  product: SanityProduct
  userId?: string
  purchases: Purchase[] | undefined
  isPPPEnabled?: boolean
}

const BONUS_SLUGS = new Set(['typescript-expert-interviews'])

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
      setMerchantCoupon(pppCoupon as any)
    }
  }, [isPPPAvailable, pppCoupon, isPPPEnabled, setMerchantCoupon])

  return (
    <>
      {(product.state === 'active' ||
        (product.state === 'unavailable' && purchased)) && (
        <div
        // className="rounded-md border border-gray-700/20 bg-gray-800/20 p-8 px-2 py-0.5 shadow-2xl"
        >
          <div className="mt-4 flex grid-cols-5 flex-col md:grid">
            <aside className="col-span-2">
              {product.image && (
                <Image
                  src={product.image.url}
                  alt={product.title || `Product image`}
                  width={300}
                  height={300}
                  className="mx-auto"
                />
              )}
            </aside>
            <div className="col-span-3 flex flex-col gap-3 py-5 pt-5 sm:pl-3 sm:pr-8 md:pt-5">
              <div className="self-center font-mono text-xs font-semibold uppercase text-cyan-300 sm:self-start">
                {product.slug === 'core-volume-react-bundle' ? (
                  <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                    FEATURED PRODUCT
                  </span>
                ) : product.slug === 'advanced-react-with-typescript' ? (
                  <span className="mr-3 rounded-full bg-cyan-300 px-2 py-0.5 font-sans font-semibold uppercase text-black">
                    NEW
                  </span>
                ) : null}
              </div>
              <h3 className="text-center font-text text-3xl font-bold sm:text-left sm:text-4xl">
                <Link
                  href={{
                    pathname: '/products/[slug]',
                    query: {
                      slug: product.slug,
                    },
                  }}
                  className="decoration-cyan-300 underline-offset-4 transition hover:underline sm:flex-row"
                  onClick={() => {
                    track('clicked view product', {
                      product: product.slug,
                    })
                  }}
                >
                  <Balancer>{product.title}</Balancer>
                </Link>
              </h3>
              <div className="flex flex-col-reverse items-center justify-center gap-3 pt-2 sm:flex-row sm:justify-start">
                <div className="w-full sm:w-auto">
                  <Link
                    href={{
                      pathname: '/products/[slug]',
                      query: {
                        slug: product.slug,
                      },
                    }}
                    className="group flex items-center justify-center gap-1 rounded bg-gray-800 px-4 py-2 font-medium text-cyan-300 transition hover:bg-gray-700/75 sm:inline-flex sm:text-lg"
                    onClick={() => {
                      track('clicked view product', {
                        product: product.slug,
                        location: 'button',
                      })
                    }}
                  >
                    View{' '}
                    <span className="relative transition group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-3 sm:justify-start">
                  {purchased ? (
                    <div className="flex gap-1 text-lg text-gray-300">
                      <CheckCircleIcon className="w-5" /> Purchased
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="w-full">
                <ReactMarkdown className="prose prose-sm w-full max-w-none pt-5 sm:prose-lg prose-p:text-gray-300">
                  {product.description || ''}
                </ReactMarkdown>
              </div>
              {product.modules?.length && (
                <>
                  <h4 className="pt-5 text-sm font-semibold uppercase text-gray-300">
                    Includes
                  </h4>
                  <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
                    {product.modules.map((module) => {
                      return (
                        <Link
                          href={{
                            pathname: BONUS_SLUGS.has(module.slug)
                              ? '/bonuses/[slug]'
                              : '/workshops/[slug]',
                            query: {
                              slug: module.slug,
                            },
                          }}
                          className="group flex w-full flex-row items-center gap-2"
                        >
                          {module.image && (
                            <Image
                              src={module.image.url}
                              alt={module.title}
                              width={72}
                              height={72}
                            />
                          )}
                          <span className="w-full leading-tight text-gray-200 transition group-hover:text-white group-hover:underline">
                            {BONUS_SLUGS.has(module.slug) ? (
                              <h3 className="font-semibold text-yellow-200">
                                Bonus🎁
                              </h3>
                            ) : null}
                            <Balancer>{module.title}</Balancer>
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </>
              )}
              <h4 className="pt-5 text-sm font-semibold uppercase text-gray-300">
                Features
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {product.features?.map((feature) => {
                  return (
                    <div className="flex items-center space-x-2 text-base text-gray-300">
                      <CheckIcon
                        className="h-4 w-4 text-cyan-300"
                        aria-hidden="true"
                      />{' '}
                      <span>{feature.value}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <footer className="flex items-center px-5 py-3"></footer>
        </div>
      )}
    </>
  )
}
