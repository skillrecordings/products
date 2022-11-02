import Layout from 'components/layout'
import type {NextPage} from 'next'
import LandingCopy from 'components/landing-copy.mdx'
import SubscribeForm from 'components/subscribe-form'

const Home: NextPage = () => {
  return (
    <Layout nav>
      <header className="bg-noise relative pt-12 sm:pt-24 lg:pt-24">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center px-4 text-center sm:px-8">
            <h2 className="font-heading max-w-lg text-[2rem] font-bold leading-tight sm:text-4xl md:max-w-screen-lg md:text-5xl lg:text-5xl">
              <span className="inline-flex">
                Avanza tu Carrera con Entrenamiento de Ingeniería Front-End
                Profesional
              </span>{' '}
            </h2>
            <p className="text-sand-100 mx-auto max-w-sm pt-4 text-xl">
              Accede a workshops prácticos e interactivos
            </p>
          </div>
        </div>
      </header>
      <section className="mx-auto max-w-screen-xl py-10 sm:py-16 lg:py-24">
        <div className="marker:text-primary prose-headings:font-text prose-base w-full opacity-90 prose-headings:mx-auto prose-headings:max-w-2xl prose-headings:px-5 prose-headings:font-bold prose-h2:text-center prose-h2:text-3xl prose-p:mx-auto prose-p:max-w-2xl prose-p:px-5 prose-p:font-light prose-pre:mx-auto prose-pre:max-w-2xl prose-pre:overflow-auto prose-ul:mx-auto prose-ul:max-w-2xl prose-ul:list-disc sm:prose-lg md:prose-xl md:prose-h2:text-5xl">
          <LandingCopy />
        </div>
        <SubscribeForm />
      </section>
    </Layout>
  )
}

export default Home
