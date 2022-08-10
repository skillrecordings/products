import * as React from 'react'
import {GetServerSideProps} from 'next'
import type {CommerceProps} from '@skillrecordings/commerce-server/dist/@types'
import Layout from 'layouts'
import LandingCopy from 'components/landing-copy.mdx'
import get from 'lodash/get'
import Image from 'next/image'
import BookCover from '../../public/images/engineering-management-for-the-rest-of-us-book-mockup-front@2x.jpg'
import SarahDrasner from '../../public/images/sarah-drasner@2x.jpg'
import cx from 'classnames'
import AngieJones from '../../public/images/angie-jones@2x.png'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import {useRouter} from 'next/router'
import {getToken} from 'next-auth/jwt'
import {getActiveProducts} from 'lib/products'
import {propsForCommerce} from '@skillrecordings/commerce-server'
import {Element, scroller} from 'react-scroll'
import {PricingTiers} from 'components/product-tiers'
import {isSellingLive} from 'utils/is-selling-live'

const AMAZON_URL = process.env.NEXT_PUBLIC_AMAZON_URL

const Home: React.FC<React.PropsWithChildren<CommerceProps>> = (props) => {
  return (
    <Layout hideNav={true}>
      <Header />
      <main>
        <Content />
        {isSellingLive ? <CommerceSection {...props} /> : <SubscribeSection />}
      </main>
    </Layout>
  )
}

const Header = () => {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-2 bg-gray-700" />
      <header className="min-h-[60vh] lg:pb-24 sm:pb-16 pb-8 lg:pt-16 sm:pt-8 pt-0 flex items-center justify-center px-5">
        <div className="max-w-[900px] mx-auto w-full flex sm:flex-row flex-col-reverse items-center">
          <div className="flex-grow sm:text-left text-center transform sm:scale-100 scale-90 relative z-10">
            <h1 className="font-din lg:text-7xl text-6xl uppercase leading-[90%]">
              Engineering
              <br />
              Management
              <br />
              <div className="leading-[100%] transform sm:-translate-y-5 -translate-y-4">
                <span className="font-souvenir font-medium inline-block tracking-wider lg:text-4xl text-3xl text-orange-300">
                  for the
                </span>
                <span className="block">Rest of Us</span>
              </div>
            </h1>
            <div className="flex items-center sm:space-x-3 sm:justify-start justify-center">
              <div className="flex items-center justify-center sm:w-auto w-24 rounded-full overflow-hidden">
                <Image
                  width={80}
                  height={80}
                  placeholder="blur"
                  src={SarahDrasner}
                  alt="Sarah Drasner, the author of Engineering Management for the Rest of Us book"
                  quality={95}
                  className="rounded-full"
                />
              </div>
              <div className="pl-2 text-left">
                <div className="text-base text-orange-300 font-medium leading-[100%] sm:pt-0 pt-2">
                  A book by
                </div>
                <h2 className="font-brandon md:text-2xl sm:text-xl text-2xl text-gray-100">
                  <span className="sr-only">by </span>Sarah Drasner
                </h2>
              </div>
            </div>
            {isSellingLive && (
              <div className="pt-16 flex items-center sm:justify-start justify-center w-full gap-4 flex-shrink-0">
                <button
                  onClick={() => scroller.scrollTo('buy', {})}
                  className={cx(
                    'flex-shrink-0 border border-white/20 focus-visible:outline-white rounded-sm  py-4 uppercase font-brandon font-bold sm:text-lg text-xl bg-[#FFAA4E] text-gray-900 hover:scale-105 transition-all ease-in-out shadow-xl shadow-orange-500/30 hover:bg-[#FF9C31]',
                    {
                      'px-12': AMAZON_URL,
                      'px-16': !AMAZON_URL,
                    },
                  )}
                >
                  Buy Now
                </button>
                {AMAZON_URL && (
                  <a
                    href={AMAZON_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-sm flex flex-col items-center justify-center px-8 py-2 uppercase font-brandon font-bold text-xs bg-gray-700/70 text-white hover:scale-105 transition-all ease-in-out shadow-xl hover:bg-gray-700"
                  >
                    <span className="pb-1.5">Buy now at</span>
                    <AmazonLogo />
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="max-w-[550px] sm:mx-0 -mx-5">
            <Image
              placeholder="blur"
              src={BookCover}
              alt="Book mockup of Engineering Management for the Rest of Us"
              quality={95}
              priority={true}
            />
          </div>
        </div>
      </header>
    </>
  )
}

const Content = () => {
  return (
    <>
      <div className="prose prose-dark lg:prose-2xl sm:prose-xl max-w-screen-md prose-lg mx-auto px-5">
        <LandingCopy />
      </div>
      <section className="px-5">
        <Author />
      </section>
      <section className="px-5">
        <ChapterGuide />
      </section>
    </>
  )
}

const CommerceSection: React.FC<CommerceProps> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
  defaultCoupon,
}) => {
  return (
    <section className="flex flex-col justify-center items-center py-24 bg-black/20 mt-24 px-5">
      <h2 className="lg:text-6xl text-5xl font-din uppercase text-center max-w-[25ch] pb-10">
        Pre-order Limited Edition Of the Book Today!
      </h2>
      <div className="px-5 pt-8">
        <Element name="buy" aria-hidden="true" />
        <PricingTiers
          products={products}
          userId={userId}
          purchases={purchases}
          couponIdFromCoupon={couponIdFromCoupon}
          couponFromCode={couponFromCode}
        />
      </div>
    </section>
  )
}

const SubscribeSection = () => {
  const router = useRouter()
  return (
    <section className="bg-gray-800 lg:py-48 sm:py-32 py-16 p-5 lg:mt-32 sm:mt-24 mt-16">
      <div className="max-w-screen-md w-full mx-auto">
        <div className="text-center w-full inline-block  md:pb-20 sm:pb-16 pb-10">
          <h2 className="uppercase font-din  lg:text-6xl sm:text-5xl text-5xl tracking-wide">
            Get a sneak peek at the book
          </h2>
          <p className="text-orange-300 sm:text-3xl text-2xl pt-2 font-souvenir tracking-tight">
            Free chapter delivered to your inbox.
          </p>
        </div>
        {/* free chapter form */}
        <SubscribeToConvertkitForm
          formId={2610221} // the-value-of-values article
          actionLabel="Get Free Chapter"
          onSuccess={(subscriber: any) => {
            if (subscriber) {
              const redirectUrl = redirectUrlBuilder(subscriber, '/confirm', {
                title: 'Free Chapter',
              })
              router.push(redirectUrl)
            }
          }}
          successMessage="Thanks! A link to access this article just got sent to your email address."
        />
        {/* regular subscribe form */}
        {/* <SubscribeToConvertkitForm
            onSuccess={(subscriber: any) => {
              if (subscriber) {
                const redirectUrl = redirectUrlBuilder(subscriber, '/confirm')
                router.push(redirectUrl)
              }
            }}
          /> */}
        <div className="text-lg text-center text-gray-200 pt-16">
          No spam, unsubscribe any time.
        </div>
      </div>
    </section>
  )
}

export default Home

const Author = () => {
  return (
    <div className="max-w-screen-lg mx-auto w-full pt-8">
      <Decoration />
      <h3 className="font-din uppercase text-center w-full inline-block lg:text-6xl sm:text-5xl text-5xl tracking-wide sm:pb-16 pb-8">
        A Book by <span className="text-orange-300 block">Sarah Drasner</span>
      </h3>
      <div className=" flex sm:flex-row flex-col items-center justify-center sm:space-x-10 max-w-screen-md mx-auto w-full">
        <div className="flex-shrink-0 sm:pb-0 pb-6">
          <a
            href="https://sarah.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={SarahDrasner}
              alt="Sarah Drasner, the author of Engineering Management for the Rest of Us book"
              width={170}
              height={170}
              quality={95}
              placeholder="blur"
              className="rounded-md"
            />
            <span className="sr-only">Sarah Drasner's personal site</span>
          </a>
        </div>
        <p className="sm:text-xl text-lg text-gray-200">
          Sarah Drasner has more than 10 years of experience in Engineering
          Management at all levels, from Lead to VP at Netlify, Microsoft and
          Trulia/Zillow Group. She’s an award-winning speaker, author of SVG
          Animations from O’Reilly, Vue core team emeritus, and co-organizer of
          ConcatenateConf.
        </p>
      </div>
      <div className="italic text-xl font-medium justify-center flex sm:flex-row flex-col items-center leading-none pt-10 text-gray-200">
        <span className="sm:pr-3 sm:py-0 py-3">With a foreword by</span>
        <a
          href="https://twitter.com/techgirl1908"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center hover:underline"
        >
          <div className="sm:w-auto w-12">
            <Image
              src={AngieJones}
              alt="Angie Jones"
              width={64}
              height={64}
              className="rounded-full"
            />
          </div>
          <span className="pl-2">Angie Jones</span>
        </a>
      </div>
      <Decoration className="transform rotate-180" />
    </div>
  )
}

const ChapterGuide = () => {
  return (
    <div className="max-w-screen-lg mx-auto w-full">
      <h3 className="font-din uppercase text-center w-full inline-block lg:text-6xl sm:text-5xl text-5xl tracking-wide md:py-24 sm:py-16 py-16">
        Chapter Guide
      </h3>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-16 gap-16 ">
        {Object.keys(chapters).map((chapter: any, i: number) => {
          return (
            <div key={chapter}>
              <h4 className="pb-4 sm:text-3xl text-2xl  font-souvenir text-orange-200">
                <span className="text-orange-300">
                  {('0' + (i + 1)).slice(-2)}
                </span>{' '}
                {chapter}
              </h4>
              <ul className=" text-xl font-brandon">
                {get(chapters, chapter).map((section: any) => {
                  return (
                    <li
                      key={section}
                      className="sm:py-4 py-2 leading-tight flex"
                    >
                      <span
                        aria-hidden={true}
                        className="pr-2 text-orange-300 inline-block"
                      >
                        ・
                      </span>
                      <span className="text-gray-100">{section}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
      <div className="lg:pt-16 sm:pt-8 pt-10 max-w-screen-md sm:text-center mx-auto">
        <p className="italic text-gray-300 lg:text-xl text-lg">
          A lot of the material has been open-sourced, here is a{' '}
          <a
            className="text-orange-200 underline"
            href="https://sarah.dev/writing/"
            target="_blank"
            rel="noopener noreferrer"
          >
            list of some of them
          </a>
          . You’re welcome to read the content there as well. The book has been
          edited and compiled as a cohesive whole, and includes a few chapters
          not publicly available.
        </p>
      </div>
    </div>
  )
}

const chapters = {
  'Your Team': [
    'One-on-ones are critical',
    'The Importance of Career Laddering',
    "Mistakes I've Made as an Engineering Manager",
    'The Value of Values',
    'Trust and Vulnerability',
    'Happiness and Drive',
    'Feedback',
    'Your Team is Not "Them"',
    'How to Scope Down PRs',
  ],
  Collaboration: [
    'Prioritizing Your Teams Work',
    'Splitting Time Between Product and Engineering Efforts',
    'Good Meetings',
    'Managing Conflicts',
    'Speed of Execution',
    'Cross-Team and Open Source Etiquette',
  ],
  'Your Work': ['Prioritizing Your Own Work', 'Scheduling', 'Filling your Cup'],
}

export const Decoration = ({className = ''}) => (
  <svg
    className={`${className} pt-8 pb-16 w-32 mx-auto text-gray-600`}
    viewBox="0 0 91 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M90.0292 15.4441C89.6798 13.6668 88.5698 12.1414 86.8303 11.5001C84.7052 10.7148 82.097 11.4734 81.3084 13.7374C80.6396 15.6561 81.8194 18.0934 84.085 17.8708C85.0886 17.7734 85.9536 16.9948 85.964 15.9468C85.9688 15.4641 85.7855 14.9721 85.3798 14.6868C85.2792 14.6161 84.2948 14.2694 84.273 14.5001C84.3198 14.3668 84.973 14.6054 85.0542 14.6534C85.3974 14.8574 85.6094 15.2334 85.6427 15.6268C85.7126 16.4668 85.0375 17.1694 84.2246 17.2321C82.1646 17.3908 81.5511 14.9281 82.6063 13.5201C83.7495 11.9948 86.0604 12.1788 87.4094 13.3174C88.937 14.6068 89.0651 16.7734 88.087 18.4321C85.7651 22.3694 80.5547 21.4188 77.2708 19.3574C73.4864 16.9814 70.9751 13.0494 67.1074 10.7761C63.1016 8.42145 58.4558 8.81076 54.461 10.9534C56.3964 8.45476 56.7287 4.36544 54.1755 2.13477C52.2094 0.416106 48.8246 0.242761 47.1672 2.48943C46.3432 3.60676 46.1016 5.22142 46.7375 6.48542C47.4563 7.91476 49.449 8.68012 50.849 7.74812C51.8694 7.06812 52.2875 5.37076 51.223 4.52143C50.4162 3.87743 48.711 4.28809 49.112 5.55343C49.0022 4.19743 50.9636 4.26145 51.1746 5.47478C51.4438 7.02678 49.5391 7.57478 48.464 6.81212C47.2662 5.96145 47.435 4.16145 48.3183 3.14945C49.0422 2.31879 50.1344 2.07344 51.1907 2.19744C54.7495 2.6161 55.6198 6.83077 54.3131 9.63077C53.9735 10.3588 53.5131 11.0081 52.9844 11.6121C52.3667 12.3161 51.5068 12.7641 50.7422 13.3001C49.3464 14.2801 47.9798 15.3001 46.5755 16.2694C43.7964 18.1854 41.0006 19.5521 37.6282 19.9428C39.9459 19.8721 42.0307 19.3854 44.1323 18.3774C46.5683 17.2068 48.7834 15.6521 51.0443 14.1841C55.2531 11.4534 61.0574 8.32811 65.6438 12.1068C69.1516 14.9974 69.4574 21.1588 64.9287 23.2588C62.8016 24.2454 60.174 23.8854 58.7246 21.9388C57.4219 20.1881 57.4271 17.5708 59.2672 16.1948C61.2823 14.6881 64.6427 15.6841 64.5183 18.5481C64.4011 21.2468 60.1178 21.8228 59.9667 18.9054C59.9151 20.6214 61.6766 21.5614 63.1891 21.0014C64.9714 20.3401 65.4698 18.2281 64.6646 16.6294C62.8656 13.0601 57.7323 14.7081 56.8724 18.0961C56.0422 21.3681 58.5724 24.6054 61.8178 25.0188C65.5594 25.4961 69.0698 22.6281 69.6178 18.9588C70.1646 15.2961 68.0307 11.5934 64.7454 9.99743C70.25 12.1548 72.8516 18.2454 78.0172 20.9508C80.3918 22.1934 83.588 22.9268 86.1407 21.8094C88.5271 20.7641 90.4714 18.1401 90.0292 15.4441C90.0031 15.3108 90.1902 16.4254 90.0292 15.4441"
      fill="currentColor"
    />
    <path
      d="M52.464 19.8441C49.5494 19.7135 46.6921 17.8695 44.3708 16.2695C42.9666 15.3001 41.6005 14.2801 40.2041 13.3001C39.5374 12.8335 38.7526 12.4295 38.1802 11.8548C37.6218 11.2935 37.1412 10.6188 36.776 9.91879C35.3953 7.27212 35.888 3.21881 39.1636 2.31081C40.0442 2.06681 41.1156 2.09481 41.927 2.56947C43.1281 3.27214 43.8026 5.0268 43.0026 6.26547C42.2156 7.4868 39.8802 7.55747 39.7578 5.80414C39.6557 4.33347 41.953 4.05212 41.8349 5.55346C42.236 4.28812 40.5306 3.87746 39.724 4.52146C38.6584 5.37079 39.0781 7.06815 40.0973 7.74815C41.4973 8.68015 43.4901 7.91479 44.2088 6.48546C44.8453 5.22146 44.6036 3.60679 43.7792 2.48946C42.1224 0.244127 38.7369 0.416139 36.7708 2.13481C34.2182 4.36547 34.55 8.45479 36.486 10.9535C33.0125 9.09079 28.9901 8.47615 25.2792 10.0468C21.1229 11.8068 18.4792 15.7001 15.013 18.4108C11.9797 20.7828 6.87449 22.6908 3.71089 19.5241C2.38595 18.1975 1.72649 16.1588 2.64782 14.4148C3.49209 12.8188 5.66395 11.8868 7.35462 12.7001C9.05409 13.5175 9.61929 16.4721 7.48169 17.1388C6.58382 17.4188 5.56248 17.0495 5.34582 16.0575C5.24315 15.5895 5.35462 15.0908 5.72862 14.7735C5.84582 14.6721 6.60462 14.3041 6.67395 14.5001C6.65875 14.3481 5.82862 14.5441 5.80462 14.5548C5.45515 14.7041 5.20049 15.0001 5.07289 15.3535C4.73115 16.3041 5.32502 17.3601 6.22342 17.7215C7.91822 18.4068 9.62542 17.0148 9.81609 15.3361C10.0338 13.4228 8.69529 11.6961 6.84369 11.2975C4.92702 10.8855 2.92128 11.7041 1.79115 13.2895C-0.327649 16.2588 1.52182 20.2135 4.55208 21.6921C8.25262 23.4988 12.8442 21.4801 15.7322 19.0321C19.2193 16.0761 21.7942 11.7241 26.201 9.99747C23.1328 11.4881 21.126 14.7415 21.2546 18.1668C21.3885 21.7521 24.2656 24.7495 27.8364 25.0428C31.2026 25.3188 34.3078 22.6588 34.2213 19.2081C34.136 15.7908 29.8568 12.9735 27.0354 15.6175C25.5937 16.9668 25.4161 19.5361 27.177 20.7041C28.7093 21.7215 31.0412 20.9335 30.9797 18.9055C30.851 21.3881 27.45 21.4588 26.6021 19.3668C25.6302 16.9681 28.275 14.9215 30.4781 15.5881C32.6093 16.2335 33.5958 18.4641 32.9421 20.5308C32.2088 22.8481 29.8754 24.1255 27.5254 23.7162C22.427 22.8268 21.3265 16.7455 24.3026 13.1095C28.0489 8.53481 34.0541 10.5961 38.2942 13.1695C40.8639 14.7295 43.2765 16.5641 45.9526 17.9455C48.3297 19.1721 50.6489 19.8615 53.3182 19.9428C53.0338 19.9095 52.7484 19.8761 52.464 19.8441C51.8989 19.8188 53.0213 19.9081 52.464 19.8441"
      fill="currentColor"
    />
  </svg>
)

const AmazonLogo = () => {
  return (
    <svg
      className="w-28"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 119 24"
    >
      <path
        fill="#F90"
        d="M47.607 18.095c-4.46 3.287-10.923 5.04-16.488 5.04-7.803 0-14.828-2.886-20.143-7.686-.417-.377-.043-.892.458-.598 5.736 3.337 12.827 5.345 20.152 5.345 4.94 0 10.376-1.022 15.373-3.144.755-.32 1.386.495.648 1.043"
      />
      <path
        fill="#F90"
        d="M49.46 15.973c-.567-.728-3.767-.344-5.203-.173-.438.053-.505-.328-.11-.602 2.548-1.793 6.73-1.276 7.218-.674.487.604-.127 4.796-2.522 6.797-.368.308-.718.144-.555-.263.538-1.343 1.744-4.353 1.173-5.085"
      />
      <path
        fill="#fff"
        d="M44.357 2.535V.791c0-.263.2-.44.44-.44h7.807c.25 0 .451.18.451.44v1.494c-.003.25-.214.578-.588 1.095l-4.045 5.776c1.503-.037 3.09.187 4.453.955.307.174.39.428.414.678v1.86c0 .255-.28.552-.575.398-2.401-1.26-5.591-1.396-8.247.013-.27.148-.554-.146-.554-.4v-1.767c0-.284.003-.769.287-1.2l4.686-6.72h-4.078c-.251 0-.451-.177-.451-.438ZM15.88 13.415h-2.375a.449.449 0 0 1-.424-.404V.82c0-.243.204-.437.458-.437h2.214c.23.01.414.187.431.407v1.594h.044C16.805.845 17.89.127 19.354.127c1.486 0 2.415.718 3.083 2.258.575-1.54 1.88-2.258 3.28-2.258.996 0 2.085.41 2.75 1.332.751 1.026.597 2.516.597 3.822l-.003 7.692a.449.449 0 0 1-.457.441h-2.372a.452.452 0 0 1-.428-.44v-6.46c0-.515.047-1.798-.066-2.285-.177-.819-.709-1.05-1.397-1.05-.574 0-1.176.385-1.42 1-.243.614-.22 1.643-.22 2.334v6.46a.449.449 0 0 1-.457.442h-2.372a.449.449 0 0 1-.427-.441l-.004-6.46c0-1.36.224-3.361-1.463-3.361-1.707 0-1.64 1.95-1.64 3.36v6.46a.45.45 0 0 1-.458.442ZM59.776.127C63.3.127 65.207 3.153 65.207 7c0 3.718-2.108 6.668-5.431 6.668-3.46 0-5.345-3.027-5.345-6.798 0-3.795 1.908-6.744 5.345-6.744Zm.02 2.488c-1.75 0-1.86 2.385-1.86 3.872 0 1.49-.024 4.67 1.84 4.67 1.84 0 1.927-2.566 1.927-4.13 0-1.028-.044-2.257-.354-3.233-.267-.848-.798-1.179-1.553-1.179Zm9.98 10.8h-2.364a.451.451 0 0 1-.428-.441L66.981.782a.45.45 0 0 1 .458-.398h2.2c.208.01.378.15.425.34v1.864h.044C70.772.922 71.704.127 73.344.127c1.066 0 2.105.384 2.773 1.436.621.975.621 2.615.621 3.795v7.672a.456.456 0 0 1-.458.385H73.9a.45.45 0 0 1-.421-.385V6.41c0-1.333.154-3.284-1.486-3.284-.578 0-1.11.388-1.373.976-.334.744-.378 1.486-.378 2.308v6.564a.457.457 0 0 1-.464.44Zm8.449-.97c0-.614.524-1.108 1.169-1.108.644 0 1.169.494 1.169 1.109 0 .611-.525 1.112-1.17 1.112-.644 0-1.168-.5-1.168-1.112Zm25.163.973a.446.446 0 0 1-.441-.44V.787a.44.44 0 0 1 .424-.4h.872c.24 0 .434.173.454.4v1.777c.621-1.41 1.777-2.512 3.237-2.512h.177c1.55 0 2.682 1.142 3.103 2.803.658-1.64 1.894-2.803 3.524-2.803h.18c1.153 0 2.262.742 2.836 1.87.555 1.08.535 2.516.535 3.722l-.004 7.332a.445.445 0 0 1-.424.44h-1.042a.456.456 0 0 1-.441-.38V5.645c0-.872.043-1.797-.311-2.592-.36-.812-1.052-1.32-1.793-1.356-.829.04-1.59.644-2.085 1.46-.641 1.052-.618 2-.618 3.23v6.657a.457.457 0 0 1-.424.374h-1.036a.45.45 0 0 1-.444-.44l-.006-7.82c0-.719-.044-1.564-.375-2.209-.384-.735-1.072-1.216-1.793-1.253-.749.044-1.504.615-1.951 1.28-.578.848-.688 1.897-.688 2.976v7.025a.452.452 0 0 1-.428.44h-1.038Zm-7.156.254c-3.37 0-4.88-3.437-4.88-6.875 0-3.614 1.774-6.744 5.168-6.744h.18c3.3 0 4.944 3.334 4.944 6.771 0 3.641-1.82 6.848-5.234 6.848h-.177Zm.248-1.667c1.109-.037 1.984-.725 2.502-1.87.464-1.03.554-2.209.554-3.338 0-1.229-.133-2.512-.711-3.564-.518-.918-1.407-1.503-2.349-1.536-1.049.036-1.987.748-2.458 1.844-.424.948-.555 2.208-.555 3.256 0 1.18.154 2.542.642 3.568.474.972 1.386 1.603 2.375 1.64ZM85.7 11.95c1.514-.046 2.308-1.259 2.636-2.829.067-.197.217-.347.438-.347l.998-.004c.238.01.455.19.435.411-.461 2.676-2.075 4.49-4.373 4.49h-.18c-3.347 0-4.79-3.36-4.79-6.771 0-3.384 1.463-6.848 4.81-6.848h.18c2.325 0 3.982 1.79 4.343 4.466 0 .2-.188.374-.408.398l-1.045-.014c-.22-.03-.364-.217-.398-.427-.25-1.493-1.109-2.683-2.539-2.73-2.275.074-2.923 2.873-2.923 5.028 0 2.074.541 5.104 2.816 5.177Zm-43.338-.771c-.434-.601-.895-1.09-.895-2.201v-3.7c0-1.567.11-3.007-1.045-4.086C39.51.317 38 .01 36.844.01c-2.258 0-4.783.841-5.311 3.634-.057.297.16.454.354.498l2.301.247c.218-.01.375-.22.415-.434.197-.962 1.002-1.427 1.907-1.427.491 0 1.046.18 1.333.618.334.488.29 1.156.29 1.72v.308c-1.376.157-3.176.257-4.466.825-1.49.641-2.532 1.954-2.532 3.882 0 2.468 1.553 3.7 3.555 3.7 1.686 0 2.612-.397 3.915-1.726.43.624.574.928 1.362 1.583a.496.496 0 0 0 .562-.057l.003.007c.474-.421 1.336-1.172 1.82-1.577.194-.16.16-.417.01-.631ZM37.69 10.11c-.377.668-.978 1.079-1.643 1.079-.912 0-1.447-.695-1.447-1.72 0-2.025 1.814-2.392 3.535-2.392v.514c0 .926.023 1.697-.445 2.52Zm-26.463 1.07c-.434-.601-.895-1.09-.895-2.201V5.278c0-1.567.11-3.007-1.046-4.086C8.374.317 6.864.01 5.71.01 3.45.01.929.85.398 3.644c-.054.297.16.454.353.498l2.305.247c.214-.01.371-.22.411-.434.197-.962 1.006-1.427 1.911-1.427.488 0 1.042.18 1.333.618.33.488.287 1.156.287 1.72v.308c-1.376.157-3.177.257-4.466.825C1.046 6.64 0 7.953 0 9.881c0 2.468 1.557 3.7 3.554 3.7 1.69 0 2.612-.397 3.915-1.726.434.624.575.928 1.363 1.583a.496.496 0 0 0 .561-.057l.007.007a99.556 99.556 0 0 1 1.82-1.577c.194-.16.16-.417.007-.631Zm-4.673-1.07c-.378.668-.976 1.079-1.644 1.079-.912 0-1.443-.695-1.443-1.72 0-2.025 1.814-2.392 3.531-2.392v.514c0 .926.023 1.697-.444 2.52Z"
      />
    </svg>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const {req, query} = context
  if (process.env.NODE_ENV === 'development') {
    const token = await getToken({req})
    const {products} = await getActiveProducts()

    return await propsForCommerce({query, token, products})
  } else {
    return {
      props: {},
    }
  }
}
