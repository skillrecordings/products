import * as React from 'react'
import Image from 'next/image'
import LandingCopy from 'components/content/landing-copy.mdx'
import {
  SubscribeToConvertkitForm,
  redirectUrlBuilder,
} from '@skillrecordings/convertkit'
import Layout from 'components/app/layout'
import {useRouter} from 'next/router'
import {GetServerSideProps} from 'next'
import {useCoupon} from '../hooks/use-coupon'
import {CommerceProps, propsForCommerce} from '../utils/props-for-commerce'
import {PrimaryNewsletterCta} from '../components/primary-newsletter-cta'
import {isSellingLive} from '../utils/is-selling-live'
import {PricingTiers} from '../components/product-tiers'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  return await propsForCommerce({req, query})
}

const Home: React.FC<CommerceProps> = ({
  couponFromCode,
  purchases = [],
  userId,
  products,
  couponIdFromCoupon,
}) => {
  return (
    <Layout className="bg-white">
      <div>
        <div className="flex flex-col justify-between min-h-screen overflow-hidden">
          <header className="relative text-white bg-green-700 lg:pt-32 sm:pt-24 pt-24 bg-noise">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center text-center px-8">
                <h1 className="lg:max-w-screen-sm md:max-w-lg md:text-4xl sm:text-3xl text-3xl font-heading font-bold lg:text-6xl leading-tighter max-w-sm">
                  <span className="inline-flex">
                    Learn How to Build Accessible Web Apps
                  </span>{' '}
                  <span className="font-heading font-medium pt-8 lg:text-2xl text-lg text-center text-orange-200 md:text-xl">
                    with Marcy Sutton
                  </span>
                </h1>
              </div>
              <div className="sm:translate-y-20 translate-y-16 drop-shadow-2xl sm:w-auto">
                <Image
                  className=""
                  src={require('../../public/assets/travel-journal@2x.png')}
                  width={2048 / 2}
                  height={1427 / 2}
                  quality={100}
                  placeholder="blur"
                  priority={true}
                  alt="an opened travel journal with testing accessibility stickers"
                />
              </div>
            </div>
          </header>
          <main className="w-full sm:pt-28 pt-10">
            <article className="max-w-none prose-p:max-w-screen-sm prose-ul:sm:pr-0 prose-ul:pr-5 prose-p:w-full md:prose-p:px-0 prose-p:px-5 md:prose-headings:px-0 prose-headings:px-5 prose-headings:max-w-screen-sm prose-p:mx-auto prose-headings:mx-auto prose-ul:max-w-screen-sm prose-ul:mx-auto pt-16 text-gray-800 prose prose-lg prose-p:py-2 prose-h2:max-w-[23ch] prose-h2:text-green-800 prose-h2:font-bold prose-h2:pt-0 prose-headings:py-8 prose-p:font-sans prose-li:font-sans prose-h2:font-heading prose-h3:font-heading prose-h3:font-semibold prose-headings:text-center sm:prose-h3:pt-10 prose-h3:pt-0 sm:prose-h3:pb-14 prose-h3:pb-5 sm:prose-h3:max-w-[30ch] prose-h3:max-w-[30ch] prose-h3:mx-auto prose-h3:text-sand-600 lg:prose-xl">
              <LandingCopy />
            </article>
            <div className="max-w-screen-md mx-auto">
              <AboutMarcy />
            </div>
            {isSellingLive ? (
              <div className="flex flex-col justify-center items-center bg-green-700 bg-noise pb-32">
                <div className="pb-80 pt-24 text-white">
                  <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
                      <h2 className="text-3xl  font-extrabold sm:text-4xl lg:text-5xl">
                        Pricing
                      </h2>
                      <p className="text-xl max-w-lg mx-auto">
                        Learn the skills that will help you level up your
                        career!
                      </p>
                    </div>
                  </div>
                </div>
                <div className="px-5">
                  <PricingTiers
                    products={products}
                    userId={userId}
                    purchases={purchases}
                    couponIdFromCoupon={couponIdFromCoupon}
                    couponFromCode={couponFromCode}
                  />
                </div>
              </div>
            ) : (
              <PrimaryNewsletterCta />
            )}
          </main>
        </div>
      </div>
    </Layout>
  )
}

const AboutMarcy = () => {
  return (
    <div className="sm:py-24 py-10 sm:px-10 px-8">
      <div className="sm:mt-0 -mt-24 flex flex-col items-center space-y-4 sm:flex-row sm:items-start  sm:space-x-8 sm:space-y-0 ">
        <div className="flex-shrink-0">
          <Image
            className="rounded-full"
            src={'/marcy-sutton.jpg'}
            width={160}
            height={160}
            quality={100}
            priority
            alt="smiling Marcy Sutton holding a cat and standing next to a microphone"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold font-heading">
            Hi, I'm Marcy Sutton
          </h2>
          <p className="pt-4 sm:text-lg leading-loose text-gray-800">
            I'm an award-winning accessibility specialist and freelance web
            developer. In this self-paced workshop, you will benefit from my
            years of experience as a senior engineer and educator as you learn
            how to build a culture of accessibility at your organization.
          </p>
        </div>
      </div>
    </div>
  )
}
export default Home
