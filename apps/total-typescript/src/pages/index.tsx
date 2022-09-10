import Image from 'next/image'
import Layout from 'components/app/layout'
import LandingCopy from 'components/landing-copy.mdx'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {MDXComponents} from 'components/mdx'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '../utils/analytics'

const HomePage = () => {
  return (
    <Layout meta={{title: `Professional TypeScript Training by Matt Pocock `}}>
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
    <header className="flex flex-col justify-center items-center overflow-hidden px-5 relative">
      <div className="max-w-screen-lg flex lg:flex-row flex-col-reverse items-center w-full relative lg:min-h-[80vh]">
        <div className="relative z-10 max-w-2xl lg:py-48 lg:pb-48 pb-10">
          <h1 className="sm:mt-0 mt-16 font-heading xl:text-6xl lg:text-5xl sm:text-5xl text-4xl font-normal xl:leading-[1.15] lg:leading-[1.15] sm:leading-[1.15] leading-[1.25] max-w-[14ch]">
            Become the{' '}
            <strong className="font-extrabold">TypeScript Wizard</strong> at
            Your Company
          </h1>
          <h2 className="sm:text-2xl text-lg pt-8 font-text max-w-[28ch] bg-gradient-to-bl from-teal-200 to-cyan-200 text-transparent bg-clip-text font-normal">
            A comprehensive production-grade TypeScript training by{' '}
            <span className="text-white inline-flex items-baseline gap-2">
              Matt Pocock
            </span>
          </h2>
        </div>
        <div className="flex-shrink-0 lg:absolute -right-40 sm:scale-100 scale-150">
          <Image
            src={require('../../public/assets/wizard-in-a-cave@2x.png')}
            alt=""
            aria-hidden="true"
            width={890 / 1.15}
            height={960 / 1.15}
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
      <Image
        src={require('../../public/assets/landing/bg-divider-1.png')}
        layout="fill"
        className="object-contain object-bottom translate-y-48 select-none pointer-events-none"
        alt=""
        aria-hidden="true"
      />
    </header>
  )
}

const Copy = () => {
  return (
    <article className="prose-h2:text-3xl md:prose-h2:text-5xl md:prose-xl sm:prose-lg prose-base opacity-90 prose-p:font-light w-full prose-pre:overflow-auto prose-p:max-w-2xl prose-p:mx-auto prose-headings:max-w-2xl prose-headings:mx-auto prose-pre:max-w-2xl prose-pre:mx-auto prose-ul:max-w-2xl prose-ul:mx-auto prose-ul:list-disc marker:text-cyan-400 prose-headings:font-bold prose-p:px-5 prose-headings:px-5 prose-headings:font-text prose-h2:text-center">
      <LandingCopy />
    </article>
  )
}

const SubscribeToNewsletter = () => {
  const router = useRouter()
  return (
    <MDXComponents.Section
      className="py-40 bg-[#081021] flex flex-col items-center"
      slot={
        <Image
          src="/assets/landing/bg-divider-7.png"
          layout="fill"
          className="pointer-events-none object-contain select-none"
          objectPosition="top center"
          quality={100}
        />
      }
    >
      <div className="flex items-center justify-center">
        <Image
          src={require('../../public/assets/landing/scroll-ts@2x.png')}
          quality={100}
          width={650 / 1.8}
          height={650 / 1.8}
          alt=""
          aria-hidden="true"
          placeholder="blur"
        />
      </div>
      <h2 className="xl:text-6xl lg:text-5xl sm:text-5xl text-4xl font-heading font-bold max-w-[15ch] text-center mx-auto">
        Become a TypeScript Wizard
      </h2>
      <div className="py-16 w-full mx-auto relative" id="newsletter">
        <div className="max-w-sm mx-auto">
          <SubscribeToConvertkitForm
            actionLabel="Subscribe"
            onSuccess={(subscriber?: any, email?: string) => {
              if (subscriber) {
                email && setUserId(email)
                track('subscribed to email list', {
                  location: 'home',
                })
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
          />
        </div>
      </div>
      <p className="text-gray-400 text-center">
        I respect your privacy. Unsubscribe at any time.
      </p>
    </MDXComponents.Section>
  )
}

export default HomePage
