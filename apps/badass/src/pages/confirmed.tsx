import Layout from 'components/layout'
import Image from 'next/image'
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
        <motion.h1
          className="font-heading text-3xl max-w-lg pt-8"
          animate={{opacity: [0, 1], y: [-10, 0]}}
          transition={{type: 'spring'}}
        >
          Thanks for signing up!
        </motion.h1>
      </div>
    </Layout>
  )
}

export default Confirmed
