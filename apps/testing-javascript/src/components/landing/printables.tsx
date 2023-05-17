import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'

const Printables: React.FunctionComponent<{
  className?: string
  proTestingPurchased: boolean
}> = ({className, proTestingPurchased}) => {
  return (
    <section className={cx(className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center lg:text-start">
        Printables
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 md:gap-y-12 md:gap-x-6 lg:gap-x-3 lg:gap-y-0 mt-4 md:mt-10 lg:mt-8">
        {printables.map((printable, i) => {
          return (
            <div key={i} className="space-y-3">
              <div className="rounded-md overflow-hidden">
                <Image
                  src={printable.image}
                  alt={printable.title}
                  width={700}
                  height={440}
                />
              </div>
              <h3 className="text-xl">{printable.title}</h3>
            </div>
          )
        })}
      </div>
      {proTestingPurchased && (
        <div className="mt-12 text-center">
          <a
            href={process.env.NEXT_PUBLIC_PRINTABLES_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-tt-medium hover:underline text-2xl"
          >
            Download PDFs
          </a>
        </div>
      )}
    </section>
  )
}

export default Printables

const printables = [
  {
    title: 'The Essential Testing Glossary',
    image: '/images/printables/bonus-thumb-glossary.jpg',
  },
  {
    title: 'Full Annotated Transcripts',
    image: '/images/printables/bonus-thumb-transcripts.jpg',
  },
  {
    title: 'JavaScript Testing Poster',
    image: '/images/printables/bonus-thumb-poster.jpg',
  },
  {
    title: 'Testing Checklist',
    image: '/images/printables/bonus-thumb-checklist.jpg',
  },
]
