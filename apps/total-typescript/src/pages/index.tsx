import Image from 'next/image'
import Layout from 'components/layout'
import LandingCopy from 'components/landing-copy.mdx'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

const HomePage = () => {
  return (
    <Layout>
      <Header />
      <main>
        <Copy />
        <SubscribeToNewsletter />
      </main>
    </Layout>
  )
}

const Header = () => {
  return (
    <header className="flex flex-col justify-center items-center px-5 overflow-hidden">
      <div className="max-w-screen-xl flex items-center w-full relative min-h-[90vh]">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-heading xl:text-7xl lg:text-6xl sm:text-5xl text-3xl font-light xl:leading-[1.15] lg:leading-[1.15] sm:leading-[1.15] leading-[1.25]">
            Become the{' '}
            <strong className="font-extrabold">TypeScript Wizard</strong> at
            Your Company
          </h1>
          <h2 className="text-2xl pt-8 font-text max-w-lg bg-gradient-to-tr from-sky-300 to-emerald-200 text-transparent bg-clip-text font-light">
            A Comprehensive Production-Grade TypeScript Training by Matt Pocock
          </h2>
        </div>
        <div className="flex-shrink-0 absolute -right-32">
          <Image
            src={require('../../public/assets/wizard-in-a-cave@2x.png')}
            alt=""
            aria-hidden="true"
            width={890 / 1}
            height={960 / 1}
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
    </header>
  )
}

const Copy = () => {
  return (
    <article className="lg:px-0 px-5 sm:prose-2xl prose-lg  w-full prose-pre:overflow-auto prose-p:max-w-screen-md prose-p:mx-auto prose-headings:max-w-screen-md prose-headings:mx-auto prose-pre:max-w-screen-md prose-pre:mx-auto prose-ul:max-w-screen-md prose-ul:mx-auto prose-ul:list-disc marker:text-blue-500 prose-headings:font-bold">
      <LandingCopy />
    </article>
  )
}

const SubscribeToNewsletter = () => {
  const router = useRouter()
  return (
    <section className="py-24 mt-24 bg-blue-600 text-white flex flex-col items-center justify-center">
      <div>
        <SubscribeToConvertkitForm
          actionLabel="Subscribe"
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
              router.push(redirectUrl)
            }
          }}
        />
      </div>
    </section>
  )
}

export default HomePage
