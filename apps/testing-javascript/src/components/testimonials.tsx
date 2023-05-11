import * as React from 'react'
import cx from 'classnames'
import {PortableText} from '@portabletext/react'
import Image from 'next/image'

const Testimonials: React.FunctionComponent<{
  // TODO Testimonials type
  testimonials: any[]
  title: string
  className?: string
}> = ({testimonials, title, className = ''}) => {
  console.log({testimonials})
  return (
    <div className={cx(className)}>
      <div className="container max-w-6xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">{title}</h1>
        <div className="grid md:grid-cols-2 md:gap-x-20 gap-y-10 md:gap-y-8 mt-8">
          {testimonials.map((testimonial, i) => {
            return (
              <div key={i}>
                <p>{testimonial.text}</p>
                <div className="mt-5 flex md:items-center space-x-4 md:space-x-5">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 mt-2 md:mt-0">
                    <Image
                      src={testimonial.author.imageUrl}
                      alt={testimonial.author.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl">{testimonial.author.name}</h3>
                    <p className="mt-1 text-base">{testimonial.author.title}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
