import * as React from 'react'
import Layout from 'components/app/layout'
import Image from 'next/image'
import {Button} from '@skillrecordings/ui'
import Share from 'components/share'
import {HeartIcon} from '@heroicons/react/solid'
import {track} from 'utils/analytics'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import Link from 'next/link'

const CheatSheetPage = () => {
  return (
    <Layout
      meta={{
        title: 'Vitest Mocking Cheat Sheet',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1729176143/vitest-cheatsheet-card_2x.jpg',
          alt: 'Mocking Techniques with Vitest Cheat Sheet',
        },
      }}
      className="bg-gray-100 dark:bg-gray-900"
    >
      <main className="mx-auto flex max-w-screen-xl flex-col items-center justify-center p-5 py-16">
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-5 md:flex-row">
          <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-left sm:text-2xl lg:text-3xl">
            Vitest Mocking Cheat Sheet
          </h1>
          <div className="flex items-center gap-3">
            <Share
              contentType=""
              className="hidden bg-white dark:bg-gray-800 lg:flex"
              title="Vitest Mocking Techniques Cheat Sheet"
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
                href="https://res.cloudinary.com/epic-web/image/upload/v1729174814/mocking-techniques-cheat-sheet.pdf"
              >
                Download PDF
              </a>
            </Button>
          </div>
        </div>
        <a
          onClick={() => {
            track('clicked cheat sheet image', {
              location: 'mocking techniques with Vitest cheat sheet',
            })
          }}
          href="https://res.cloudinary.com/epic-web/image/upload/v1729174814/mocking-techniques-cheat-sheet.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={
              'https://res.cloudinary.com/epic-web/image/upload/v1729177453/mocking-techniques-cheat-sheet-preview.jpg'
            }
            width={3168 / 2.5}
            height={2448 / 2.5}
            priority
            className="rounded-lg shadow-soft-xl"
            alt="mocking techniques with Vitest cheat sheet"
          />
        </a>
        <div className="flex w-full pt-5 lg:hidden">
          <Share
            title="Mocking techniques with Vitest cheat sheet"
            className="rounded bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-1">
              <HeartIcon
                aria-hidden="true"
                className="inline-block h-5 w-5 flex-shrink-0 animate-pulse text-rose-400/90"
              />
              Share with your friends
            </div>
          </Share>
        </div>
        <Link
          href="/testing"
          className="mx-auto mt-5 flex w-full max-w-3xl flex-col items-center gap-3 rounded-lg border bg-white p-5 pt-0 shadow-soft-xl transition duration-300 ease-in-out dark:bg-gray-800 dark:hover:bg-gray-900 sm:gap-8 sm:pt-5 md:flex-row lg:-mt-5"
        >
          <Image
            src={
              'https://res.cloudinary.com/epic-web/image/upload/v1728574021/mocking_techniques.png'
            }
            alt="Mocking Techniques in Vitest Bundle"
            width={250}
            height={250}
            className="flex-shrink-0"
          />
          <div>
            <strong className="font-medium text-orange-600 dark:text-orange-300">
              Everything You Need to Know to
            </strong>
            <h2 className="text-balance text-2xl font-bold">
              Master Mocking for Better Web Application Testing with Vitest
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Image
                  src="https://cdn.sanity.io/images/i1a93n76/production/4e5bb2ab156439d9036cc465cada217ab7d1177f-800x800.png"
                  width={36}
                  height={36}
                  alt="Artem Zakharchenko"
                  className="rounded-full"
                />
                <span className="opacity-80">Artem Zakharchenko</span>
              </div>
              {/* <span>52 interactive exercises</span>
              {'・'}
              <span>progress tracking</span> */}
            </div>
            <div className="mt-5 inline-flex items-center justify-center rounded bg-foreground/5 px-5 py-3 text-base font-semibold transition hover:bg-foreground/10">
              Learn more
            </div>
          </div>
        </Link>
      </main>
    </Layout>
  )
}

export default CheatSheetPage
