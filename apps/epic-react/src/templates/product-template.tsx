import React from 'react'
import Layout from '@/components/app/layout'
import {useRouter} from 'next/router'
import Image from 'next/image'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {trpc} from '@/trpc/trpc.client'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {
  PriceCheckProvider,
  usePriceCheck,
} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import cx from 'classnames'
import {CheckCircleIcon} from '@heroicons/react/solid'
import Link from 'next/link'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'
import {ProductPageProps} from '@/pages/products/[slug]'

const ProductTemplate: React.FC<ProductPageProps> = ({
  product,
  mdx,
  allowPurchase,
  userId,
  couponFromCode,
  availableBonuses,
}) => {
  const router = useRouter()
  const title = product?.title || product?.name || 'Product Title'

  const {addPrice} = usePriceCheck()

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery(
      {
        ...router.query,
        productId: product.productId,
      },
      {
        onSuccess: (commerceProps) => {
          if (!commerceProps.purchases) return
          commerceProps.purchases.map((purchase) => {
            addPrice(
              {...purchase.product, unitPrice: purchase.totalAmount},
              purchase.productId,
            )
          })
        },
      },
    )

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const hasPurchased = purchasedProductIds.includes(product.productId)

  return (
    <Layout
      meta={{
        title,
        description: product.description,
        openGraph: {
          images: [
            {
              url: 'https://res.cloudinary.com/epic-web/image/upload/v1687853482/card-full-stack-workshop-series-vol-1_2x.png',
              alt: title,
            },
          ],
        },
      }}
    >
      <div className="flex justify-center pt-16">
        <Link
          href="/products"
          className="group mb-10 inline-flex gap-1 text-sm opacity-75 transition hover:opacity-100"
        >
          <span className="transition group-hover:-translate-x-1">←</span>{' '}
          <span>All Products</span>
        </Link>
      </div>
      <Header
        product={product as any}
        title={title}
        hasPurchased={hasPurchased}
      />
      <main id="buy" data-not-purchased-product="">
        {mdx && (
          <article className="mx-auto w-full max-w-screen-md px-10 py-8 md:py-10">
            <h1 className="text-7xl">HHHHHHH</h1>
            <Body mdx={mdx} />
          </article>
        )}

        <div
          id="pricing-tiers"
          className="mt-10 flex w-full items-center justify-center pb-16"
        >
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <div data-pricing-container="">
            <Pricing
              bonuses={availableBonuses}
              allowPurchase={product.state === 'active'}
              userId={userId}
              product={{...product, name: undefined, title: undefined} as any}
              purchased={purchasedProductIds.includes(product.productId)}
              couponId={couponId}
              couponFromCode={couponFromCode}
            />
          </div>
        </div>
        <Image
          className="mx-auto mb-16"
          src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
          width={130}
          height={130}
          alt="30-Day Money Back Guarantee"
        />
      </main>
    </Layout>
  )
}

type HeaderProps = {
  title?: string
  hasPurchased: boolean
  product: SanityProduct
}

const Header: React.FC<HeaderProps> = ({title, hasPurchased, product}) => {
  return (
    <header className="relative mx-auto w-full max-w-screen-lg px-2">
      <div className="relative flex w-full flex-col items-center justify-center pt-10 sm:pt-16">
        <div className="flex flex-grow flex-col items-center justify-center">
          {hasPurchased && (
            <Link
              href="/purchases"
              className="flex items-center gap-1.5 rounded-md bg-teal-400/30 py-0.5 pl-1.5 pr-2 font-medium text-teal-600 transition hover:bg-teal-400/40 dark:bg-teal-400/20 dark:text-teal-300 dark:hover:bg-teal-400/30"
            >
              <CheckCircleIcon className="h-5 w-5 text-teal-500 dark:text-teal-400" />{' '}
              Purchased
            </Link>
          )}
          {product?.image?.url && (
            <Image
              className="rounded-full"
              src={product.image.url}
              alt={product.name}
              width={200}
              height={200}
            />
          )}
          <h1
            className={cx('font-text pt-5 text-3xl font-semibold sm:text-4xl', {
              'pt-8': !hasPurchased,
              'pt-5': hasPurchased,
            })}
          >
            {title}
          </h1>
        </div>
      </div>
    </header>
  )
}

export default ProductTemplate

const mdxComponents = {}

const Body: React.FC<{mdx: MDXRemoteSerializeResult}> = ({mdx}) => {
  return (
    <article className="invert-svg prose mx-auto w-full max-w-none dark:prose-invert md:prose-lg prose-code:break-words md:prose-code:break-normal">
      <MDX contents={mdx} components={mdxComponents} />
    </article>
  )
}
