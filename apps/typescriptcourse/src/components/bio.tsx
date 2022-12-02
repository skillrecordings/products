import React from 'react'
import Image from 'next/image'

const Bio = () => {
  return (
    <footer className="flex flex-col items-center justify-center w-full pt-16 pb-40 bg-black/30">
      <div className="flex flex-col items-center justify-center w-full max-w-screen-lg px-5 md:flex-row  md:items-start lg:px-0 md:px-10">
        <div className="pt-16 md:pt-0">
          <div className="flex items-start gap-6 max-w-2xl rounded-t-lg">
            <div className="flex-shrink-0 border-2 border-white border-opacity-90 flex items-center justify-center rounded-full overflow-hidden">
              <Image
                src={require('../../public/images/joe-previte.jpeg')}
                alt="Joe Previte"
                quality={100}
                width={90}
                height={90}
                loading="eager"
              />
            </div>
            <div className="pt-1 flex flex-col gap-5 opacity-80 sm:text-lg text-base leading-relaxed">
              <p>
                Hi! I'm Joe, and I will be your TypeScript Course instructor.
              </p>
              <p>
                I’m an Open Source TypeScript Engineer with a passion for
                teaching and learning. I help developers learn faster through
                interactive courses, and in my free time, I get people excited
                about webdev and indie hacking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

const OldBio = () => {
  return (
    <div className="flex items-start space-x-2 max-w-md">
      <div className="flex-shrink-0 border-2 border-white border-opacity-90 flex items-center justify-center rounded-full overflow-hidden">
        <Image
          src={require('../../public/images/joe-previte.jpeg')}
          alt="Joe Previte"
          quality={100}
          width={60}
          height={60}
          loading="eager"
        />
      </div>
      <div className="space-y-2">
        <div className="rounded-r-lg rounded-t-lg px-4 p-3 bg-white supports-backdrop-blur:backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10 relative flex items-center justify-center">
          <div className="absolute left-[-13px] bottom-[-1px] w-0 h-0 border-[6px] rotate-90 border-[rgba(255,255,255,0.14)_rgba(255,255,255,0.14)_transparent_transparent]" />
          <p className="opacity-90">
            Hey, I’m Joe. Your instructor for this TypeScript Course, nice to
            meet you. 😊
          </p>
        </div>
        <div className="rounded-lg px-4 p-3 bg-white supports-backdrop-blur:backdrop-blur-sm backdrop-brightness-110 bg-opacity-5 border border-white border-opacity-10">
          <p className="text-sm opacity-80">
            I’m an Open Source TypeScript Engineer with a passion for teaching
            and learning. I help developers learn faster through interactive
            courses, and in my free time, I get people excited about webdev and
            indie hacking. 👋
          </p>
        </div>
      </div>
    </div>
  )
}

export default Bio
