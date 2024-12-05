import {Button} from '@skillrecordings/ui'
import Layout from 'components/app/layout'
import Share from 'components/share'
import {HeartIcon} from '@heroicons/react/solid'
import Image from 'next/image'
import Link from 'next/link'
import {track} from 'utils/analytics'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import {ChevronLeft} from 'lucide-react'

export default function PrinciplesCheatSheet() {
  return (
    <Layout
      meta={{
        titleAppendSiteName: false,
        title: 'Epic Programming Principles Cheat Sheet',
        ogImage: {
          url: 'https://res.cloudinary.com/epic-web/image/upload/v1733313122/principles-card_2x.jpg',
          alt: 'Programming Principles',
        },
      }}
      className="bg-gray-100 dark:bg-gray-900"
    >
      <main className="mx-auto flex max-w-screen-xl flex-col items-center justify-center p-5 py-16">
        <div className="mb-4 flex w-full flex-col items-center justify-between gap-5 md:flex-row">
          <div className="flex flex-col">
            <Link
              href="/principles"
              className="mb-2 inline-flex items-center gap-1 text-primary hover:underline dark:brightness-150"
            >
              <ChevronLeft size={14} /> Epic Programming Principles
            </Link>
            <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-left sm:text-2xl lg:text-4xl">
              Cheat Sheet
            </h1>
          </div>
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
                    location: 'epic programming principles cheat sheet',
                  })
                }}
                target="_blank"
                rel="noopener noreferrer"
                href="https://res.cloudinary.com/epic-web/image/upload/v1733383987/programming-principles-cheatsheet.pdf"
              >
                Download PDF
              </a>
            </Button>
          </div>
        </div>
        <a
          onClick={() => {
            track('clicked cheat sheet image', {
              location: 'epic programming principles cheat sheet',
            })
          }}
          href="https://res.cloudinary.com/epic-web/image/upload/v1733383987/programming-principles-cheatsheet.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            src={
              'https://res.cloudinary.com/epic-web/image/upload/v1733383987/programming-principles-cheatsheet_2x.jpg'
            }
            width={3168 / 2.5}
            height={2448 / 2.5}
            priority
            className="rounded-lg shadow-soft-xl"
            alt="epic programming principles cheat sheet"
          />
        </a>
        <div className="flex w-full pt-5 lg:hidden">
          <Share
            title="Epic Programming Principles Cheat Sheet"
            className="rounded bg-white dark:bg-gray-800"
          >
            <div className="flex items-center gap-1">
              <HeartIcon
                aria-hidden="true"
                className="inline-block h-5 w-5 flex-shrink-0 animate-pulse text-rose-400/90"
              />
              Share this cheat sheet with your friends
            </div>
          </Share>
        </div>
        <PrimaryNewsletterCta className="[&>div]:mt-0" />
      </main>
    </Layout>
  )
}
