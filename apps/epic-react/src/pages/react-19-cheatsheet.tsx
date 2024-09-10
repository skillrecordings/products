import * as React from 'react'
import Layout from '@/components/app/layout'
import Image from 'next/image'
import {Button} from '@skillrecordings/ui'
import Share from '@/components/share'
import {HeartIcon} from '@heroicons/react/solid'

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
          <h1 className="text-center text-2xl font-semibold sm:text-4xl">
            React 19 Cheat Sheet
          </h1>
          <Button className="font-semibold" asChild>
            <a
              href="https://res.cloudinary.com/epic-web/image/upload/v1725974609/react-19-cheat-sheet.pdf"
              download="react-19-cheat-sheet.pdf"
            >
              Download PDF
            </a>
          </Button>
        </div>
        <a
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
        <div className="w-full pt-5">
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
      </main>
    </Layout>
  )
}

export default CheatSheetPage
