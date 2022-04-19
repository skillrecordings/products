import Layout from 'components/layout'
import Image from 'next/image'
import Illustration from '../../public/assets/fish@2x.png'
import {motion} from 'framer-motion'

const Unsubscribed = () => {
  return (
    <Layout
      className="p-0 min-h-[calc(100vh-96px)] flex flex-col"
      meta={{title: 'Unsubscribed'}}
    >
      <div className="p-5 flex flex-col items-center justify-center flex-grow text-center sm:pb-0 pb-16">
        <Image
          src={Illustration}
          width={320 / 2}
          height={272 / 2}
          alt="a fish"
          placeholder="blur"
          priority
        />

        <motion.h1
          className="font-heading text-3xl max-w-xl pt-4"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring'}}
        >
          You've been removed from the Badass.dev email list and won't receive
          any more emails about it.
        </motion.h1>
      </div>
    </Layout>
  )
}

export default Unsubscribed
