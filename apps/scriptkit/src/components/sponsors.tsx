import Image from 'next/legacy/image'
import React from 'react'
import sponsorsData from '../data/sponsors.json'

const Sponsors = () => {
  return process.env.NEXT_PUBLIC_SPONSORSHIP_URL ? (
    <div className="flex flex-col items-center justify-center text-center pt-10 px-5">
      <span className="font-light text-lg opacity-80">
        ScriptKit is made possible thanks to our sponsors
      </span>
      <div className="flex flex-wrap justify-center gap-10 pt-8">
        {sponsorsData.map(({company, url, image}) => {
          return (
            <a
              className="flex items-center justify-center"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              key={company}
            >
              <Image
                src={image.url}
                width={Number(image.width)}
                height={Number(image.height)}
                alt={company}
              />
            </a>
          )
        })}
        <div className="flex items-center justify-center">
          <a
            className="px-4 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 transition ease-in-out"
            href={process.env.NEXT_PUBLIC_SPONSORSHIP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Become a sponsor
          </a>
        </div>
      </div>
    </div>
  ) : null
}

export default Sponsors
