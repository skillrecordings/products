import * as React from 'react'
import Image from 'next/image'
import ImageSecretSauce from '../../../public/assets/sauce@2x.png'
import ImageStars1 from '../../../public/assets/stars-1-new@2x.png'
import ImageStars1Mobile from '../../../public/assets/stars-1-new-mobile@2x.png'
import ImageStars2 from '../../../public/assets/stars-2-new@2x.png'

const SecretSauce: React.FC<React.PropsWithChildren<any>> = ({content}) => {
  return (
    <section className="pt-14 md:pt-[52px] lg:pt-40">
      <div className="container">
        <div className="relative flex flex-col items-center justify-center text-center">
          <div className="w-[360px] md:w-[460px] lg:w-[660px]">
            <Image
              loading="eager"
              src={ImageSecretSauce}
              placeholder="blur"
              width={660}
              height={660}
              quality={100}
              alt="a dripping bottle of badass secret sauce"
              aria-hidden="true"
            />
          </div>
          <div className="relative -top-4 md:-top-[105px] lg:-top-48">
            <h3 className="font-condensed text-badass-yellow-300 text-[1.75rem] leading-[1.28]">
              {content.caption}
            </h3>
            <h2 className="lg:max-w-4xl md:max-w-[521px] font-heading text-2xl leading-[1.333] lg:leading-tight lg:text-[2rem] mt-7 lg:mt-9">
              {content.heading}
            </h2>
            <div className="absolute md:-left-24 md:top-28 lg:top-auto lg:-left-28">
              <Image
                src={ImageStars1}
                width={209}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="hidden lg:block"
              />
              <Image
                src={ImageStars1Mobile}
                width={102}
                height={99}
                alt="stars"
                aria-hidden="true"
                loading="eager"
                className="lg:hidden"
              />
            </div>
            <div className="absolute right-0 -bottom-16 md:-right-20 md:-bottom-10 lg:-right-28 lg:-bottom-24">
              <Image
                loading="eager"
                src={ImageStars2}
                width={96}
                height={96}
                alt="stars"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SecretSauce
