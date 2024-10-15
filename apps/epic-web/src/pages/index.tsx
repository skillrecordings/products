import React from 'react'
import Layout from 'components/app/layout'
import type {NextPage} from 'next'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {PrimaryNewsletterCta} from 'components/primary-newsletter-cta'
import {useConvertkit} from '@skillrecordings/skill-lesson/hooks/use-convertkit'
import HomepageCopy from 'components/homepage-copy.mdx'
import KentImage from '../../public/kent-c-dodds.png'
import {ChevronRight} from 'lucide-react'

const Index: NextPage = () => {
  const {subscriber, loadingSubscriber} = useConvertkit()
  return (
    <>
      <Layout
        meta={{
          titleAppendSiteName: false,
          title: 'Ship Modern Full-Stack Web Applications',
        }}
      >
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title={`RSS feed for ${process.env.NEXT_PUBLIC_SITE_TITLE}`}
            href="/rss.xml"
          />
        </Head>
        <Header />
        <div className="mx-auto px-5 pb-32 pt-0 dark:prose-invert sm:prose-lg prose-headings:max-w-2xl prose-headings:font-bold prose-p:max-w-2xl prose-ul:max-w-2xl prose-ul:pl-0 sm:pt-5">
          <Article />
        </div>
        {!subscriber && <PrimaryNewsletterCta className="pt-10" />}
      </Layout>
    </>
  )
}

export default Index

const Header = () => {
  return (
    <header className="relative mx-auto flex w-full max-w-screen-xl flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,#FFF6E7_0%,transparent_65%)] px-5 pb-16 pt-24 text-center dark:bg-[radial-gradient(ellipse_at_top,#1a1e2c_0%,transparent_65%)] sm:pt-28">
      <h1 className="relative z-10 pt-10 text-3xl font-bold sm:text-4xl lg:text-5xl">
        <span className="inline-flex pb-4 text-xs font-semibold uppercase tracking-widest text-amber-600 shadow-cyan-200/50 dark:text-cyan-300 dark:brightness-110 dark:drop-shadow-xl sm:text-sm">
          Start your journey to becoming an Epic Web Developer
        </span>
        <div className="text-balance text-gray-900 dark:text-white">
          Full Stack Workshop Training for Professional Web Developers
        </div>
      </h1>
      <Image
        alt=""
        quality={100}
        priority
        src={require('../../public/assets/marketplace-hero@2x.jpg')}
        fill
        aria-hidden="true"
        className="invisible -mt-10 object-contain object-top dark:visible sm:mt-0 sm:object-cover sm:object-center"
      />
      <Image
        alt=""
        quality={100}
        priority
        src={require('../../public/assets/marketplace-hero-light@2x.jpg')}
        fill
        aria-hidden="true"
        className="visible -mt-10 object-contain object-top dark:invisible sm:mt-0 sm:object-cover sm:object-center"
      />
    </header>
  )
}

function BundleGrid() {
  return (
    <section
      aria-label="bundle grid"
      id="bundles"
      className="not-prose mx-auto mt-16 grid w-full max-w-screen-lg grid-cols-1 gap-5 md:grid-cols-5 md:gap-6"
    >
      <Link
        href="/full-stack"
        className="group h-full w-full overflow-hidden rounded-lg md:col-span-2"
      >
        <article className="relative flex h-full flex-col items-center justify-start overflow-hidden bg-gradient-to-b from-[#23378E] to-[#08195F] text-white transition-all duration-300 ease-in-out group-hover:from-[#273E9F] group-hover:to-[#0A1E73]">
          <div className="relative z-10 flex h-1/2 flex-col items-center justify-center px-10 pb-16 pt-16 text-center md:pb-0 md:pt-0 2xl:h-1/3">
            <h2 className="mb-3 text-balance text-xl font-bold">
              Production Ready Full Stack Web Development Masterclass
            </h2>
            <h3 className="text-balance text-base text-[#D3DCFF] text-opacity-80">
              An epic guide to professional web development by{' '}
              <Image
                src={require('../../public/kent-c-dodds.png')}
                width={28}
                height={28}
                alt="Kent C. Dodds"
                priority
                className="inline-block rounded-full bg-background"
              />{' '}
              Kent C. Dodds.
            </h3>
            <div
              // href="/full-stack"
              // className="mt-8 flex items-center justify-center rounded bg-[linear-gradient(81deg,_#1F8AEB_9.18%,_#224BFF_115.75%)] px-7 py-3 text-center font-semibold text-white shadow-soft-lg transition duration-300 ease-in-out group-hover:brightness-110"
              className="mt-5 inline-flex items-center text-base font-medium"
            >
              Become an Epic Web Dev <ChevronRight className="ml-1 h-3 w-3" />
            </div>
          </div>
          <div className="-gap-10 flex items-center justify-center">
            <Image
              src={
                'https://cdn.sanity.io/images/i1a93n76/production/44ce2b7bb8601b4229774928821f1e100dfa476a-700x700.png'
              }
              alt=""
              aria-hidden="true"
              quality={100}
              priority
              width={200}
              height={200}
              className="drop-shadow-xl"
            />
            <Image
              src={
                'https://res.cloudinary.com/epic-web/image/upload/v1688549362/workshop-image-authentication-strategies-and-implementation_2x.png'
              }
              alt=""
              aria-hidden="true"
              quality={100}
              priority
              width={250}
              height={250}
              className="-ml-8 drop-shadow-xl"
            />
            <Image
              src={
                'https://res.cloudinary.com/epic-web/image/upload/v1688138013/workshop-image-full-stack-foundations_2x.png'
              }
              alt=""
              aria-hidden="true"
              quality={100}
              priority
              width={200}
              height={200}
              className="drop-shadow-xl"
            />
          </div>
        </article>
      </Link>
      <div className="flex h-full w-full grid-cols-1 grid-rows-2 flex-col gap-5 md:col-span-3 md:grid md:gap-6">
        <Link
          href="/testing"
          className="group h-full w-full overflow-hidden rounded-lg shadow-soft-3xl dark:shadow-none"
        >
          <article className="relative flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center transition duration-300 ease-in-out hover:bg-gray-100 dark:bg-gradient-to-bl dark:from-[#1C2030] dark:to-[#11131E] dark:hover:from-[#292E46] dark:hover:to-[#202338] xl:flex-row xl:gap-8 xl:text-left">
            <div className="relative flex flex-shrink-0 items-center justify-center">
              <Image
                src={
                  'https://res.cloudinary.com/epic-web/image/upload/v1728574021/mocking_techniques.png'
                }
                priority
                width={200}
                height={200}
                alt=""
                aria-hidden="true"
                className="absolute blur-[100px]"
              />
              <Image
                src={
                  'https://res.cloudinary.com/epic-web/image/upload/v1728574021/mocking_techniques.png'
                }
                priority
                width={200}
                height={200}
                alt=""
                aria-hidden="true"
                className="relative z-10"
              />
            </div>
            <div className="flex max-w-sm flex-col items-center xl:items-start">
              <h2 className="mb-3 text-balance text-xl font-bold dark:text-white">
                Professional Web Application Testing with Vitest
              </h2>
              <h3 className="max-w-xl text-balance text-base text-opacity-80">
                Learn from the creator and maintainer of Mock Service Worker,{' '}
                <Image
                  src={require('../../public/artem.jpg')}
                  width={28}
                  height={28}
                  alt="Artem Zakharchenko"
                  priority
                  className="inline-block rounded-full"
                />{' '}
                Artem Zakharchenko.
              </h3>
              {/* <div className="mt-8 flex items-center justify-center rounded bg-white px-10 py-3 text-center font-semibold shadow-soft-lg transition duration-300 ease-in-out group-hover:bg-gray-100 dark:bg-[#272B40] dark:group-hover:bg-[#3C415B]">
                Learn more
              </div> */}
            </div>
          </article>
        </Link>
        <Link
          href="/workshops/pixel-perfect-figma-to-tailwind"
          className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg shadow-soft-3xl dark:shadow-none"
        >
          <article className="relative flex h-full w-full flex-col items-center justify-center bg-white p-8 text-center transition duration-300 ease-in-out hover:bg-gray-100 dark:bg-gradient-to-bl dark:from-[#1C2030] dark:to-[#11131E] dark:hover:from-[#292E46] dark:hover:to-[#202338] xl:flex-row xl:gap-8 xl:text-left">
            <div className="relative flex flex-shrink-0 items-center justify-center">
              <Image
                src={
                  'https://res.cloudinary.com/epic-web/image/upload/v1711581753/events/pixel-perfect-figma-to-tailwind_2x.png'
                }
                priority
                width={200}
                height={200}
                alt=""
                aria-hidden="true"
                className="absolute blur-[100px]"
              />
              <Image
                src={
                  'https://res.cloudinary.com/epic-web/image/upload/v1711581753/events/pixel-perfect-figma-to-tailwind_2x.png'
                }
                priority
                width={200}
                height={200}
                alt=""
                aria-hidden="true"
                className="relative z-10"
              />
            </div>

            <div className="flex max-w-sm flex-col items-center xl:items-start">
              <h2 className="mb-3 text-balance text-xl font-bold dark:text-white">
                Layout and Styling with Tailwind
              </h2>
              <h3 className="max-w-xl text-balance text-base text-opacity-80">
                Make pixel-perfect design implementations with Tailwind.
              </h3>
              {/* <div className="mt-8 flex items-center justify-center rounded bg-white px-10 py-3 text-center font-semibold shadow-soft-lg transition duration-300 ease-in-out group-hover:bg-gray-100 dark:bg-[#272B40] dark:group-hover:bg-[#3C415B]">
                Learn more
              </div> */}
            </div>
          </article>
        </Link>
      </div>
    </section>
  )
}

const Article = () => {
  return (
    <article className="prose mx-auto max-w-none dark:prose-invert sm:prose-lg lg:prose-xl prose-headings:mx-auto prose-headings:font-bold prose-p:mx-auto prose-p:max-w-2xl prose-ol:mx-auto prose-ol:max-w-2xl prose-ol:pl-0 prose-ul:mx-auto prose-ul:max-w-2xl">
      <HomepageCopy
        components={{
          BundleGrid: () => <BundleGrid />,
          AboutKent: ({children}: any) => {
            return (
              <div className="rounded-lg border bg-white px-8 py-3 dark:bg-white/5 sm:px-10 sm:py-5">
                <Image
                  src={KentImage}
                  width={150}
                  height={150}
                  alt="Kent C. Dodds"
                  className="float-right ml-5 aspect-square w-32 rounded-full bg-white/5 sm:ml-10 sm:w-auto"
                  style={{
                    shapeOutside: 'circle()',
                  }}
                />
                <div className="pt-2">{children}</div>
              </div>
            )
          },
          WorkshopAppTeaser: ({children}: any) => {
            return (
              <>
                <Image
                  src={require('../../public/assets/workshop-app-teaser@2x.png')}
                  alt="Workshop App Teaser"
                  className="mx-auto hidden w-full max-w-4xl dark:block"
                />
                <Image
                  src={require('../../public/assets/workshop-app-teaser-light@2x.png')}
                  alt="Workshop App Teaser"
                  className="mx-auto block w-full max-w-4xl dark:hidden"
                />
              </>
            )
          },
          li: ({children}: any) => {
            return (
              <li className='list-none py-1 pl-7 before:-ml-7 before:pr-3 before:text-emerald-500 before:content-["✓"] dark:before:text-emerald-300 sm:before:-ml-2'>
                {children}
              </li>
            )
          },
          BundleDescriptions: () => {
            return (
              <div className="not-prose mx-auto mt-20 grid w-full max-w-screen-lg grid-cols-1 gap-8 text-base md:grid-cols-3 [&_h3]:mb-5 [&_h3]:text-2xl [&_h3]:font-bold [&_p]:pb-3 [&_p]:opacity-90">
                <div>
                  <h3>
                    <Link href="/full-stack">Full Stack Web Development</Link>
                  </h3>
                  <p>
                    This is a comprehensive set of workshops designed to give
                    you skills and confidence to build any web application.
                  </p>
                  <Link
                    className="inline-flex items-baseline font-medium leading-none text-black underline underline-offset-2 dark:text-white"
                    href="/full-stack"
                  >
                    Learn more <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div>
                  <h3>
                    <Link href="/testing">
                      Web Application Testing with Vitest
                    </Link>
                  </h3>
                  <p>
                    Testing is a critical component to any successful web
                    application and modern apps can be tricky (at best) to test.
                  </p>
                  <p>
                    These workshops will help ensure your applications are
                    production ready and make them so much nicer to work on.
                  </p>
                  <Link
                    className="inline-flex items-baseline font-medium leading-none text-black underline underline-offset-2 dark:text-white"
                    href="/testing"
                  >
                    Learn more <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
                <div>
                  <h3>
                    <Link href="/workshops/pixel-perfect-figma-to-tailwind">
                      Styling with Tailwind
                    </Link>
                  </h3>
                  <p>
                    Pixel perfect layout is challenging to get right and styling
                    with Tailwind is a critical skill for any web developer.
                  </p>
                  <p>
                    These workshops will elevate your skills and teach you the
                    "beyond the basics" of layout and styling with Tailwind.
                  </p>
                  <Link
                    className="inline-flex items-baseline font-medium leading-none text-black underline underline-offset-2 dark:text-white"
                    href="/workshops/pixel-perfect-figma-to-tailwind"
                  >
                    Learn more <ChevronRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            )
          },
        }}
      />
    </article>
  )
}
