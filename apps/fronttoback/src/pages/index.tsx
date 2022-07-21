import Layout from 'components/layout'
import type {NextPage} from 'next'
import Image from 'next/image'

const Home: NextPage = () => {
  return (
    <Layout className="bg-[#03021a]">
      <h1 className="text-4xl text-primary-500 font-bold flex items-center justify-center flex-grow">
        <div className="relative w-full">
          <div className="absolute inset-0">
            <Image
              alt="Mountains"
              src="/images/background.webp"
              layout="fill"
              objectFit="cover"
              quality={100}
            />
          </div>
          <div className="relative min-h-screen">123</div>
        </div>
      </h1>
    </Layout>
  )
}

export default Home
