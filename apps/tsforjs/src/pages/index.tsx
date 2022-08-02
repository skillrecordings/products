import type {NextPage} from 'next'
import React, {useState} from 'react'
import Image from 'next/image'
import Accordion from 'components/Accordion'
import {useRouter} from 'next/router'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import Layout from 'components/layout'

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <div className="relative w-full">
          <div className="bg-black">
            <div className="flex h-screen justify-center items-center">
              <div className="text-center">
                <h1 className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                  Type errors are ✨annoying✨
                </h1>
                <div className="text-white font-bold pt-10 px-20 text-xl sm:text-2xl md:text-2xl xl:text-4xl 2xl:text-6xl">
                  <p>
                    When you’re used to the carefree life of declaring variables
                    without worrying about what they’ll eventually become or the
                    functions they’ll interact with, adding types just seems
                    like...
                  </p>
                  <p className="pt-6 pb-20">
                    a bunch of extra work for little reward.
                  </p>
                  <a href="#intro">
                    <Image
                      width={40}
                      height={20}
                      src="https://res.cloudinary.com/tsforjs/image/upload/v1658263809/website/chevrondown_nnqrfs.png"
                      alt="down button"
                    />
                  </a>
                </div>
              </div>
            </div>

            <div className="justify-center items-center" id="intro">
              <div className="text-center">
                <div className="pb-10 text-5xl md:text-6xl xl:text-7xl 2xl:text-9xl font-bold">
                  <p>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                      Typescript
                    </span>
                    <span className="text-teal-400 font-normal italic font-serif">
                      {' '}
                      for{' '}
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                      Javascript
                    </span>
                  </p>
                  <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                    Developers
                  </p>
                </div>
                <p className="inline-block px-5 py-1 text-xs tracking-wider rounded-full sm:text-sm bg-gradient-to-r from-purple-300 to-pink-300">
                  NEW COURSE
                </p>
              </div>
            </div>
            <div>
              <h3 className="pt-12 text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500 pb-20">
                Course Modules
              </h3>
              <Accordion />
              <div className="max-w-[47rem] px-4 mx-auto -mt-[220px] pt-80">
                <Subscribe />
              </div>
            </div>

            <div className="py-32 text-white">
              <div className="max-w-[40rem] px-4 mx-auto">
                <h3 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
                  Meet Your Instructor
                </h3>
                <div className="w-[300px] h-[300px] rounded-full mx-auto mt-6 overflow-hidden">
                  <Image
                    src="https://res.cloudinary.com/tsforjs/image/upload/c_fill,dpr_2.0,fl_force_dpi,h_120,w_120/v1658263809/website/shaundaipic_caejti.jpg"
                    alt="Shaundai Person headshot"
                    width={300}
                    height={300}
                    quality={100}
                  />
                </div>
                <h2 className="text-center pt-4 text-2xl font-bold">
                  {' '}
                  Shaundai Person
                </h2>

                <div className="mt-16 text-lg flex flex-col items-center space-y-6">
                  <div className="space-y-6 w-full">
                    <p>
                      Hey there, I’m Shaundai Person, a frontend developer,
                      technical writer, and co-organizer of{' '}
                      <a
                        href="https://www.reactrobins.com//"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-b-2 hover:opacity-75 duration-100"
                      >
                        {' '}
                        React Robins.{' '}
                      </a>
                    </p>
                    <p>
                      When I started as a Software Engineer, I found myself part
                      of an engineering team responsible for refactoring a huge
                      legacy codebase to TypeScript.
                    </p>
                    <p>
                      In this course, I compiled my learnings about getting
                      started with TypeScript (while helping you avoid making
                      the mistakes I made back then!)
                    </p>
                  </div>
                  <div className="space-x-3 flex items-center">
                    <a
                      href="https://www.twitter.com/shaundai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#1da1f2] flex justify-center items-center hover:opacity-75 duration-100"
                    >
                      <Image
                        alt="twitter"
                        src="/images/icons/twitter.svg"
                        width={20}
                        height={20}
                        quality={100}
                      />
                      <span className="sr-only">twitter</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/shaundai/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-[#007bb5] flex justify-center items-center hover:opacity-75 duration-100"
                    >
                      <Image
                        alt="twitter"
                        src="/images/icons/linkedin.svg"
                        width={20}
                        height={20}
                        quality={100}
                      />
                      <span className="sr-only">linkedin</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default Home

const Subscribe = () => {
  const router = useRouter()
  return (
    <section className="text-white bg-stone-900 rounded-lg lg:px-20 md:px-16 px-6 xl:px-24 lg:py-16 md:py-12 py-5 xl:py-20">
      <div className="text-center space-y-7 mb-6">
        <h3 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-500">
          Sign up for exclusive content and early-release lessons!
        </h3>
        <p>Take the next step in your career.</p>
      </div>
      <SubscribeToConvertkitForm
        onSuccess={(subscriber: any) => {
          if (subscriber) {
            const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
            router.push(redirectUrl)
          }
        }}
        actionLabel="Subscribe"
      />
      <p className="text-sm text-[#737373] text-center mt-4">
        We respect your privacy. Unsubscribe at any time.
      </p>
      <p className="text-sm text-[#737373] text-center mt-4">
        (no spam. ever. pinky promise.)
      </p>
    </section>
  )
}
