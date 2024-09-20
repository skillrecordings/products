import * as React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import {Button} from '@skillrecordings/ui'
import Share from '@/components/share'
import {HeartIcon} from '@heroicons/react/solid'
import {track} from '@/utils/analytics'
import {PrimaryNewsletterCta} from '@/components/primary-newsletter-cta'

const CheatSheetPage = () => {
  return (
    <Layout
      meta={{
        title: 'React 19 Cheat Sheet',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1725974623/react-19-cheat-sheet-card_2x.jpg',
          alt: 'React 19 Cheat Sheet',
        },
      }}
      className="bg-gray-100 dark:bg-gray-900"
    >
      <main className="mx-auto flex max-w-screen-xl flex-col items-center justify-center p-5 py-10">
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-5 md:flex-row">
          <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-left sm:text-2xl lg:text-4xl">
            React 19 Cheat Sheet
          </h1>
          <div className="flex items-center gap-3">
            <Share
              className="hidden lg:flex"
              title="React 19 Cheat Sheet"
              shareButtonClassName="w-full flex items-center justify-center h-full px-3 py-3 dark:hover:bg-white/5 hover:bg-gray-900/5 transition"
            >
              <div className="flex items-center gap-1 text-sm">
                <HeartIcon
                  aria-hidden="true"
                  className="inline-block h-5 w-5 flex-shrink-0 animate-pulse text-rose-400/90"
                />
                Share with your friends
              </div>
            </Share>
            <Button className="font-semibold" asChild>
              <a
                onClick={() => {
                  track('clicked download pdf', {
                    location: 'react 19 cheat sheet',
                  })
                }}
                target="_blank"
                rel="noopener noreferrer"
                href="https://res.cloudinary.com/epic-web/image/upload/v1725974609/react-19-cheat-sheet.pdf"
              >
                Download PDF
              </a>
            </Button>
          </div>
        </div>
        <a
          onClick={() => {
            track('clicked cheat sheet image', {
              location: 'react 19 cheat sheet',
            })
          }}
          href="https://res.cloudinary.com/epic-web/image/upload/v1725974609/react-19-cheat-sheet.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={require('../../public/react-19-cheat-sheet@2x.jpg')}
            width={3168 / 2.5}
            height={2448 / 2.5}
            priority
            className="rounded-lg shadow-xl"
            alt="React 19 Cheat Sheet"
          />
        </a>
        <div className="flex w-full pt-5 lg:hidden">
          <Share title="React 19 Cheat Sheet">
            <div className="flex items-center gap-1">
              <HeartIcon
                aria-hidden="true"
                className="inline-block h-5 w-5 flex-shrink-0 animate-pulse text-rose-400/90"
              />
              Share with your friends
            </div>
          </Share>
        </div>

        <main
          id="newsletter"
          className="mx-auto flex w-full max-w-screen-md flex-col items-center justify-center py-10 dark:bg-[radial-gradient(50%_50%_at_50%_50%,_#1C2434_0%,_hsl(var(--background))_100%)] sm:py-20"
        >
          <PrimaryNewsletterCta
            className="[&>[data-sr-convertkit-subscribe-form]]:flex-col [&_[data-nospam]]:hidden"
            actionLabel="Stay Up to Date"
            formId="7122145"
          >
            <div className="flex flex-col px-5">
              <h1 className="text-balance text-center text-2xl font-semibold sm:text-4xl">
                Get more React 19 resources
              </h1>
              <h2 className="mb-10 mt-5 max-w-2xl items-center justify-center px-5 text-center text-blue-600 dark:text-blue-200 sm:text-lg">
                Sign up and we will send you emails when we have new React 19
                tips, tools, and techniques like this cheat sheet by
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
      </main>
    </Layout>
  )
}

export default CheatSheetPage
