import Head from 'next/head'
import React from 'react'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'

const HomePage = () => {
  const router = useRouter()

  return (
    <>
      <Head>
        <title>Advanced TypeScript</title>
        <meta
          name="description"
          content={`Learn the tricks open-source libraries use to build dynamic, robust types.`}
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://mattpocock.com`} />
        <meta
          property="og:title"
          content={`Advanced TypeScript - Become a TS Wizard`}
        />
        <meta
          property="og:description"
          content={`Learn the tricks open-source libraries use to build dynamic, robust types.`}
        />
        <meta
          property="og:image"
          content={`https://mattpocock.com/og-image.png`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={`https://mattpocock.com/og-image.png`}
        />
        <meta
          name="twitter:title"
          content={`Advanced TypeScript - Become a TS Wizard`}
        />
        <meta
          name="twitter:description"
          content={`Learn the tricks open-source libraries use to build dynamic, robust types.`}
        />
        <meta property="twitter:domain" content="mattpocock.com" />
        <meta property="twitter:url" content="https://mattpocock.com" />
      </Head>
      <main>
        <div className="flex overflow-hidden">
          <div className="xl:w-40 lg:w-24 md:w-4 bg-gradient-to-tl from-indigo-500 to-cyan-500"></div>
          <div className="bg-white lg:w-8"></div>
          <div className="flex-1 px-4 pt-24 space-y-10 text-center pb-44 bg-gradient-to-r from-gray-100 to-gray-50">
            <p className="inline-block px-5 py-1 text-xs tracking-wider text-gray-500 uppercase rounded-full sm:text-sm bg-gradient-to-r from-gray-200 to-gray-100">
              Live Workshop
            </p>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Advanced TypeScript
            </h1>
            <h2 className="max-w-lg mx-auto text-lg text-gray-700 sm:leading-8 sm:text-xl">
              Become a{' '}
              <span className="font-bold tracking-tight text-transparent bg-gradient-to-r from-indigo-600 to-red-500 bg-clip-text">
                TypeScript Wizard
              </span>{' '}
              - learn the tricks open-source libraries use to build dynamic,
              robust types.
            </h2>
          </div>
          <div className="bg-white lg:w-8"></div>
          <div className="xl:w-40 lg:w-24 md:w-4 bg-gradient-to-tr from-indigo-500 to-cyan-500"></div>
        </div>
        <div className="px-4">
          <div className="relative block max-w-2xl p-6 mx-auto -mt-16 text-lg bg-white rounded shadow-2xl sm:p-10 sm:px-16">
            <p className="mb-6 text-center text-gray-700 sm:text-xl sm:leading-8">
              Join the Waiting List
            </p>
            <SubscribeToConvertkitForm
              actionLabel="Save Your Spot"
              onSuccess={(subscriber: any) => {
                if (subscriber) {
                  const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                  router.push(redirectUrl)
                }
              }}
            />
          </div>

          <div className="max-w-2xl mx-auto mt-24 prose sm:prose-lg">
            <p>
              <b>Getting better at TS is really hard right now</b>. The secrets
              of advanced TypeScript are hidden away inside open source
              libraries or deep in Twitter threads.
            </p>
            <p>
              Plus, it's hard to deny that <b>TS is the future</b>. It's seeing
              massive adoption and being an expert can make you enormously
              employable.
            </p>
          </div>
          <Quote
            img="/wes-bos.jpeg"
            from="Wes Bos | Host of Syntax FM"
            quote="The Rodney Mullen of TypeScript"
          ></Quote>
          <div className="max-w-2xl mx-auto prose sm:prose-lg">
            <p>
              This workshop brings together everything I've learned as a TS
              engineer and OSS maintainer for XState. We'll be covering{' '}
              <b>all the tricks the docs don't teach you</b>.
            </p>
            <p>
              We'll start at an intermediate level, and work up into a
              super-advanced level. It's going to be{' '}
              <b>the most advanced TS workshop avaialble anywhere</b>. IYou'll
              be the company's resident TypeScript wizard - the one they turn to
              for advice.
            </p>
            <p>To learn more, check out the trailer below.</p>
            <iframe
              width="100%"
              className="my-16 h-72 sm:h-96"
              src="https://www.youtube.com/embed/Lk-lSc2CeuU"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="max-w-2xl mx-auto my-16 prose sm:prose-lg ">
            <h1 className="tracking-tight text-center text-gray-800 ">
              Fundamentals
            </h1>
            <p>
              You'll the fundamentals of advanced TS. You'll learn about at
              generics, conditional types, mapped types, tuples - everything you
              need to feel confident looking at complicated TS code.
            </p>
            <p>
              You'll need a beginner's knowledge of TypeScript since we'll start
              from the complicated stuff (generics!) and work upwards.
            </p>
          </div>
          <div className="max-w-2xl mx-auto my-16 prose sm:prose-lg">
            <h1 className="tracking-tight text-center text-gray-800 ">
              Type Challenges
            </h1>
            <p>
              From there, we'll work through the{' '}
              <a href="https://github.com/type-challenges/type-challenges">
                type-challenges
              </a>{' '}
              repo - a list of over 100 TypeScript challenges that offer a stern
              test of advanced TypeScript users. This will be a problem/solution
              setup - I'll set up the problem, then let you have a go at the
              solution.
            </p>
            <p>
              This will test your TypeScript muscles and give you a massive,
              comprehensive set of challenges to work through at your pace.
            </p>
          </div>
          <div className="max-w-2xl mx-auto my-16 prose sm:prose-lg">
            <h1 className="tracking-tight text-center text-gray-800 ">
              OSS Deep Dives
            </h1>
            <p>
              Finally, we'll look at TypeScript in the wild. I've got{' '}
              <b>
                interviews lined up with several open source library maintainers
              </b>{' '}
              who will guide you through 5-10 of the top TS Open Source repo's
              out there.
            </p>
            <p>
              We'll focus on the tricks they used to solve their hardest TS
              challenges - and the architectural decisions that led them there.
            </p>
          </div>
          <Quote
            img="/swyx.jpeg"
            from={`Shawn "swyx" Wang | Author and Developer Advocate`}
            quote="Your TS tips are 🔥"
          ></Quote>
          <div className="max-w-2xl mx-auto my-16 prose sm:prose-lg">
            <p>
              This is your opportunity to learn next-level TypeScript that you
              can apply to your projects today.
            </p>
            <p></p>
          </div>
        </div>
      </main>
      <footer className="relative flex flex-col items-center justify-center px-4 py-24 mt-24 space-y-8 sm:space-y-0 sm:space-x-12 sm:flex-row bg-gradient-to-r from-gray-900 to-gray-800">
        <img
          src="https://pbs.twimg.com/profile_images/751696248047009792/_HiVTyjR_400x400.jpg"
          alt="Matt Pocock"
          className="block w-40 h-40 h-full rounded-full shadow-inner"
        ></img>
        <div className="relative max-w-sm space-y-3 leading-7 text-gray-300">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Who am I?
          </h2>
          <p className="">
            I'm Matt Pocock, developer advocate at{' '}
            <a
              className="text-blue-300"
              href="https://stately.ai"
              rel="nofollow"
            >
              Stately
            </a>{' '}
            and member of the{' '}
            <a
              className="text-blue-300"
              href="https://github.com/statelyai/xstate"
              rel="nofollow"
            >
              XState
            </a>{' '}
            core team.
          </p>
          <p className="">
            I teach TypeScript, XState and React on my{' '}
            <a
              className="text-blue-300"
              href="https://twitter.com/mattpocockuk"
              rel="nofollow"
            >
              Twitter
            </a>
            , and at conferences.
          </p>
        </div>
      </footer>
    </>
  )
}

const Quote = (props: {img: string; quote: string; from: string}) => {
  return (
    <div className="flex items-center justify-center max-w-2xl mx-auto my-16 space-x-4">
      <img
        src={props.img}
        className="w-16 h-16 rounded-full shadow-inner"
      ></img>
      <div>
        <p className="text-lg italic text-gray-600">"{props.quote}"</p>
        <p className="text-sm italic text-gray-500">{props.from}</p>
      </div>
    </div>
  )
}

const Bold: React.FC = ({children}) => {
  return <span className="font-bold">{children}</span>
}

export default HomePage
