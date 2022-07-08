import * as React from 'react'
import Image from 'next/image'
import LandingCopy from 'components/content/landing-copy.mdx'
import NewLandingCopy from 'components/content/new-landing-copy.mdx'
import Layout from 'components/app/layout'
import {GetServerSideProps} from 'next'
import {CommerceProps, propsForCommerce} from '../utils/props-for-commerce'
import {PrimaryNewsletterCta} from '../components/primary-newsletter-cta'
import {isSellingLive} from '../utils/is-selling-live'
import {PricingTiers} from '../components/product-tiers'
import {useCoupon} from 'hooks/use-coupon'
import FAQ from 'components/content/faq-section'

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
  const {redeemableCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)
  return (
    <Layout className="bg-white">
      <div>
        <div className="flex flex-col justify-between min-h-screen overflow-hidden">
          <header className="relative text-white bg-green-700 lg:pt-24 sm:pt-24 pt-12 bg-noise">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center text-center sm:px-8 px-4">
                <p className="font-display font-medium pb-6 lg:text-xl sm:text-lg text-base text-[#FFC165]">
                  Testing Accessibility — by Marcy Sutton
                </p>
                <h1 className="md:max-w-screen-lg lg:text-5xl md:text-5xl sm:text-4xl text-[2rem] font-heading font-bold leading-tight max-w-lg">
                  <span className="inline-flex">
                    Comprehensive Accessibility Training for Shipping
                    High-Quality Web Applications
                  </span>{' '}
                </h1>
                <h2 className="lg:leading-normal max-w-xl font-display inline-block font-normal pt-8 lg:text-xl text-lg text-center text-moss-200">
                  A self-paced workshop designed to teach you the principles and
                  effective patterns of accessibility, from design to
                  deployment.
                </h2>
              </div>
              <div className="sm:translate-y-32 translate-y-24 drop-shadow-2xl sm:w-auto sm:-mt-24 -mt-8 sm:scale-100 scale-125">
                <Image
                  src={require('../../public/assets/travel-journal@2x.png')}
                  width={2622 / 2}
                  height={1585 / 2}
                  quality={100}
                  placeholder="blur"
                  priority={true}
                  alt="an opened travel journal with testing accessibility stickers"
                />
              </div>
            </div>
          </header>
          <main className="w-full sm:pt-28 pt-16">
            <article className="max-w-none prose-p:max-w-screen-sm prose-ul:sm:pr-0 prose-ul:pr-5 prose-p:w-full md:prose-p:px-0 prose-p:px-5 md:prose-headings:px-0 prose-headings:px-5 prose-headings:max-w-screen-sm prose-p:mx-auto prose-headings:mx-auto prose-ul:max-w-screen-sm prose-ul:mx-auto pt-16 text-gray-800 prose prose-lg prose-p:py-2 prose-h2:max-w-[30ch] prose-h2:font-bold prose-h2:pt-0 prose-headings:py-8 prose-p:font-sans prose-li:font-sans prose-h2:font-heading prose-h3:font-heading prose-h3:font-semibold prose-headings:text-center sm:prose-h3:pt-10 prose-h3:pt-0 sm:prose-h3:pb-14 prose-h3:pb-5 sm:prose-h3:max-w-[35ch] prose-h3:max-w-[30ch] prose-h3:mx-auto  lg:prose-xl">
              <NewLandingCopy />
            </article>
            {isSellingLive ? (
              <>
                <div className="flex flex-col justify-center items-center bg-green-700 bg-noise pb-32">
                  <div className="pb-80 sm:pt-32 pt-24 text-white">
                    <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                      <div className="max-w-3xl mx-auto space-y-4 lg:max-w-none">
                        <h2 className="font-heading font-bold lg:text-5xl sm:text-5xl text-4xl">
                          Start Building Accessible Applications{' '}
                          <br className="sm:block hidden" />
                          Like a Seasoned Expert
                        </h2>
                        <p className="text-xl max-w-sm mx-auto pt-4 text-sand-100">
                          The beautiful thing about learning is that nobody can
                          take it away from you.
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
                  <div className="mt-24">
                    <Image
                      src={require('../../public/assets/guarantee-seal@2x.png')}
                      alt="30 day money back guarantee"
                      width={180}
                      height={180}
                    />
                  </div>
                </div>
                <section className="flex flex-col bg-gray-50">
                  <div className="max-w-screen-lg mx-auto w-full py-24">
                    <h2 className="text-center font-heading lg:text-5xl sm:text-4xl text-3xl font-bold pb-24">
                      Frequently Asked Questions
                    </h2>
                    <FAQ />
                  </div>
                </section>
              </>
            ) : (
              <>
                {redeemableCoupon ? <RedeemDialogForCoupon /> : null}
                <PrimaryNewsletterCta />
              </>
            )}
          </main>
        </div>
      </div>
    </Layout>
  )
}

export const AboutMarcy = () => {
  return (
    <div className="sm:p-16 p-10 rounded-md bg-white">
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:space-x-8 sm:space-y-0">
        <div className="flex-shrink-0">
          <Image
            className="rounded-full"
            src={'/marcy-sutton.jpg'}
            width={180}
            height={180}
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
