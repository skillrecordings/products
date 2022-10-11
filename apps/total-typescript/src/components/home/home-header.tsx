import Image from 'next/image'
import * as React from 'react'

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

export const Header = ({level}: {level?: string}) => {
  const Title = level && level !== 'beginner' ? ExpertTitle : DefaultTitle
  return (
    <header className="flex flex-col justify-center items-center overflow-hidden px-5 relative">
      <div className="max-w-screen-lg flex lg:flex-row flex-col-reverse items-center w-full relative lg:min-h-[80vh]">
        <div className="relative z-10 max-w-2xl lg:py-48 lg:pb-48 pb-10">
          <h1 className="sm:mt-0 mt-16 font-heading xl:text-6xl lg:text-5xl sm:text-5xl text-4xl font-normal xl:leading-[1.15] lg:leading-[1.15] sm:leading-[1.15] leading-[1.25] max-w-[14ch]">
            <Title />
          </h1>
          <h2 className="sm:text-2xl text-lg pt-8 font-text max-w-[28ch] bg-gradient-to-bl from-teal-200 to-cyan-200 text-transparent bg-clip-text font-normal">
            A comprehensive production-grade TypeScript training by{' '}
            <span className="text-white inline-flex items-baseline gap-2">
              Matt Pocock
            </span>
          </h2>
        </div>
        <div className="flex-shrink-0 lg:absolute -right-40 sm:scale-100 scale-150">
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
        layout="fill"
        className="object-contain object-bottom translate-y-48 select-none pointer-events-none"
        alt=""
        aria-hidden="true"
      />
    </header>
  )
}
