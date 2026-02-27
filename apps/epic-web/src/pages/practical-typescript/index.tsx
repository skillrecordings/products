import React from 'react'
import Layout from 'components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import AboutKent from 'components/contributor-bio'
import Image from 'next/image'
import Particles, {initParticlesEngine} from '@tsparticles/react'
import type {Engine} from '@tsparticles/engine'
import {loadSlim} from '@tsparticles/slim'
import {loadStarsPreset} from 'tsparticles-preset-stars'
import {trpc} from 'trpc/trpc.client'
import {useCoupon} from '@skillrecordings/skill-lesson/path-to-purchase/use-coupon'
import {useRouter} from 'next/router'
import {getProduct} from 'lib/products'
import {
  SanityProduct,
  SanityProductModule,
} from '@skillrecordings/commerce-server/dist/@types'
import {Pricing} from '@skillrecordings/skill-lesson/path-to-purchase/pricing'
import {getPricing} from '@skillrecordings/skill-lesson/lib/pricing'
import {PriceCheckProvider} from '@skillrecordings/skill-lesson/path-to-purchase/pricing-check-context'
import {Sparkles} from '../buy'
import {useTheme} from 'next-themes'
import {getAvailableBonuses} from 'lib/available-bonuses'
import Head from 'next/head'
import {getPage, type Page} from 'lib/pages'
import {MDXRemoteSerializeResult} from 'next-mdx-remote'
import serializeMDX from '@skillrecordings/skill-lesson/markdown/serialize-mdx'
import MDX from '@skillrecordings/skill-lesson/markdown/mdx'
import {WorkshopListItem} from 'components/workshop-list-item'

const productId = 'e2f18c94-012f-45b5-8962-4d5f320b510f'

const Index: NextPage<{
  product: SanityProduct
  page: Page
  products: SanityProduct[]
  bonuses: any[]
  mdx: MDXRemoteSerializeResult | null
}> = ({product, page, products, bonuses, mdx}) => {
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'

  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: product.productId,
    })
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
      id: product.productId,
      image: {
        url: 'https://res.cloudinary.com/epic-web/image/upload/v1695972887/coupon_2x.png',
        width: 132,
        height: 112,
      },
      title: product.title as string,
      description: product?.description,
    },
  )

  const couponId =
    commerceProps?.couponIdFromCoupon ||
    (validCoupon ? commerceProps?.couponFromCode?.id : undefined)

  const purchasedProductIds =
    commerceProps?.purchases?.map((purchase) => purchase.productId) || []

  const hasPurchased = purchasedProductIds.includes(productId)

  return (
    <>
      <Layout
        meta={{
          titleAppendSiteName: false,
          title: 'Ship Modern Full-Stack Web Applications',
          ogImage: {
            url: 'https://res.cloudinary.com/epic-web/image/upload/v1772194614/practical-typescript-bundle-card_2x.jpg',
          },
        }}
        navigationClassName=""
      >
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`RSS feed for ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
            href="/rss.xml"
          />
        </Head>
        <Header title={page?.title || ''} image={product.image} />
        <main className="">
          <Article workshops={product.modules} mdx={mdx} />
          <section className="relative mt-16 flex flex-col items-center justify-start dark:bg-black/30">
            <div className="flex flex-col items-center justify-center py-16">
              <h2 className="max-w-lg text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                Practical TypeScript: Foundations to Fluency
              </h2>
              <h3 className="max-w-lg pt-5 text-center text-lg text-gray-600 dark:text-gray-400">
                The most comprehensive guide to professional web development by
                Kent C. Dodds.
              </h3>
            </div>
            <div
              id="buy"
              className="relative flex flex-col items-center justify-start"
            >
              <Sparkles />
              {products
                ?.filter((product: any) => product.state !== 'unavailable')
                .map((product, i) => {
                  return (
                    <PriceCheckProvider
                      key={product.slug}
                      purchasedProductIds={purchasedProductIds}
                    >
                      <div data-pricing-container="" key={product.name}>
                        <Pricing
                          bonuses={bonuses}
                          allowPurchase={ALLOW_PURCHASE}
                          userId={commerceProps?.userId}
                          product={product}
                          purchased={purchasedProductIds.includes(
                            product.productId,
                          )}
                          index={i}
                          couponId={couponId}
                        />
                      </div>
                    </PriceCheckProvider>
                  )
                })}
            </div>
            {ALLOW_PURCHASE ? (
              <Image
                className="-mt-16 mb-16"
                src="https://res.cloudinary.com/total-typescript/image/upload/v1669928567/money-back-guarantee-badge-16137430586cd8f5ec2a096bb1b1e4cf_o5teov.svg"
                width={130}
                height={130}
                alt="30-Day Money Back Guarantee"
              />
            ) : null}
          </section>

          <AboutKent />
        </main>
      </Layout>
    </>
  )
}

const Article: React.FC<{
  workshops: SanityProductModule[]
  mdx: MDXRemoteSerializeResult | null
}> = ({workshops, mdx}) => {
  if (!mdx) return null

  return (
    <article className="prose mx-auto max-w-3xl px-5 pt-0 dark:prose-invert sm:prose-lg prose-headings:pt-8 prose-headings:font-bold prose-p:max-w-2xl prose-ul:list-inside prose-ul:pl-0 sm:pt-5 sm:prose-ul:list-outside">
      <MDX
        contents={mdx}
        components={{
          Workshops: () => (
            <ul className="sm:space-y-6">
              {workshops?.map((mod: any) => (
                <WorkshopListItem
                  key={mod.slug?.current || mod.slug}
                  title={mod.title}
                  slug={mod.slug?.current || mod.slug}
                  image={mod.image}
                  body={mod.body}
                  moduleType={mod.moduleType}
                />
              ))}
            </ul>
          ),
          WorkshopAppScreenshot,
        }}
      />
    </article>
  )
}

const Header = ({
  title,
  image,
}: {
  title: string
  image?: {url: string; alt?: string} | null
}) => {
  return (
    <header className="flex flex-col items-center px-5 pb-16">
      {image?.url && (
        <Image
          src={image.url}
          width={500}
          height={500}
          alt={image.alt || title}
          priority
          className="w-[280px] sm:w-[400px] lg:w-[500px]"
        />
      )}
      <h1 className="max-w-3xl text-center font-bold fluid-2xl sm:leading-tight sm:fluid-3xl lg:px-16">
        {title}
      </h1>
      <div className="mt-5 flex items-center gap-3">
        <Image
          src={require('../../../public/kent-c-dodds.png')}
          width={48}
          height={48}
          alt="Kent C. Dodds"
          className="rounded-full bg-gray-200 dark:bg-gray-800"
        />
        <span className="font-medium text-gray-600 dark:text-gray-400">
          Kent C. Dodds
        </span>
      </div>
    </header>
  )
}

export default Index

export const getStaticProps: GetStaticProps = async () => {
  const sanityProduct = await getProduct(productId as string)
  const sanityPage = await getPage('practical-typescript')
  const pricing = await getPricing('practical-typescript-pricing')

  const products = pricing && pricing.products
  const availableBonuses = await getAvailableBonuses()

  const mdx = sanityPage?.body ? await serializeMDX(sanityPage.body) : null

  return {
    props: {
      product: sanityProduct,
      page: sanityPage,
      mdx,
      products,
      bonuses: availableBonuses,
    },
    revalidate: 10,
  }
}

const WorkshopAppScreenshot = () => {
  const {theme} = useTheme()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="aspect-[1520/1090] h-full w-full">
      {mounted ? (
        <Image
          src={
            theme === 'light'
              ? 'https://res.cloudinary.com/epic-web/image/upload/v1696929540/workshop-app-screenshot-light-1_2x.png'
              : 'https://res.cloudinary.com/epic-web/image/upload/v1696929542/workshop-app-screenshot-1_2x.png'
          }
          width={1520}
          quality={100}
          height={1090}
          alt=""
          aria-hidden
          priority
        />
      ) : null}
    </div>
  )
}

export const ParticlesHeroEffect = () => {
  const [init, setInit] = React.useState(false)
  React.useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine)
      await loadStarsPreset(engine as any)
    }).then(() => {
      const timeout = setTimeout(() => {
        setInit(true)
      }, 750)
      return () => {
        clearTimeout(timeout)
      }
    })
  }, [])

  const particlesLoaded = (container: any) => {
    return container
  }

  return init ? (
    <>
      <Particles
        id="redParticles"
        particlesLoaded={particlesLoaded}
        className="absolute top-0 z-10 h-full w-full"
        options={{
          name: 'red',
          fullScreen: {
            enable: false,
          },
          preset: 'stars',
          retina_detect: true,
          background: {
            opacity: 0,
          },
          pauseOnOutsideViewport: true,
          zLayers: 1,
          particles: {
            shadow: {
              blur: 20,
              color: '#F85C1F',
              enable: true,
            },
            number: {
              value: 50,
            },
            size: {
              value: {min: 1, max: 5},
            },
            opacity: {
              value: {
                min: 0.1,
                max: 0.5,
              },
              animation: {
                enable: true,
                speed: 0.2,
              },
            },
            color: {
              value: '#F85C1F',
            },
            move: {
              direction: 'outside',
              center: {
                x: 50,
                y: 5,
              },
              enable: true,
              speed: {
                max: 0.6,
                min: 0.1,
              },
              straight: false,
              random: true,
            },
          },
        }}
      />
      <Particles
        id="blueParticles"
        particlesLoaded={particlesLoaded}
        className="absolute left-0 top-0 z-0 h-full w-full"
        options={{
          name: 'blue',
          fullScreen: {
            enable: false,
          },
          preset: 'stars',
          detectRetina: true,
          background: {
            opacity: 0,
          },
          pauseOnOutsideViewport: true,
          zLayers: 10,
          particles: {
            number: {
              value: 300,
            },
            zIndex: {
              value: {
                min: 1,
                max: 5,
              },
            },
            shadow: {
              blur: 20,
              color: '#67CBEB',
              enable: true,
            },
            size: {
              value: {min: 1, max: 3.2},
            },
            color: {
              value: '#67CBEB',
            },
            opacity: {
              value: {
                min: 0.1,
                max: 0.95,
              },
            },
            move: {
              direction: 'outside',
              center: {
                x: 50,
                y: 200,
              },
              enable: true,
              speed: {
                max: 0.7,
                min: 0.2,
              },
              straight: true,
            },
          },
        }}
      />
    </>
  ) : null
}
