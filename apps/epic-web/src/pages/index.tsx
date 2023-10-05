import React, {useCallback} from 'react'
import Layout from 'components/app/layout'
import {prisma} from '@skillrecordings/database'
import {getPage} from 'lib/pages'
import type {GetServerSideProps, GetStaticProps, NextPage} from 'next'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import AboutKent from 'components/about-kent'
import Balancer from 'react-wrap-balancer'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import {track} from 'utils/analytics'
import Image from 'next/image'
import LandingCopy from 'components/landing-copy.mdx'
import {loadFull} from 'tsparticles'
import Particles from 'react-particles'
import {loadStarsPreset} from 'tsparticles-preset-stars'
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
import {SanityProduct} from '@skillrecordings/commerce-server/dist/@types'

const productId = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

const Index: NextPage<{product: SanityProduct}> = ({product}) => {
  const router = useRouter()
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
      <Layout navigationClassName="">
        <Header />
        <main className="">
          {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
          <Article />
          <Subscribe subscriber={subscriber} />
          <AboutKent />
        </main>
      </Layout>
    </>
  )
}

const Article = () => {
  return (
    <article className="prose mx-auto max-w-none px-5 pt-0 dark:prose-invert sm:prose-xl md:prose-xl prose-headings:text-center prose-headings:font-bold prose-p:mx-auto prose-p:max-w-2xl sm:pt-16">
      <LandingCopy />
    </article>
  )
}

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance])
}

const Header = () => {
  const particlesInit = useCallback(async (engine: any) => {
    await loadStarsPreset(engine)
    // await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(async (container: any) => {
    await container
  }, [])

  const ref = React.useRef(null)
  const {scrollYProgress} = useScroll({target: ref})
  const shipsParallax = useParallax(scrollYProgress, 50)
  const foregroundMotionValue = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const planetTransform = useTransform(scrollYProgress, [0, 1], [1, 1.5])
  const planetAnimation = useSpring(planetTransform, {mass: 0.1})
  return (
    <header
      ref={ref}
      className="relative flex min-h-[108vh] flex-col items-center justify-start overflow-hidden bg-black"
    >
      <div className="absolute top-[22vh] z-40 mx-auto text-center xl:top-[190px]">
        <h1 className="max-w-3xl px-5 font-bold text-white shadow-black drop-shadow-lg fluid-3xl sm:leading-tight lg:px-16">
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
      <motion.div className="flex h-full w-full items-start justify-center">
        <Image
          className="absolute z-20 flex w-[500px] -translate-y-10 items-start justify-center sm:w-[700px] sm:-translate-y-24"
          src={require('../../public/assets/hero/small-planet-compressed.png')}
          width={800}
          alt=""
          quality={100}
          aria-hidden
          priority
          placeholder="blur"
        />
      </motion.div>
      <motion.div className="absolute bottom-[25%] z-20 mx-auto w-[130px] sm:w-[180px] lg:w-[200px]">
        <Image
          src={require('../../public/assets/hero/ships-compressed.png')}
          width={250}
          alt=""
          quality={100}
          aria-hidden
          priority
          placeholder="blur"
        />
      </motion.div>
      <div className="absolute bottom-0 left-0 z-30 h-32 w-full bg-gradient-to-b from-transparent dark:to-background" />
      <Particles
        id="tsparticles2"
        init={particlesInit}
        loaded={particlesLoaded}
        canvasClassName="absolute top-0 z-0 w-full h-full z-10"
        className="absolute top-0 z-10 h-full w-full"
        options={{
          fullScreen: {
            enable: false,
          },
          preset: 'stars',
          retina_detect: true,
          background: {
            opacity: 0,
          },
          pauseOnOutsideViewport: true,
          zLayers: 50,

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
                minimumValue: 0.1,
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
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        canvasClassName="absolute left-0 top-0 z-0 h-full w-full"
        className="absolute left-0 top-0 z-0 h-full w-full"
        options={{
          fullScreen: {
            enable: false,
          },
          preset: 'stars',
          retina_detect: true,
          background: {
            opacity: 0,
          },
          pauseOnOutsideViewport: true,
          zLayers: 10,
          particles: {
            number: {
              value: 300,
              density: {
                enable: true,
                area: 200,
              },
            },
            zIndex: {
              random: true,
              value: {
                min: 1,
                max: 50,
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
              // value: '#67CBEB',
              value: {
                h: 195,
                s: 77,
                l: 66,
              },
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
      className="pb-32 pt-10"
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

  const purchaseCount = await prisma.purchase.count({
    where: {
      productId,
      status: {
        in: ['VALID', 'RESTRICTED'],
      },
    },
  })

  return {
    props: {
      product: sanityProduct,
      purchaseCount,
    },
  }
}
