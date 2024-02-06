import * as React from 'react'
import Image from 'next/image'

import ImageLevelUp from '../../../public/assets/level-up@2x.png'

const Header: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <header className="pt-8 md:pb-7 md:pt-5 lg:pb-7 lg:pt-20">
      <div className="container">
        <div className="flex md:flex-row flex-col items-center justify-between md:text-left text-center gap-4">
          <div className="flex items-center justify-center max-w-[660px] w-full">
            <Image
              src={ImageLevelUp}
              width={660}
              height={660}
              placeholder="blur"
              quality={100}
              priority
              loading="eager"
              alt="illustration of amanita muscoria mushroom with a level up label and little floating stars around it"
            />
          </div>
          <div className="w-full flex flex-col md:items-start items-center">
            <h3 className="font-condensed text-badass-pink-500 text-[1.75rem]">
              {content.caption}
            </h3>
            <h1 className="font-heading text-[2rem] lg:text-[3rem] xl:text-[3.5rem] leading-tight lg:leading-[1.14] mt-6 md:mt-4 lg:mt-10">
              {content.heading}
            </h1>
            <p className="text-white/70 font-medium text-lg lg:text-xl leading-[1.777] lg:leading-[1.75] mt-4 lg:mt-8">
              {content.byline}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
