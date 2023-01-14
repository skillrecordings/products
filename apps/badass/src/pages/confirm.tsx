import Layout from 'components/layout'
import Image from 'next/legacy/image'
import Illustration from '../../public/assets/pc@2x.png'
import {motion} from 'framer-motion'

const Confirm = () => {
  return (
    <Layout
      className="p-0 min-h-[calc(100vh-96px)] flex flex-col"
      meta={{title: 'Confirm your subscription'}}
    >
      <div className="p-5 flex flex-col items-center justify-center flex-grow text-center sm:pb-0 pb-16">
        <Image
          src={Illustration}
          width={336}
          height={350}
          alt="friendly computer with smiley face on the screen"
          placeholder="blur"
          priority
        />
        <motion.p
          className="font-condensed text-2xl pt-8 pb-6 text-badass-pink-500"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring'}}
        >
          Just one last step...
        </motion.p>
        <motion.h1
          className="font-heading text-3xl max-w-lg"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring', delay: 0.1}}
        >
          Now check your email to{' '}
          <strong className="text-badass-yellow-300">
            confirm your subscription.
          </strong>
        </motion.h1>
        <motion.p
          animate={{opacity: [0, 0.7], y: [-10, 0]}}
          transition={{delay: 0.2}}
          className="max-w-sm mx-auto md:text-sm text-xs pt-8"
        >
          If you don't see the email after a few minutes, you might check your
          spam folder or other filters and add <code>team@badass.dev</code> to
          your contacts.
        </motion.p>
      </div>
    </Layout>
  )
}

export default Confirm
