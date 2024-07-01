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
    <header className="relative flex flex-col items-center justify-center overflow-hidden px-5 pt-24 sm:pt-0">
      <div className="relative z-10 flex w-full max-w-screen-lg flex-col-reverse items-center lg:min-h-[80vh] lg:flex-row">
        <div className="relative z-10 max-w-2xl pb-10 lg:py-48 lg:pb-48">
          <h1 className="mt-16 w-full max-w-[14ch] font-heading text-4xl font-normal leading-[1.25] sm:mt-0 sm:text-5xl sm:leading-[1.15] lg:text-5xl lg:leading-[1.15] xl:text-6xl xl:leading-[1.15]">
            <Title />
          </h1>
          <h2 className="max-w-[28ch] text-balance bg-gradient-to-bl from-teal-200 to-cyan-200 bg-clip-text pb-8 pt-2 font-text text-lg font-normal text-transparent sm:text-2xl">
            A comprehensive production-grade TypeScript training
          </h2>
          <div className="flex items-center gap-3">
            <Image
              src={require('../../../public/matt-pocock.jpg')}
              alt="Matt Pocock"
              width={40}
              height={40}
              className="flex-shrink-0 rounded-full"
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
      <Image
        src={require('../../../public/assets/landing/bg-divider-1.png')}
        fill
        className="pointer-events-none translate-y-48 select-none object-contain object-bottom"
        alt=""
        aria-hidden="true"
      />
    </header>
  )
}
