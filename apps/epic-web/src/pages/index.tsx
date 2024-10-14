import React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

const Index: NextPage = () => {
  return (
    <>
      <Layout
        meta={{
          titleAppendSiteName: false,
          title: 'Ship Modern Full-Stack Web Applications',
        }}
        navigationClassName=""
      >
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`RSS feed for ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
            href="/rss.xml"
          />
        </Head>

        <main className="mx-auto flex w-full max-w-screen-2xl grid-cols-4 flex-col items-center justify-center md:grid md:min-h-[calc(100vh-49px)]">
          <Link
            href="/full-stack"
            className="group h-full w-full md:col-span-2"
          >
            <article className="relative flex h-full flex-col items-center justify-start overflow-hidden border-black/5 bg-gradient-to-bl from-[#eff0f4] to-[#ced1e7] transition duration-300 ease-in-out group-hover:brightness-110 dark:border-white/5 dark:bg-gradient-to-bl dark:from-[#1C2030] dark:to-[#11131E] md:border-r">
              <div className="relative z-10 flex h-1/2 flex-col items-center justify-center px-10 pb-96 pt-16 text-center md:pb-0 md:pt-0 2xl:h-1/3">
                <h1 className="mb-3 text-balance text-4xl font-bold">
                  Become a Professional Full Stack Web Developer
                </h1>
                <h2 className="text-balance text-lg opacity-80">
                  The most comprehensive guide to professional web development
                  by{' '}
                  <Image
                    src={require('../../public/kent-c-dodds.png')}
                    width={28}
                    height={28}
                    alt="Kent C. Dodds"
                    priority
                    className="inline-block rounded-full bg-background"
                  />{' '}
                  Kent C. Dodds.
                </h2>
                <div
                  // href="/full-stack"
                  className="mt-8 flex items-center justify-center rounded bg-[linear-gradient(81deg,_#1F8AEB_9.18%,_#224BFF_115.75%)] px-7 py-3 text-center font-semibold text-white shadow-soft-lg transition duration-300 ease-in-out group-hover:brightness-110"
                >
                  Become Epic Web Dev
                </div>
              </div>
              <Image
                src={require('../../public/assets/full-stack-cover@2x.png')}
                alt=""
                aria-hidden="true"
                quality={100}
                priority
                fill
                className="object-contain object-bottom"
              />
            </article>
          </Link>
          <div className="col-span-2 grid h-full w-full grid-cols-1 grid-rows-2">
            <Link href="/testing" className="group h-full w-full">
              <article className="relative flex h-full w-full flex-col items-center justify-center border-b border-black/5 bg-gradient-to-bl from-[#eff0f4] to-[#ced1e7] px-5 pb-5 text-center transition duration-300 ease-in-out group-hover:brightness-110 dark:border-white/5 dark:bg-gradient-to-bl dark:from-[#1C2030] dark:to-[#11131E] xl:flex-row xl:gap-8 xl:text-left">
                <Image
                  src={
                    'https://res.cloudinary.com/epic-web/image/upload/v1728574021/mocking_techniques.png'
                  }
                  priority
                  width={250}
                  height={250}
                  alt=""
                  aria-hidden="true"
                  className=""
                />
                <div className="flex max-w-sm flex-col items-center xl:items-start">
                  <h1 className="mb-3 text-3xl font-bold">
                    Application Testing
                  </h1>
                  <h2 className="max-w-xl text-balance text-base opacity-80">
                    Learn from the creator and maintainer of Mock Service Worker
                    ,{' '}
                    <Image
                      src={require('../../public/artem.jpg')}
                      width={28}
                      height={28}
                      alt="Artem Zakharchenko"
                      priority
                      className="inline-block rounded-full"
                    />{' '}
                    Artem Zakharchenko.
                  </h2>
                  <div className="mt-8 flex items-center justify-center rounded bg-white px-10 py-3 text-center font-semibold shadow-soft-lg transition duration-300 ease-in-out group-hover:bg-gray-100 dark:bg-[#272B40] dark:group-hover:bg-[#3C415B]">
                    Learn more
                  </div>
                </div>
              </article>
            </Link>
            <Link
              href="/workshops/pixel-perfect-figma-to-tailwind"
              className="group flex h-full w-full items-center justify-center"
            >
              <article className="relative flex h-full w-full flex-col items-center justify-center bg-gradient-to-bl from-[#eff0f4] to-[#ced1e7] px-5 pb-5 text-center transition duration-300 ease-in-out group-hover:brightness-110 dark:bg-gradient-to-bl dark:from-[#1C2030] dark:to-[#11131E] xl:flex-row xl:gap-8 xl:text-left">
                <Image
                  src={
                    'https://res.cloudinary.com/epic-web/image/upload/v1711581753/events/pixel-perfect-figma-to-tailwind_2x.png'
                  }
                  priority
                  width={250}
                  height={250}
                  alt=""
                  aria-hidden="true"
                  className=""
                />
                <div className="flex max-w-sm flex-col items-center xl:items-start">
                  <h1 className="mb-3 text-3xl font-bold">Styling</h1>
                  <h2 className="max-w-xl text-balance text-base opacity-80">
                    Make pixel-perfect design implementations with Tailwind.
                  </h2>
                  <div className="mt-8 flex items-center justify-center rounded bg-white px-10 py-3 text-center font-semibold shadow-soft-lg transition duration-300 ease-in-out group-hover:bg-gray-100 dark:bg-[#272B40] dark:group-hover:bg-[#3C415B]">
                    Learn more
                  </div>
                </div>
              </article>
            </Link>
          </div>
          {/* <div className="col-span-1 flex w-full flex-col items-center" /> */}
        </main>
      </Layout>
    </>
  )
}

export default Index
