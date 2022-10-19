import Layout from 'components/layout'
import type {NextPage} from 'next'
import LandingCopy from 'components/landing-copy.mdx'
import SubscribeForm from 'components/subscribe-form'

const Home: NextPage = () => {
  return (
    <Layout>
      <header className="pointer-events-none relative flex flex-col items-center justify-center text-center mx-auto md:pt-28 pt-28 md:min-h-[70vh] md:pb-32 pb-24 max-w-screen-xl">
        <div className="flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center justify-center text-center sm:px-8 px-4">
            <h2 className="md:max-w-screen-md lg:text-5xl md:text-5xl sm:text-4xl text-[2rem] font-heading font-bold leading-tight max-w-lg">
              <span className="inline-flex">
                Acelera tu carrera con courses de Ingeniería Front-End
              </span>
            </h2>
          </div>
        </div>
      </header>
      <section className="max-w-screen-xl py-10 mx-auto lg:py-24 sm:py-16">
        <div className="prose-h2:text-3xl md:prose-h2:text-5xl md:prose-xl sm:prose-lg prose-base opacity-90 prose-p:font-light w-full prose-pre:overflow-auto prose-p:max-w-2xl prose-p:mx-auto prose-headings:max-w-2xl prose-headings:mx-auto prose-pre:max-w-2xl prose-pre:mx-auto prose-ul:max-w-2xl prose-ul:mx-auto prose-ul:list-disc marker:text-primary prose-headings:font-bold prose-p:px-5 prose-headings:px-5 prose-headings:font-text prose-h2:text-center">
          <LandingCopy />
        </div>
        <SubscribeForm />
      </section>
    </Layout>
  )
}

export default Home
