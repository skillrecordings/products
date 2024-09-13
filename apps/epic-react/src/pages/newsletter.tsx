import Layout from '@/components/app/layout'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'
import Image from 'next/image'

const NewsletterPage = () => {
  const title = 'Newsletter'

  return (
    <Layout
      meta={{
        title,
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1726065411/newsletter-card_2x.jpg',
        },
      }}
      className="w-full"
    >
      <main
        id="newsletter"
        className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center py-10 dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#1C2434_0%,_hsl(var(--background))_100%)] sm:py-20"
      >
        <PrimaryNewsletterCta className="[&>[data-sr-convertkit-subscribe-form]]:flex-col [&_[data-nospam]]:hidden">
          <div className="flex flex-col px-5">
            <h1 className="text-balance text-center text-2xl font-semibold sm:text-4xl">
              Join over 38,000 developers on their journey to React mastery
            </h1>
            <h2 className="mb-10 mt-5 max-w-2xl items-center justify-center px-5 text-center text-blue-600 dark:text-blue-200 sm:text-lg">
              React Training for Professional Developers by
              <span className="relative inline-flex translate-y-1.5 items-center sm:translate-y-2.5">
                <Image
                  src={require('../../public/kent-c-dodds.png')}
                  alt=""
                  priority
                  aria-hidden="true"
                  width={40}
                  height={40}
                  className="ml-3 mr-1.5 size-6 rounded-full bg-gray-300 dark:bg-gray-800 sm:size-8"
                />{' '}
                Kent C. Dodds
              </span>
            </h2>
          </div>
        </PrimaryNewsletterCta>
        <p
          data-nospam=""
          className="inline-flex items-center gap-2 pt-0 text-center text-xs text-gray-600 dark:text-gray-400"
        >
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
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M6.5 7.5V6C6.5 5.172 7.172 4.5 8 4.5C8.828 4.5 9.5 5.172 9.5 6V7.5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M10.5 7.5H5.5V10.5H10.5V7.5Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          I respect your privacy. Unsubscribe at any time.
        </p>
      </main>
    </Layout>
  )
}

export default NewsletterPage
