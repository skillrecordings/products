import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/skill-lesson/convertkit'
import {setUserId} from '@amplitude/analytics-browser'
import {track} from '@skillrecordings/skill-lesson/utils/analytics'
import Layout from '../../components/app/layout'
import {useRouter, type NextRouter} from 'next/router'
import Image from 'next/image'
import {cn} from '@skillrecordings/ui/utils/cn'

const handleOnSubscribe = (
  router: NextRouter,
  subscriber?: any,
  email?: string,
) => {
  if (subscriber) {
    email && setUserId(email)
    track('subscribed to email list', {
      location: 'newsletter',
    })
    const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
    router.push(redirectUrl)
  }
}

const testimonials = [
  {
    body: "Total TypeScript is hands down the best course out there, and the format is the best I've seen. It feels like you're doing a 1 on 1 with Matt Pocock.",
    name: 'Alex Tana',
    image: require('../../../public/testimonials/alex-tana.jpg'),
  },
  {
    body: 'These videos and exercises really helped me to get to the next level in TS. I could improve types in some projects at work right on the next day.',
    name: 'Sebastian Kasanzew',
    image: require('../../../public/testimonials/sebastian-kasanzew.jpg'),
  },
]

const NewsletterPage = () => {
  const title = 'Sign Up to Total TypeScript'
  const router = useRouter()
  return (
    <Layout
      meta={{
        title,
        ogImage: {
          url: 'https://res.cloudinary.com/total-typescript/image/upload/v1723733494/card--newsletter_2x_rwq7lk.jpg',
        },
        titleAppendSiteName: false,
      }}
      className="w-full"
    >
      <main className="mx-auto mt-16 w-full">
        <section
          className="flex h-full w-full flex-col items-center px-5 py-16 sm:py-24"
          style={{
            background:
              'radial-gradient(50% 50% at 50% 50%, #1C2434 0%, hsl(var(--background)) 100%)',
          }}
          aria-label="Sign up to Total TypeScript"
        >
          <div className="flex max-w-xl flex-col items-center gap-7 text-center">
            <h1 className="text-balance text-3xl font-medium sm:text-4xl">
              Join over 40,000 developers on their journey to TypeScript mastery
            </h1>
            <h2 className="text-balance text-lg font-normal text-slate-300 sm:text-xl">
              A comprehensive production-grade TypeScript training by{' '}
              <Image
                src={require('../../../public/matt-pocock.jpg')}
                alt=""
                aria-hidden="true"
                className="mr-1 inline-block rounded-full"
                priority
                quality={100}
                width={30}
                height={30}
              />
              Matt Pocock
            </h2>
          </div>
          <SubscribeToConvertkitForm
            className="mt-12 flex w-full max-w-[360px] flex-col gap-5 [&_button]:mt-2 [&_button]:h-14 [&_button]:bg-gradient-to-tr [&_button]:from-[#4BCCE5] [&_button]:to-[#8AF7F1] [&_button]:text-base [&_button]:font-semibold [&_input]:h-14 [&_input]:border-[#2B394E] [&_input]:bg-black/30 [&_input]:px-4 [&_input]:text-base [&_input]:shadow-inner [&_input]:transition hover:[&_input]:border-[#3C506D]"
            actionLabel="Sign Up"
            onSuccess={(subscriber?: any, email?: string) => {
              return handleOnSubscribe(router, subscriber, email)
            }}
          />
          <div className="mt-16 inline-flex items-center gap-1">
            <IconSecure />
            <span className="text-sm text-[#A8B8CD]">
              I respect your privacy. Unsubscribe at any time.
            </span>
          </div>
        </section>
        <Testimonials />
        {/* <PrimaryNewsletterCta /> */}
      </main>
    </Layout>
  )
}

export default NewsletterPage

const IconSecure = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.5 9C14.5 13.5 8 15.5 8 15.5C8 15.5 1.5 13.5 1.5 9V2.5L8 0.5L14.5 2.5V9Z"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 7.5V6C6.5 5.172 7.172 4.5 8 4.5C8.828 4.5 9.5 5.172 9.5 6V7.5"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 7.5H5.5V10.5H10.5V7.5Z"
        stroke="#A8B8CD"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export const Testimonials = ({className}: {className?: string}) => {
  return (
    <section
      className={cn(
        'mx-auto flex w-full max-w-screen-lg gap-10 border-t px-5 py-16 sm:py-24',
        className,
      )}
    >
      <div className="flex flex-col gap-12 md:flex-row">
        {testimonials.map(({body, name, image}, i) => {
          return (
            <blockquote key={name} className="relative flex gap-5 sm:gap-10">
              <div
                className="select-none font-heading text-4xl font-bold text-slate-600 sm:text-5xl"
                aria-hidden="true"
              >
                {'”'}
              </div>
              <div className="relative flex flex-col gap-3">
                <p className="text-balance font-normal text-slate-100 sm:text-lg">
                  <span>"</span>
                  {body}
                  <span>"</span>
                </p>

                <footer className="flex items-center gap-2">
                  <Image
                    src={image}
                    alt=""
                    aria-hidden="true"
                    className="rounded-full"
                    priority
                    quality={100}
                    width={30}
                    height={30}
                  />
                  <cite className="text-sm not-italic text-slate-300 sm:text-base">
                    {name}
                  </cite>
                </footer>
              </div>
            </blockquote>
          )
        })}
      </div>
    </section>
  )
}
