import Layout from 'components/layout'
import CityScene from 'components/scenes/city'

const Custom404 = () => {
  return (
    <Layout meta={{title: 'Not Found'}} nav>
      <main className="relative min-h-screen">
        <div className="z-10 absolute w-full h-full flex items-center text-center justify-center flex-col sm:pointer-events-none">
          <h1 className="pt-3 pb-8 text-center sm:text-[10vw] text-8xl leading-none font-heading font-bold text-white">
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
