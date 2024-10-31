import Image from 'next/image'
import * as React from 'react'
import {SkillLevel} from './use-skill-level'

const DefaultTitle = () => {
  return (
    <>
      Become the <strong className="font-extrabold">TypeScript Wizard</strong>{' '}
      at Your Company
    </>
  )
}

const ExpertTitle = () => {
  return (
    <>
      You will be the{' '}
      <strong className="font-extrabold">TypeScript Wizard</strong> at Your
      Company
    </>
  )
}

export const Header = ({level}: {level?: SkillLevel}) => {
  const Title = level && level.rank > 3 ? ExpertTitle : DefaultTitle
  return (
    <header className="relative -mt-16 flex flex-col items-center justify-center overflow-hidden px-5 pt-24 sm:pt-0 lg:mt-0">
      <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center text-center  lg:flex-row lg:text-left">
        <div className="relative z-10 -mt-8 flex w-full max-w-2xl flex-col items-center bg-gradient-to-b from-transparent via-background to-background pb-10 lg:mt-0 lg:items-start lg:via-transparent lg:to-transparent lg:py-48 lg:pb-48">
          <h1 className="mt-16 w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] drop-shadow-md sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
            <Title />
          </h1>
          <h2 className="mt-3 max-w-[35ch] text-balance bg-gradient-to-bl from-teal-200 to-cyan-200 bg-clip-text pb-8 font-text text-lg font-normal text-transparent sm:text-2xl">
            Master the deep magic of types with bite-sized challenges that
            stretch your brain
          </h2>
          <div className="flex items-center gap-3 sm:text-lg">
            <Image
              src={require('../../../public/matt-pocock.jpg')}
              alt="Matt Pocock"
              width={48}
              height={48}
              className="w-10 flex-shrink-0 rounded-full sm:w-auto"
              priority
            />
            Matt Pocock
          </div>
        </div>
        <div className="pointer-events-none -right-40 flex-shrink-0 scale-150 select-none sm:scale-100 lg:absolute">
          <Image
            src={require('../../../public/assets/wizard-in-a-cave@2x.png')}
            alt=""
            aria-hidden="true"
            width={890 / 1.15}
            height={960 / 1.15}
            quality={100}
            priority
            placeholder="blur"
          />
        </div>
      </div>
      {/* <Image
        src={require('../../../public/assets/landing/bg-divider-1.png')}
        fill
        className="pointer-events-none translate-y-48 select-none object-contain object-bottom"
        alt=""
        aria-hidden="true"
      /> */}
    </header>
  )
}
