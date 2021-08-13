import * as React from 'react'
import Layout from 'components/app/layout'
import {Signature, ThumbsUp, Grid1} from 'components/images'
import LandingCopy from 'components/content/landing-copy.mdx'
import ConvertkitSubscribeForm from 'components/forms/convertkit'
import {CourseJsonLd} from 'next-seo'

export default function Home() {
  return (
    <>
      <CourseJsonLd
        courseName="Keyboard Legend"
        providerName="Cassidy Williams"
        providerUrl="https://cassidoo.co/"
        description="A guide to mechanical keyboards."
      />
      <Layout meta={{title: 'Keyboard Legend'}} className="bg-white-100">
        <header className="overflow-hidden sm:px-16 px-5 py-24 bg-white min-h-[80vh] flex items-center">
          <div className="flex md:flex-row flex-col-reverse items-center justify-between max-w-[960px] w-full mx-auto">
            <h1 className="relative z-20 py-5">
              <div className="font-mono font-semibold uppercase pb-2">
                Learn how to build{' '}
                <span className="text-brand-pink-500">your own</span>
              </div>
              <div className="lg:text-6xl text-5xl font-bold uppercase">
                Mechanical
                <div className="text-brand-pink-500">Keyboard</div>
              </div>
              <div className="pt-2 space-x-2 flex items-center">
                <span className="font-mono text-xs uppercase">with</span>
                <Signature className="w-48" />
              </div>
            </h1>
            <div className="relative flex items-center justify-center sm:w-auto w-full ">
              <ThumbsUp className="w-96 p-10 relative z-10" />
              <Grid1 className="absolute -ml-8 top-20 text-brand-pink-100 w-[150%] opacity-80 z-0" />
            </div>
          </div>
        </header>
        <main>
          <article className="prose sm:prose-lg lg:prose-xl max-w-[55ch] mx-auto px-5">
            <LandingCopy />
          </article>
          <section className="max-w-screen-sm mx-auto w-full sm:pt-32 pt-20 sm:pb-24 pb-4 px-5">
            <h3 className="sm:text-4xl text-3xl font-bold text-center">
              Sign up for my 6 part guide to Mechanical Keyboards
            </h3>
            <h4 className="sm:text-2xl text-xl font-light max-w-md mx-auto pt-4 text-center text-brand-pink-500">
              And stay in the loop for the super rad stuff I have planned for
              the future!
            </h4>
            <div className="max-w-sm mx-auto w-full py-16">
              <ConvertkitSubscribeForm />
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}
