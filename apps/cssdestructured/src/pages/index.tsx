import * as React from 'react'
import Layout from 'components/app/layout'
import config from 'config'
import LandingCopy from 'components/content/landing-copy.mdx'
import {
  redirectUrlBuilder,
  SubscribeToConvertkitForm,
} from '@skillrecordings/convertkit'
import Link from 'next/link'
import Image from 'next/image'
import {Logo, GridVisual} from 'components/images'
import {scroller, Element as ScrollElement} from 'react-scroll'
import HorizontalGridImage from '../../public/assets/bottom.svg'
import {WithStars} from 'components/mdx/highlights'
import Button from '@skillrecordings/react/dist/components/button'
import {useRouter} from 'next/router'
import Emma from '../../public/emma-bostian--square@2x.jpg'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Layout nav={null} meta={{title: config.defaultTitle}}>
        <header className="flex md:flex-row flex-col relative w-full overflow-hidden border-b border-white border-opacity-5 lg:max-h-[860px] md:max-h-[560px] lg:h-screen h-full">
          <div
            className={`md:w-1/2 w-full flex flex-col items-center md:justify-between justify-start md:py-16 py-8 md:pl-8`}
          >
            <Link href="/" passHref aria-label="Home">
              <a>
                <Logo />
              </a>
            </Link>
            <div className="text-center py-24">
              <h1 className="font-serif xl:text-8xl lg:text-7xl sm:text-6xl text-6xl xl:leading-[60%] lg:leading-[60%] sm:leading-[60%] leading-[60%] text-brand-text xl:max-w-lg max-w-md">
                A Comprehensive Approach
                <br />
                to Learning <span className="font-serif-star">C</span>SS
              </h1>
              <h2 className="sm:text-base text-xs font-display text-brand-mustard sm:pt-4 pt-3 tracking-wider">
                eMbRace Your eXperTise
              </h2>
            </div>
            <Button
              onClick={() => {
                scroller.scrollTo('content', {
                  smooth: 'easeInOutQuint',
                  ignoreCancelEvents: true,
                })
              }}
              aria-label="Scroll to course description"
              className="group pr-2 flex items-center rounded-full focus:ring-1 focus:ring-offset-2 focus:ring-offset-background focus:ring-brand-brightYellow focus:ring-opacity-20 focus:outline-none"
            >
              <div className="relative sm:w-auto w-12 z-30 flex items-center justify-center rounded-full overflow-hidden p-px border border-brand-brightYellow">
                <Image
                  priority={true}
                  placeholder="blur"
                  src={Emma}
                  alt="Emma Bostian"
                  quality={100}
                  width={48}
                  height={48}
                  className="rounded-full group-hover:opacity-0 opacity-100 transition-all ease-in-out duration-500 group-hover:translate-y-16"
                />
                <div
                  aria-hidden
                  className="p-6 absolute flex items-center justify-center overflow-hidden group rounded-full bg-brand-brightYellow bg-opacity-0 hover:bg-opacity-10 transition-all ease-in-out duration-200"
                >
                  <i className="absolute opacity-0 group-hover:opacity-0 group-hover:translate-y-10 gg-arrow-down text-brand-yellow scale-75 transition-all ease-in-out duration-500" />
                  <i className="absolute opacity-0 group-hover:opacity-90 group-hover:translate-y-0 -translate-y-10 gg-arrow-down text-brand-yellow scale-75 transition-all ease-in-out duration-500" />
                </div>
              </div>
              <div className="pl-2 text-sm">
                <span className="opacity-80 font-light">New course by</span>{' '}
                <strong className="text-brand-cream font-medium">
                  Emma Bostian
                </strong>
              </div>
            </Button>
          </div>
          <div className="md:w-auto w-full">
            <GridVisual />
          </div>
        </header>
        <ScrollElement name="content" />
        <main className="flex flex-col w-full min-h-screen justify-center">
          <article className="prose sm:prose-xl w-full max-w-2xl mx-auto lg:pt-24 sm:pt-24 pt-12 px-5 lg:pb-32 sm:pb-32 pb-32">
            <LandingCopy />
          </article>
          <section className="flex flex-col items-center justify-center w-full relative overflow-hidden">
            <Image src={HorizontalGridImage} />
            <div className="flex flex-col items-center justify-center w-full relative z-10 sm:py-32 py-24 px-5">
              <h3 className="pb-4 font-serif sm:text-7xl text-6xl text-brand-text text-center xl:leading-[60%] lg:leading-[60%] sm:leading-[60%] leading-[60%]">
                Grow your <span className="font-serif-star">C</span>SS confiden
                <span className="font-serif-alt">ce</span>
              </h3>
              <div className="font-display pb-8 tracking-wide text-brand-cream text-center max-w-[30ch]">
                Join the free email course today!
              </div>
              <SubscribeToConvertkitForm
                onSuccess={(subscriber: any) => {
                  if (subscriber) {
                    const redirectUrl = redirectUrlBuilder(
                      subscriber,
                      '/confirm',
                    )
                    router.push(redirectUrl)
                  }
                }}
                submitButtonElem={
                  <Button className="group hover:shadow-xl overflow-hidden tracking-wide font-display hover:scale-105 transition-all ease-in-out duration-500 hover:bg-brand-red outline-none flex items-center justify-center mt-5 mx-auto bg-brand-orange px-8 py-3 font-semibold rounded-tr-2xl focus:outline-none focus:ring-1 focus:ring-brand-yellow">
                    <WithStars className="font-semibold flex items-center z-10">
                      SUbscRibe
                    </WithStars>
                    <div
                      className="origin-center text-center leading-none group-hover:scale-[2800%] transition-all ease-in-out duration-500 scale-0 absolute text-brand-red z-0"
                      aria-hidden
                    >
                      ✦
                    </div>
                  </Button>
                }
              />
              <div className="text-center pt-16 text-sm italic text-brand-text opacity-70">
                No spam, unsubscribe any time.
              </div>
            </div>
          </section>
        </main>
      </Layout>
    </>
  )
}
