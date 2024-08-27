import type {GetServerSideProps} from 'next'
import Image from 'next/image'
import {getToken} from 'next-auth/jwt'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import {InView} from 'react-intersection-observer'

import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {getProduct, getAllActiveProducts} from '@/lib/products'
import Layout from '@/components/app/layout'
import Footer from '@/components/app/footer'
import LandingCopy from '@/components/landing-copy.mdx'
import Divider from '@/components/divider'
import PricingSection from '@/components/pricing-section'

import imgSky from '../../public/assets/sky@2x.jpg'
import imgBigPlanet from '../../public/assets/big-planet@2x.png'
import imgRingPlanet from '../../public/assets/ring-planet@2x.png'
import imgMoon from '../../public/assets/moon@2x.png'
import imgLandingRocket from '../../public/assets/landing-rocket@2x.png'

const DEFAULT_PRODUCT_ID = process.env.NEXT_PUBLIC_DEFAULT_PRODUCT_ID

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({req})
  const products = await getAllActiveProducts()
  const {props: commerceProps} = await propsForCommerce({
    query,
    token,
    products,
  })
  const defaultProduct = await getProduct(DEFAULT_PRODUCT_ID as string)
  const modules = defaultProduct?.modules
    ? defaultProduct.modules.slice(1, -1)
    : []

  return {
    props: {modules, commerceProps},
  }
}
const Home: React.FC<{modules: any[]; commerceProps: CommerceProps}> = ({
  modules,
  commerceProps,
}) => {
  const shouldReduceMotion = useReducedMotion()
  const {scrollY} = useScroll()
  const planetYRange = useTransform(
    scrollY,
    [48, shouldReduceMotion ? 48 : 330],
    [0, shouldReduceMotion ? 0 : 170],
  )
  const animatePlanetYMovement = useSpring(planetYRange, {
    stiffness: 50,
    damping: 20,
  })
  const ringPlanetXRange = useTransform(
    scrollY,
    [48, shouldReduceMotion ? 48 : 230],
    [0, shouldReduceMotion ? 0 : 100],
  )
  const animateRingPlanetXMovement = useSpring(ringPlanetXRange, {
    stiffness: 100,
    damping: 90,
  })
  const moonXRange = useTransform(
    scrollY,
    [48, shouldReduceMotion ? 48 : 230],
    [0, shouldReduceMotion ? 0 : -100],
  )
  const animateMoonXMovement = useSpring(moonXRange, {
    stiffness: 100,
    damping: 90,
  })
  const planetScaleRange = useTransform(
    scrollY,
    [150, shouldReduceMotion ? 150 : 210],
    [1, shouldReduceMotion ? 1 : 0.6],
  )
  const animatePlanetScale = useSpring(planetScaleRange, {
    stiffness: 50,
    damping: 90,
  })
  const rocketYRange = useTransform(
    scrollY,
    [8, shouldReduceMotion ? 8 : 300],
    [0, shouldReduceMotion ? 0 : -160],
  )
  const animateRocketMovement = useSpring(rocketYRange, {
    stiffness: 100,
    damping: 20,
  })
  const moduleImageVariants = {
    visible: {opacity: 1, scale: 1, y: 0},
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
  }

  return (
    <Layout>
      <main>
        <section className="relative">
          <div className="pb-16">
            <div
              className="absolute inset-0 z-0 h-[860px] w-full bg-background bg-cover bg-scroll bg-[50%_top] bg-no-repeat lg:bg-fixed"
              style={{backgroundImage: `url("${imgSky.src}")`}}
            />
            <div className="relative flex h-[720px] flex-col items-center justify-center text-center sm:h-[860px]">
              <div className="flex h-full flex-col items-center justify-center pt-0 sm:pt-10">
                <div className="mb-0 w-32 sm:mb-10 sm:w-40">
                  <Image
                    src="/assets/five-stars@2x.png"
                    alt="5 out of 5 stars"
                    width={210}
                    height={33}
                  />
                </div>
                <div className="min-h-[173px]">
                  <h1 className="px-5 pt-8 text-2xl font-semibold leading-normal text-white transition-opacity sm:pt-0 sm:leading-tight md:max-w-3xl md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                    Confidently Ship Well-Architected Production Ready React
                    Apps Like a Pro
                  </h1>
                </div>
              </div>
              <div className="flex h-full w-full items-end justify-center">
                <div className="relative -bottom-[130px] z-10 mb-0 h-full max-h-[100px] w-full sm:-bottom-[50px] sm:max-h-[240px] md:-bottom-[65px] lg:-bottom-[70px]">
                  <Image src={imgBigPlanet} alt="big planet" fill />
                </div>
              </div>
              <motion.div
                className="absolute bottom-[20%] left-[5px] w-full max-w-[110px] sm:left-[20px] sm:max-w-[220px] md:left-[10vw]"
                style={{
                  x: animateRingPlanetXMovement,
                  y: animatePlanetYMovement,
                  scale: animatePlanetScale,
                  opacity: animatePlanetScale,
                }}
              >
                <Image
                  src={imgRingPlanet}
                  alt="ring planet"
                  width={512}
                  height={258}
                />
              </motion.div>
              <motion.div
                className="absolute inset-x-0 -bottom-[100px] z-20 mx-auto max-w-[130px] sm:max-w-[150px]"
                style={{y: animateRocketMovement}}
              >
                <Image
                  src={imgLandingRocket}
                  alt="rocket"
                  width={329}
                  height={1184}
                />
              </motion.div>
              <motion.div
                className="absolute bottom-[20%] right-[10px] w-full max-w-[80px] sm:right-[10vw] sm:max-w-[120px]"
                style={{
                  x: animateMoonXMovement,
                  y: animatePlanetYMovement,
                  scale: animatePlanetScale,
                  opacity: animatePlanetScale,
                }}
              >
                <Image src={imgMoon} alt="moon" width={274} height={268} />
              </motion.div>
            </div>
          </div>
        </section>
        <section className="mx-auto mt-12 w-full max-w-screen-lg px-4 py-8 sm:mt-0 sm:px-8">
          <div className="prose mx-auto lg:prose-xl">
            <LandingCopy />
          </div>
        </section>
        <div className="mx-auto max-w-screen-lg px-5 sm:px-8">
          <h2 className="mt-20 text-center text-4xl font-semibold">
            The Workshops in Epic React Include:
          </h2>
          <Divider className="mb-16 mt-8" />
          <ul>
            {modules.map((module, i) => {
              return (
                <InView key={module.slug.current} threshold={0.2}>
                  {({inView, ref, entry}) => {
                    return (
                      <li
                        ref={ref}
                        className="my-5 grid grid-cols-1 items-center gap-8 rounded-lg px-5 py-10 sm:my-32 sm:grid-cols-3 sm:grid-rows-1 sm:px-0 sm:py-0"
                      >
                        <motion.div
                          animate={inView ? 'visible' : 'hidden'}
                          variants={moduleImageVariants}
                          transition={{mass: 0.7, type: 'spring'}}
                          className="mx-auto flex w-full items-center justify-center px-20 sm:col-span-1 sm:row-start-1 sm:px-5"
                        >
                          {module?.image && module?.slug?.current && (
                            <Image
                              src={module.image}
                              alt={module.slug.current}
                              width={512}
                              height={512}
                            />
                          )}
                        </motion.div>
                        <div className="sm:col-span-2 sm:row-start-1">
                          <h2 className="mb-3 text-center text-4xl font-semibold leading-tight sm:text-left">
                            {module.title}
                          </h2>
                          <h3 className="mb-5 text-center text-lg font-medium leading-normal text-react sm:text-left lg:text-xl">
                            {module.tagline}
                          </h3>
                          <div className="mb-5 text-center text-lg font-medium leading-normal sm:text-left lg:text-lg lg:leading-[1.77]">
                            {module.body}
                          </div>
                        </div>
                      </li>
                    )
                  }}
                </InView>
              )
            })}
          </ul>
        </div>
        <div className="my-16 bg-er-gray-100 pb-16 pt-8">
          <div className="py-12 lg:py-16">
            <div className="px-5 text-center">
              <h1 className="text-balance py-4 text-4xl font-extrabold leading-9 text-text sm:text-[2.75rem] sm:leading-10 lg:text-[3.5rem] lg:leading-none">
                Join over 7000 Developers and Get Really Good At React
              </h1>
              <p className="mx-auto mt-5 max-w-4xl text-xl text-react sm:text-2xl">
                The beautiful thing about learning is that nobody can take it
                away from you.
              </p>
            </div>
            <div className="mt-16 lg:mt-32">
              <PricingSection
                commerceProps={commerceProps}
                className="mb-28 mt-12 md:mt-14 lg:mb-32 lg:mt-16"
              />
            </div>
          </div>
          <div className="mx-auto h-48 w-48">
            <Image
              src="/assets/money-back-guarantee-badge.svg"
              alt="30 day money back guarantee"
              width={192}
              height={192}
            />
          </div>
        </div>
      </main>
      <Footer />
    </Layout>
  )
}

export default Home
