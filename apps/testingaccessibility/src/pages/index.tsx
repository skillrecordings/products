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
import {getToken} from 'next-auth/jwt'
import {getCouponForCode} from '../server/get-coupon-for-code'
import {serialize} from '../utils/prisma-next-serializer'
import {useCoupon} from '../hooks/use-coupon'

export const getServerSideProps: GetServerSideProps = async ({req, query}) => {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const couponFromCode = await getCouponForCode(query.code as string)
  return {
    props: {
      token,
      ...(couponFromCode && {couponFromCode: serialize(couponFromCode)}),
    },
  }
}

const Home: React.FC<{couponFromCode?: {isValid: boolean; id: string}}> = ({
  couponFromCode,
}) => {
  const router = useRouter()
  const {validCoupon, RedeemDialogForCoupon} = useCoupon(couponFromCode)
  return (
    <Layout className="bg-white">
      {validCoupon ? <RedeemDialogForCoupon /> : null}
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
              <div className="sm:translate-y-20 translate-y-16 drop-shadow-2xl sm:w-auto ">
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
            <section
              id="subscribe"
              className="relative flex flex-col items-center justify-center overflow-hidden text-white bg-noise bg-green-700 sm:px-16 px-5 lg:pb-32 sm:pb-24 pb-16 sm:pt-24 pt-10"
            >
              <div className="flex flex-col items-center mb-8">
                <Image
                  aria-hidden="true"
                  src={require('../../public/assets/email@2x.png')}
                  placeholder="blur"
                  priority
                  alt=""
                  width={300}
                  height={180}
                  quality={100}
                />
              </div>
              <h2 className="max-w-lg font-heading mx-auto -mt-4 sm:text-4xl text-3xl leading-none text-center md:text-5xl font-bold sm:mt-0">
                Join my exclusive{' '}
                <span className="whitespace-nowrap">6-part</span> email course
              </h2>
              <h3 className="max-w-md leading-tight pt-6 pb-16 text-xl text-center text-orange-200">
                And learn more about building and testing accessible web
                applications.
              </h3>
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
                actionLabel="Start Testing Accessibility →"
              />
              <p className="pt-8 opacity-80 text-sm">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </section>
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
