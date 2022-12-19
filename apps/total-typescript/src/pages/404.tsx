import Layout from 'components/app/layout'
import Image from 'next/image'

const NotFound = () => {
  return (
    <Layout meta={{title: 'Not Found'}} className="bg-black/20">
      <main className="flex h-full w-full flex-grow flex-col items-center justify-center text-center sm:flex-row sm:gap-10 sm:text-left">
        <Image
          src="https://res.cloudinary.com/total-typescript/image/upload/v1670078673/pricing/pricing-castle_2x_wldbtl.png"
          alt=""
          aria-hidden="true"
          width={808 / 1.5}
          height={914 / 1.5}
        />
        <div className="sm:-translate-x-20">
          <h1 className="font-heading text-7xl font-bold">404</h1>
          <h2 className="font-heading text-3xl font-semibold uppercase text-gray-400">
            Not Found
          </h2>
        </div>
      </main>
    </Layout>
  )
}

export default NotFound
