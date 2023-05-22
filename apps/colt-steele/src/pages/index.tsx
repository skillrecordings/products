import React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'
import Image from 'next/image'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'

import {
  easeInOut,
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'

const Home: NextPage = () => {
  const shouldReduceMotion = useReducedMotion()
  const motionProps = shouldReduceMotion
    ? {}
    : {
        transition: {
          ease: 'easeOut',
          duration: 0.5,
        },
        initial: {y: 50, opacity: 0},
        whileInView: {
          y: 0,
          opacity: 100,
        },
      }
  const skeletonRef = React.useRef(null)
  const {scrollYProgress} = useScroll({
    target: skeletonRef,
    offset: ['start end', 'end start'],
  })

  const x = useTransform(scrollYProgress, [0, 1], ['-20%', '0%'], {
    ease: easeInOut,
  })

  return (
    <Layout
      className="overflow-x-hidden"
      navigationProps={{
        className: 'sm:px-6',
        wrapperClassName: 'bg-transparent',
      }}
    >
      <div className="relative z-10 bg-gray-100 sm:px-5 sm:pb-5">
        <header className="bg-brand-bone flex items-center justify-center sm:h-[calc(100vh-2.5rem)] h-screen overflow-hidden relative">
          <Image
            src={require('../../public/assets/hero@2x.png')}
            alt=""
            aria-hidden
            fill
            priority
            quality={100}
            placeholder="blur"
            className="pointer-events-none select-none sm:object-contain object-cover"
          />
        </header>
      </div>
      <main className="font-serif">
        <article className="px-5 prose prose-lg sm:prose-2xl max-w-2xl mx-auto sm:prose-p:font-light prose-p:text-brand-cola prose-headings:text-brand-cola sm:pt-24 pt-10">
          <motion.p
            {...motionProps}
            className="sm:first-letter:text-7xl first-letter:text-6xl first-letter:text-brand-red first-letter:font-bold sm:first-letter:mt-1.5 first-letter:mt-1 first-letter:pr-4 first-letter:float-left"
          >
            I am a developer with a serious love for teaching. I've spent the
            last few years teaching people to program at 2 different immersive
            bootcamps where I've helped hundreds of people become web developers
            and change their lives. My graduates work at companies like Google,
            Salesforce, and Square.
          </motion.p>
          <motion.div {...motionProps} className="mix-blend-multiply">
            <Image
              priority
              src={require('../../public/assets/d-1@2x.png')}
              alt=""
              aria-hidden
              className=" mx-auto sm:py-16 py-8"
              width={580}
              height={100}
            />
          </motion.div>
          <motion.p {...motionProps}>
            Most recently, I led Galvanize's SF's 6 month immersive program as
            Lead Instructor and Curriculum Director. After graduating from my
            class, 94% of my students went on to receive full-time developer
            roles. I also worked at Udacity as a Senior Course Developer on the
            web development team where I got to reach thousands of students
            daily.
          </motion.p>
          <motion.div
            {...motionProps}
            className="not-prose relative py-16 sm:px-40 px-20 text-center sm:text-4xl text-2xl italic bg-white -mx-16 sm:my-48 my-24"
          >
            <Image
              priority
              src={require('../../public/assets/quote-1@2x.png')}
              alt=""
              aria-hidden
              width={400 / 1.3}
              height={400 / 1.3}
              className="absolute sm:-left-40 left-0 sm:-top-24 -top-16 sm:w-auto w-32"
            />
            <Image
              priority
              src={require('../../public/assets/quote-2@2x.png')}
              alt=""
              aria-hidden
              width={532 / 1.3}
              height={460 / 1.3}
              className="absolute sm:-bottom-40 -bottom-24 sm:-right-40 right-0 sm:w-auto w-48"
            />
            <h2>
              After graduating from my class, 94% of my students went on to
              receive full-time developer roles.
            </h2>
          </motion.div>
          <motion.p {...motionProps}>
            I’ve since focused my time on bringing my classroom teaching
            experience to an online environment. In 2016 I launched my Web
            Developer Bootcamp course, which has since gone on to become one of
            the best selling and top rated courses on Udemy. I was also voted
            Udemy’s Best New Instructor of 2016.
          </motion.p>
          <motion.p {...motionProps}>
            I've spent years figuring out the "formula" to teaching technical
            skills in a classroom environment, and I'm really excited to finally
            share my expertise with you. I can confidently say that my online
            courses are without a doubt the most comprehensive ones on the
            market.
          </motion.p>
        </article>
        <div className="relative z-10" ref={skeletonRef}>
          <motion.div style={shouldReduceMotion ? {} : {x}}>
            <Image
              priority
              src={require('../../public/assets/skeleton-flowers@2x.png')}
              width={1215}
              height={487}
              alt=""
              aria-hidden
              className="mx-auto select-none sm:translate-y-24 translate-y-10"
            />
          </motion.div>
        </div>
        <div className="sm:p-5 p-2">
          <div className="w-full h-full bg-brand-bone flex items-center justify-center flex-col relative px-5">
            <div className="flex flex-col items-center justify-center sm:pb-56 pb-24 sm:pt-32 pt-24">
              <PrimaryNewsletterCta />
              <Image
                priority
                src={require('../../public/assets/mountain-silhouette@2x.png')}
                alt=""
                aria-hidden
                fill
                className="object-contain object-bottom z-0 select-none pointer-events-none"
              />
            </div>
          </div>
        </div>
      </main>
    </Layout>
  )
}

export default Home
