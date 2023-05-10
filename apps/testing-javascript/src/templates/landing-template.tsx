import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import LandingCopy from 'components/landing-copy.mdx'

type LandingTemplateProps = {
  isPro: boolean
}

const LandingNonPro = ({}) => {
  return <div></div>
}

const LandingPro = ({}) => {
  return <div></div>
}

const LandingTemplate: React.FC<LandingTemplateProps> = ({isPro}) => {
  return (
    <div className="pt-10">
      <h1 className="text-center font-heading text-4xl md:text-6xl sm:text-5xl">
        Learn the smart, efficient way to test any JavaScript application.
      </h1>
      <h3 className="flex justify-center items-center text-center mt-5 before:block before:bg-brand-orange before:w-4 before:h-[2px] before:mr-2 after:block after:bg-brand-orange after:w-4 after:h-[2px] after:ml-2 text-sm md:text-xl">
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
        />
        <div className="prose md:prose-md">
          <LandingCopy />
        </div>
      </div>

      {/* <p>
        <b>isPro:</b> {isPro ? 'true' : 'false'}
      </p> */}
    </div>
  )
}

export default LandingTemplate
