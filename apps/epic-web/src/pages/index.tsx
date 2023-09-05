import React, {useCallback} from 'react'
import Layout from 'components/app/layout'
import {getPage} from 'lib/pages'
import type {NextPage} from 'next'
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

const Index: NextPage<any> = ({page}) => {
  const {subscriber, loadingSubscriber} = useConvertkit()

  return (
    <Layout navigationClassName="">
      <Header />
      <main className="">
        <Article />
        <Subscribe subscriber={subscriber} />
        <AboutKent />
      </main>
    </Layout>
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
  const planetScale = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const planetAnimation = useSpring(planetScale, {mass: 0.1})
  return (
    <header
      ref={ref}
      className="relative flex min-h-[108vh] flex-col items-center justify-start overflow-hidden bg-black"
    >
      <div className="absolute top-[22vh] z-40 mx-auto text-center xl:top-[190px]">
        <h1 className="max-w-3xl px-5 font-bold text-white shadow-black drop-shadow-lg fluid-3xl sm:leading-tight lg:px-16">
          <span className="inline-flex pb-4 font-sans text-sm font-semibold uppercase tracking-wider text-orange-300">
            Everything You Need to Know to
          </span>
          <Balancer>Ship Modern Full-Stack Web Applications</Balancer>
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
      <motion.div className="absolute z-20 flex w-[600px] -translate-y-16 items-start justify-center sm:w-[700px] sm:-translate-y-24">
        <Image
          src={require('../../public/assets/hero/small-planet-compressed.png')}
          width={800}
          alt=""
          quality={100}
          aria-hidden
          priority
          placeholder="blur"
        />
      </motion.div>
      <motion.div className="absolute bottom-[25%] z-20 mx-auto w-[130px] sm:w-[250px]">
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

          particles: {
            shadow: {
              blur: 20,
              color: '#67CBEB',
              enable: true,
            },
            size: {
              value: {min: 1.5, max: 3},
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
                y: 100,
              },
              enable: true,
              speed: {
                max: 0.9,
                min: 0.2,
              },
              straight: false,
              random: true,
            },
          },
        }}
      />
      <Particles
        id="tsparticles2"
        init={particlesInit}
        loaded={particlesLoaded}
        canvasClassName="absolute top-0 z-0 w-full h-full"
        className="absolute top-0 z-0 h-full w-full"
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
          zLayers: 1,
          particles: {
            number: {
              value: 60,
            },
            size: {
              value: {min: 0.5, max: 3.5},
            },
            color: {
              value: '#F85C1F',
            },
            move: {
              direction: 'outside',
              center: {
                x: 50,
                y: 0,
              },
              enable: true,
              speed: {
                max: 1.5,
                min: 0.3,
              },
              straight: false,
              random: true,
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
