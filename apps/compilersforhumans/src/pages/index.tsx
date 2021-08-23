import * as React from 'react'
//TODO: Check form styling
import ConvertkitSubscribeForm from '@skillrecordings/convertkit/dist/forms'
import Layout from 'layouts'
import LandingCopy from 'components/landing-copy.mdx'
import Animation from 'components/animation'

export default function Home() {
  return (
    <Layout>
      <div className="absolute top-0 w-full min-h-screen">
        <Animation className="min-h-[80vh] w-screen" />
      </div>
      <div className="flex flex-col relative z-10">
        <header className="md:p-16 p-5 text-center min-h-[80vh] flex items-center justify-center">
          <div className="pt-40 sm:pb-16 pb-24">
            <h1 className="lg:text-[8vw] sm:text-[10vw] text-[16vw] font-bold leading-[0.85] dark:drop-shadow-xl drop-shadow-white">
              <span className="dark:text-white text-black block">
                Compilers
              </span>
              <span>for Humans</span>
            </h1>
            <h2 className="pt-8 md:text-[2vw] text-[4vw] font-light">
              New Course by John Otander & Laurie Barth
            </h2>
          </div>
        </header>
        <article className="max-w-screen-2xl mx-auto w-full">
          <main className="prose dark:prose-dark lg:prose-2xl lg:max-w-[52ch] sm:prose-xl prose-lg lg:px-16  md:px-16 sm:px-16 px-5 mx-auto prose-justify">
            <LandingCopy />
          </main>
        </article>
      </div>
      <section>
        <div className="max-w-screen-lg text-lg mx-auto px-5 lg:py-40 sm:py-24 py-16 flex flex-col items-center justify-center">
          <h3 className="font-bold lg:text-7xl sm:text-5xl text-4xl pb-8 text-center">
            Learn about Compilers
          </h3>
          <ConvertkitSubscribeForm
            classNames={{
              input:
                'autofill:text-fill-black autofill:caret-black dark:bg-black w-full text-lg py-2 px-4 leading-7 border-gray-200 rounded-md focus:ring-violet-400 focus:ring-2 focus:outline-none focus:border-transparent placeholder-gray-400',
              form: 'max-w-sm w-full mx-auto py-8 space-y-5',
              label: 'block text-base pb-1',
              asterisk: 'dark:text-fuchsia-400',
              button:
                'font-medium text-lg rounded-full focus:bg-gray-500 focus:ring-2 focus:scale-90 focus:ring-black hover:scale-105 transition-all hover:shadow-xl focus:outline-none mt-4 sm:px-16 px-14 py-4 bg-gradient-to-r dark:from-pink-500 dark:to-purple-500 from-violet-500 to-pink-500 text-white ease-in-out',
              comment: 'text-center pt-4 text-base opacity-70',
              buttonContainer: 'w-full flex items-center justify-center',
            }}
          />
        </div>
        <div
          aria-hidden="true"
          className="w-full h-2 bg-gradient-to-r from-pink-500 to-violet-500"
        />
      </section>
    </Layout>
  )
}
