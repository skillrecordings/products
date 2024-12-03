import * as React from 'react'
import Image from 'next/image'
import type {SanityDocument} from '@sanity/client'
import type {TestimonialProps, FaqProps, InterviewProps} from '@/@types/'
import type {
  CommerceProps,
  SanityProduct,
} from '@skillrecordings/commerce-server/dist/@types'
import Balancer from 'react-wrap-balancer'
import MuxPlayer from '@mux/mux-player-react'

import PricingSection from '@/components/pricing-section'
import LandingCopy from '@/components/landing/landing-copy.mdx'
import Testimonials from '@/components/landing/testimonials'
import Faqs from '@/components/landing/faqs'
import Greeting from '@/components/landing/greeting'
import Printables from '@/components/landing/printables'
import Interviews from '@/components/landing/interviews'
import WhatIsInTestingJavascript from '@/components/landing/what-is-in-testing-javascript'
import AccessYourCourse from '@/components/landing/access-your-course'
import {MegabundleBanner} from '@/components/megabundle'

type LandingTemplateProps = {
  canViewContent: boolean
  playlists: SanityDocument[]
  testimonials: TestimonialProps[]
  faqs: FaqProps[]
  interviews: InterviewProps[]
  mostValuedProduct: SanityProduct
  commerceProps: CommerceProps
  proTestingPurchased: boolean
  isShowingMegabundle: boolean
}

const LandingTemplate: React.FC<LandingTemplateProps> = ({
  canViewContent,
  playlists,
  testimonials,
  faqs,
  interviews,
  mostValuedProduct,
  commerceProps,
  proTestingPurchased,
  isShowingMegabundle,
}) => {
  const purchasedProduct = mostValuedProduct

  return (
    <>
      <MegabundleBanner isShowing={isShowingMegabundle} className="" />
      <div className="pt-10 pb-20">
        {canViewContent && <AccessYourCourse product={purchasedProduct} />}
        {!canViewContent && (
          <div className="container max-w-6xl mb-32">
            <h1 className="text-center font-heading text-4xl md:text-6xl sm:text-5xl">
              <Balancer>
                Learn the smart, efficient way to test any JavaScript
                application.
              </Balancer>
            </h1>
            <h3 className="flex justify-center items-center text-center mt-5 before:block before:bg-tjs-orange before:w-4 before:h-[2px] before:mr-2 after:block after:bg-tjs-orange after:w-4 after:h-[2px] after:ml-2 text-sm md:text-xl">
              YOUR ESSENTIAL GUIDE TO FLAWLESS TESTING
            </h3>
            <div className="flex justify-center items-center space-x-3 text-sm md:text-base mt-6">
              <span className="uppercase">by</span>
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="/images/portraits/kent-c-dodds.png"
                  width={32}
                  height={32}
                  alt="Kent C. Dodds"
                />
              </div>
              <span className="text-base md:text-xl">Kent C. Dodds</span>
            </div>
            <div className="m-auto w-full max-w-[680px] mt-16">
              <Image
                src="/images/illos/trophy-with-labels.png"
                width={742}
                height={760}
                alt="Trophy"
                priority
              />

              <div className="prose md:prose-md mt-16 lg:mt-32">
                <LandingCopy />
              </div>
            </div>
            <div className="mt-20">
              <MuxPlayer
                streamType="on-demand"
                playbackId="aYqygpEcRs14JrREocaLqqrTuMY4kZKSV7DwWLJNEb00"
              />
            </div>
          </div>
        )}
        <div className="container max-w-6xl">
          <WhatIsInTestingJavascript
            canViewContent={canViewContent}
            mostValuedProduct={mostValuedProduct}
            playlists={playlists}
          />
          <div className="lg:mt-32">
            <h2 className="font-heading max-w-2xl mx-auto text-center font-heading text-4xl md:text-6xl sm:text-5xl">
              <Balancer>Gain insight from industry experts.</Balancer>
            </h2>
            <h3 className="font-tt-regular text-center text-xl md:text-2xl opacity-70 mt-6 md:mt-8">
              Exclusive Pro Testing Bonus Content
            </h3>
          </div>
          <Interviews
            proTestingPurchased={proTestingPurchased}
            interviews={interviews}
            className="mt-20"
          />
          <Printables
            proTestingPurchased={proTestingPurchased}
            className="mt-20"
          />
        </div>
        {!canViewContent && (
          <>
            <Greeting className="mt-20" />
            <PricingSection
              commerceProps={commerceProps}
              className="mt-16 md:mt-24 lg:mt-28 bg-gradient-to-b from-white to-zinc-50"
            />
          </>
        )}
        <div className="container max-w-6xl mt-24 md:mt-28 lg:mt-36">
          {!canViewContent && (
            <Testimonials
              testimonials={testimonials}
              title="What other developers are saying"
            />
          )}
          <Faqs faqs={faqs} className="mt-20 md:mt-24 lg:mt-32" />
        </div>
      </div>
    </>
  )
}

export default LandingTemplate
