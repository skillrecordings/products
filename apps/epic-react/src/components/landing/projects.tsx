import React from 'react'
import Image from 'next/image'

export const Projects = () => {
  return (
    <div
      id="projects"
      className="not-prose relative mx-auto mb-16 mt-10 flex max-h-[440px] w-full max-w-screen-xl flex-wrap items-center justify-center gap-2 overflow-hidden sm:max-h-[390px]"
    >
      {new Array(12).fill({}).map((_, index) => {
        return (
          <Image
            key={index}
            src={require(`../../../public/assets/projects/${index + 1}@2x.png`)}
            alt=""
            className="max-h-[140px] w-auto sm:max-h-[190px]"
            aria-hidden="true"
            loading="eager"
            // placeholder="blur"
          />
        )
      })}
      {/* <div
        className="pointer-events-none absolute left-0 top-0 z-10 h-full w-full bg-[linear-gradient(270deg,_hsl(var(--background))_0%,_hsl(var(--background))_5%,_rgba(17,_23,_41,_0.00)_50%,_hsl(var(--background))_95%,_hsl(var(--background))_100%)] sm:bg-[linear-gradient(270deg,_hsl(var(--background))_0%,_hsl(var(--background))_10%,_rgba(17,_23,_41,_0.00)_30%,_rgba(17,_23,_41,_0.00)_70%,_hsl(var(--background))_90%,_hsl(var(--background))_100%)]" // bg-gradient-to-r from-background via-transparent to-background
        aria-hidden="true"
      /> */}
    </div>
  )
}
