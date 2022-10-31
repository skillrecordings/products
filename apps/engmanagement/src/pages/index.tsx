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
import AmazonLogo from '../components/amazon-logo'

const AMAZON_URL = process.env.NEXT_PUBLIC_AMAZON_URL

const Home: React.FC<React.PropsWithChildren<CommerceProps>> = (props) => {
  return (
    <Layout hideNav={true}>
      <Header />
      <main>
        <Content />
        <SubscribeSection />
        {/* {isSellingLive ? <CommerceSection {...props} /> : <SubscribeSection />} */}
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
          <div className="flex-grow sm:text-left text-center transform sm:scale-100 scale-90 relative z-10 w-full">
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

            <div className="pt-16 flex sm:flex-row flex-col items-center sm:justify-start justify-center w-full gap-3 flex-shrink-0">
              {AMAZON_URL && (
                <a
                  href={AMAZON_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded w-full flex flex-col items-center justify-center px-12  py-3 uppercase font-brandon font-bold text-xs bg-white text-gray-900 transition-all ease-in-out shadow-xl sm:shadow-white/20 hover:bg-gray-100"
                >
                  <span className="pb-1.5 text-sm">
                    Buy now at <span className="sr-only">Amazon.com</span>
                  </span>
                  <AmazonLogo />
                </a>
              )}
              <a
                href="#get-free-chapter"
                className={cx(
                  'px-7 sm:w-auto w-full flex-shrink-0 border border-white/20 rounded py-4 font-brandon font-bold text-lg  text-white bg-gray-800/50 hover:bg-gray-700/50 transition-all ease-in-out shadow-xl',
                )}
              >
                Get Free Chapter
              </a>
            </div>
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
    <section
      id="get-free-chapter"
      className="bg-gray-800 lg:py-48 sm:py-32 py-16 p-5 lg:mt-32 sm:mt-24 mt-16"
    >
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
