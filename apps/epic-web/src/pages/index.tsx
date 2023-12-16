import React, {useCallback} from 'react'
import Layout from 'components/app/layout'
import type {GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/about-kent'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import LandingCopy from 'components/landing-copy.mdx'
import Particles, {initParticlesEngine} from '@tsparticles/react'
import type {Engine} from '@tsparticles/engine'
import {loadSlim} from '@tsparticles/slim'
import KentImage from '../../public/kent-c-dodds.png'
import {loadStarsPreset} from 'tsparticles-preset-stars'
import fs from 'fs'
import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
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
import {Sparkles} from './buy'
import ReactMarkdown from 'react-markdown'
import {useTheme} from 'next-themes'
import Link from 'next/link'
import MuxPlayer from '@mux/mux-player-react'
import '@mux/mux-player/themes/minimal'
import {getAvailableBonuses} from 'lib/available-bonuses'
import {XIconTwitter} from 'components/x-icon'
import path from 'path'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@skillrecordings/ui'

const productId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

const Index: NextPage<{
  product: SanityProduct
  products: SanityProduct[]
  bonuses: any[]
  interviewImages: string[]
}> = ({product, products, bonuses, interviewImages}) => {
  const router = useRouter()
  const ALLOW_PURCHASE =
    router.query.allowPurchase === 'true' || product.state === 'active'
  const {subscriber, loadingSubscriber} = useConvertkit()
  const {data: commerceProps, status: commercePropsStatus} =
    trpc.pricing.propsForCommerce.useQuery({
      ...router.query,
      productId: product.productId,
    })
  const {redeemableCoupon, RedeemDialogForCoupon, validCoupon} = useCoupon(
    commerceProps?.couponFromCode,
    {
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
        }}
        navigationClassName=""
      >
        <Header />
        <main className="">
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <Article
            workshops={product.modules}
            interviewImages={interviewImages}
          />
          {true ? (
            <section className="relative mt-16 flex flex-col items-center justify-start dark:bg-black/30">
              <div className="flex flex-col items-center justify-center py-16">
                <h2 className="max-w-lg text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
                  <Balancer>
                    Become a Professional Full Stack Web Developer
                  </Balancer>
                </h2>
                <h3 className="max-w-lg pt-5 text-center text-lg text-gray-600 dark:text-gray-400">
                  <Balancer>
                    The most comprehensive guide to professional web development
                    by Kent C. Dodds.
                  </Balancer>
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
          ) : (
            <Subscribe subscriber={subscriber} />
          )}
          <AboutKent />
        </main>
      </Layout>
    </>
  )
}

const Article: React.FC<{
  workshops: SanityProductModule[]
  interviewImages: string[]
}> = ({workshops, interviewImages}) => {
  return (
    <article className="prose mx-auto max-w-3xl px-5 pt-0 dark:prose-invert sm:prose-lg prose-headings:pt-8 prose-headings:font-bold prose-p:max-w-2xl prose-ul:pl-0 sm:pt-16">
      <LandingCopy
        components={{
          // ...linkedHeadingComponents,
          Testimonial: ({children, author, url}) => {
            return (
              <blockquote className="relative !my-0 flex flex-col justify-between rounded-md border-l-0 bg-white !p-5 not-italic text-foreground dark:bg-white/5 lg:!p-8">
                <div className="prose dark:prose-invert sm:prose-lg prose-p:font-medium">
                  {children}
                </div>
                <div className="mt-8 flex w-full items-center justify-between gap-1.5 text-base">
                  <div className="flex items-center gap-2">
                    {author.image ? (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={48}
                        height={48}
                        className="!my-0 rounded-full"
                      />
                    ) : (
                      <span className="opacity-75">—</span>
                    )}
                    <span className="opacity-75">{author.name}</span>
                  </div>
                  {url && (
                    <a
                      href={url}
                      className=""
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <XIconTwitter className="h-5 w-5 text-foreground opacity-50 transition hover:opacity-100" />
                    </a>
                  )}
                </div>
              </blockquote>
            )
          },
          PromoVideo: () => {
            return (
              <MuxPlayer
                theme="minimal"
                playbackId="cqjuBzq74nu4ZlksxTXz7IKqxfaWaR1KjyGQLAc4nQ4"
                accentColor="#3b82f6"
                className="w-full rounded"
                poster="https://res.cloudinary.com/epic-web/image/upload/v1697358228/promo-video-poster.jpg"
              />
            )
          },
          WorkshopAppScreenshot,
          AboutKent: ({children}) => {
            return (
              <div className="rounded-lg border bg-white px-8 py-3 dark:bg-white/5 sm:px-10 sm:py-5">
                <Image
                  src={KentImage}
                  width={150}
                  height={150}
                  alt="Kent C. Dodds"
                  className="float-right ml-5 aspect-square w-32 rounded-full bg-white/5 sm:ml-10 sm:w-auto"
                  style={{
                    shapeOutside: 'circle()',
                  }}
                />
                <div className="pt-2">{children}</div>
              </div>
            )
          },
          InterviewsWithExpertsVol1: ({
            slug,
            title,
            image,
            meta,
            features,
            path = 'bonuses',
            children,
          }) => {
            return (
              <li
                id={slug}
                key={slug}
                className="not-prose flex flex-col-reverse items-center justify-between gap-8 pb-16 sm:-mx-10 lg:-mx-24 lg:flex-row lg:items-center"
              >
                <div className="flex flex-col items-center sm:items-start">
                  <div className="mb-2 inline-flex rounded-full bg-amber-600 px-2 py-0.5 font-mono text-sm font-semibold uppercase text-background dark:bg-yellow-300">
                    🎁 bonus
                  </div>
                  <h3 className="text-center text-2xl font-bold lg:text-left lg:text-3xl">
                    <Link
                      href={`/${path}/${slug}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="pt-2 text-center font-mono text-sm uppercase lg:text-left ">
                    {meta}
                  </p>
                  <div className="mt-5 max-w-md space-y-4 text-base leading-relaxed opacity-90">
                    {children}
                  </div>
                  <Link
                    href={`/${path}/${slug}`}
                    target="_blank"
                    className="mt-3 inline-flex gap-1 py-2 text-base opacity-75 transition hover:opacity-100"
                  >
                    Read more <span aria-hidden>↗︎</span>
                  </Link>
                </div>
                {interviewImages && (
                  <div className="group grid max-w-[430px] grid-cols-5 gap-1">
                    {interviewImages.map((image) => {
                      return (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger className="cursor-default">
                              <Image
                                className="rounded opacity-75 transition hover:opacity-100"
                                src={require(`../../public/assets/interviews/${image}`)}
                                alt=""
                                aria-hidden
                                width={100}
                                height={100}
                                placeholder="blur"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              {image.replace('-', ' ').replace('.png', '')}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })}
                  </div>
                )}
                {/* {image && (
                  <Link
                    href={`/${path}/${slug}`}
                    target="_blank"
                    className="flex-shrink-0"
                  >
                    <Image src={image} width={400} height={400} alt={title} />
                  </Link>
                )} */}
              </li>
            )
          },
          Workshop: ({
            slug,
            title,
            image,
            meta,
            features,
            path = 'workshops',
          }) => {
            return (
              <li
                id={slug}
                key={slug}
                className="not-prose flex flex-col items-center gap-8 pb-16 sm:-mx-10 lg:-mx-16 lg:flex-row lg:items-start"
              >
                {image && (
                  <Link
                    href={`/${path}/${slug}`}
                    target="_blank"
                    className="flex-shrink-0"
                  >
                    <Image src={image} width={300} height={300} alt={title} />
                  </Link>
                )}
                <div className="flex flex-col items-center sm:items-start">
                  <h3 className="text-center text-2xl font-bold lg:text-left lg:text-3xl">
                    <Link
                      href={`/workshops/${slug}`}
                      target="_blank"
                      className="hover:underline"
                    >
                      {title}
                    </Link>
                  </h3>
                  <p className="pt-2 text-center font-mono text-sm uppercase lg:text-left ">
                    {meta}
                  </p>
                  <ul className="pt-8">
                    {features.map((feature: any) => {
                      return (
                        <li
                          className='py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300'
                          key={feature}
                        >
                          <ReactMarkdown
                            unwrapDisallowed
                            disallowedElements={['p']}
                          >
                            {feature}
                          </ReactMarkdown>
                        </li>
                      )
                    })}
                  </ul>
                  <Link
                    href={`/workshops/${slug}`}
                    target="_blank"
                    className="mt-3 inline-flex gap-1 py-2 text-base opacity-75 transition hover:opacity-100"
                  >
                    Read more <span aria-hidden>↗︎</span>
                  </Link>
                </div>
              </li>
            )
          },
          li: ({children}) => {
            return (
              <li className='list-none py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300 sm:before:-ml-2'>
                {children}
              </li>
            )
          },
        }}
      />
    </article>
  )
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const Header = () => {
  return (
    <header className="relative flex min-h-[108vh] flex-col items-center justify-start overflow-hidden bg-black">
      <div className="absolute top-[120px] z-40 mx-auto text-center sm:top-[14vh] xl:top-[16vh]">
        <h1 className="max-w-3xl px-5 font-bold text-white shadow-black drop-shadow-lg fluid-2xl sm:leading-tight sm:fluid-3xl lg:px-16">
          <span className="inline-flex pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-orange-300 shadow-black drop-shadow-md">
            Everything You Need to Know to
          </span>
          <div className="shadow-black drop-shadow-lg">
            <Balancer>Ship Modern Full-Stack Web Applications</Balancer>
          </div>
        </h1>
      </div>
      <div
        className="absolute left-0 top-0 z-20 h-full w-full"
        style={{
          backgroundImage:
            'radial-gradient(transparent, transparent, black, black)',
        }}
      />
      <Image
        src={require('../../public/assets/hero/hero-front-compressed.png')}
        fill
        className="z-20 mx-auto object-cover object-bottom 2xl:object-fill"
        alt=""
        quality={100}
        aria-hidden
        priority
        placeholder="empty"
      />
      <div className="flex h-full w-full items-start justify-center">
        <Image
          className="absolute z-20 flex w-[500px] -translate-y-10 items-start justify-center sm:w-[600px] sm:-translate-y-24"
          src={require('../../public/assets/hero/small-planet-compressed.png')}
          width={800}
          alt=""
          quality={100}
          aria-hidden
          priority
          placeholder="blur"
        />
      </div>
      <div className="absolute bottom-[25%] z-20 mx-auto w-[130px] sm:w-[180px] lg:w-[200px]">
        <Image
          src={require('../../public/assets/hero/ships-compressed.png')}
          width={250}
          alt=""
          quality={100}
          aria-hidden
          priority
          placeholder="blur"
        />
      </div>
      <div className="absolute bottom-0 left-0 z-30 h-32 w-full bg-gradient-to-b from-transparent dark:to-background" />
      <ParticlesHeroEffect />
    </header>
  )
}

type SubscribeProps = {
  subscriber: any
}

const Subscribe: React.FC<SubscribeProps> = ({subscriber}) => {
  return (
    <section
      aria-label="Newsletter sign-up"
      className="px-5 pb-32 pt-10"
      id="primary-newsletter-cta"
    >
      {!subscriber ? (
        <PrimaryNewsletterCta
          onSubmit={() => {
            track('subscribed from landing page')
          }}
        />
      ) : (
        <div className="text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          You're subscribed <span aria-hidden="true">✧</span> Thanks!
        </div>
      )}
    </section>
  )
}

export default Index

export const getStaticProps: GetStaticProps = async () => {
  const sanityProduct = await getProduct(productId as string)
  const pricing = await getPricing('primary')

  const products = pricing && pricing.products
  const availableBonuses = await getAvailableBonuses()
  // get images from public folder
  const interviewImages = await readDirectoryContents('assets/interviews')

  return {
    props: {
      product: sanityProduct,
      products,
      bonuses: availableBonuses,
      interviewImages,
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

async function readDirectoryContents(directoryPath: string) {
  const directory = path.join(process.cwd(), 'public', directoryPath)
  try {
    const files = await fs.promises.readdir(directory)
    const filteredFiles = files.filter((file) => file !== '.DS_Store')
    return filteredFiles
  } catch (error) {
    console.error(`Error reading directory: ${directoryPath}`, error)
    return []
  }
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
