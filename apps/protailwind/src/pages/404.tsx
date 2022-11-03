import Layout from 'components/layout'
import CityScene from 'components/scenes/city'

const Custom404 = () => {
  return (
    <Layout meta={{title: 'Not Found'}} nav>
      <main className="relative min-h-screen">
        <div className="absolute z-10 flex h-full w-full flex-col items-center justify-center text-center sm:pointer-events-none">
          <h1 className="pt-3 pb-8 text-center font-heading text-8xl font-bold leading-none text-white sm:text-[10vw]">
            404
          </h1>
        </div>
        <div>
          <CityScene />
        </div>
      </main>
    </Layout>
  )
}

export default Custom404
