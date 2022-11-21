import React from 'react'
import EmmaBostianFrame from '../../../public/emma-bostian--frame@2x.png'
import EmmaBostian from '../../../public/emma-bostian--frame-cut@2x.png'
import Image from 'next/image'

const Bio = () => {
  return (
    <div className="flex sm:flex-row flex-col items-center max-w-2xl mx-auto w-full">
      <div className="relative sm:max-w-[250px] max-w-[180px]">
        <Image
          src={EmmaBostian}
          quality={100}
          alt="Emma Bostian"
          className="relative z-20 pointer-events-none"
        />
        <div className="absolute top-0">
          <Image
            className="pointer-events-none"
            src={EmmaBostianFrame}
            aria-hidden
            alt=""
            quality={100}
          />
        </div>
      </div>
      <div className="sm:pl-10 w-full sm:text-xl">
        <p>
          My name is Emma Bostian, and I'm the author of{' '}
          <a
            href="https://technicalinterviews.dev"
            target="_blank"
            className="text-brand-brightYellow underline"
            rel="noreferrer"
          >
            De-Coding the Technical Interview Process
          </a>
          .
        </p>
        <p>
          I've been responsible for assessing the CSS skill level for
          job-seeking devs (many of whom, advanced beginners) and building
          complex UIs using CSS as a core tool.
        </p>
      </div>
    </div>
  )
}

export default Bio
