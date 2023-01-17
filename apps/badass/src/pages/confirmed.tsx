import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Illustration from '../../public/assets/stairs@2x.png'
import {motion} from 'framer-motion'

const Confirmed = () => {
  return (
    <Layout
      className="p-0 min-h-[calc(100vh-96px)] flex flex-col"
      meta={{title: 'Subscription confirmed'}}
    >
      <div className="p-5 flex flex-col items-center justify-center flex-grow text-center">
        <Image
          src={Illustration}
          width={360}
          height={372}
          alt="stairs leading up to a rainbow with lots of sparkling mushrooms around"
          placeholder="blur"
          priority
        />
        <motion.p
          className="font-condensed sm:text-3xl text-2xl pt-8 pb-6 text-badass-pink-500"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring'}}
        >
          Success! Thank you for signing up
        </motion.p>
        <motion.h1
          className="font-heading text-3xl max-w-xl"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring', delay: 0.1}}
        >
          We're working on some badass stuff and occasionally share sneak peeks
          on{' '}
          <a
            href="https://twitter.com/badass_courses"
            rel="noopener noreferrer"
            target="_blank"
            className="text-badass-green-400"
          >
            <span className="font-symbol" aria-hidden="true">
              #
            </span>
            <span className="underline underline-offset-4 decoration-badass-green-400/60 hover:decoration-badass-green-400">
              Twitter
            </span>{' '}
            <sup className="text-badass-gray text-lg">@badass_courses</sup>
          </a>
        </motion.h1>
      </div>
    </Layout>
  )
}

export default Confirmed
