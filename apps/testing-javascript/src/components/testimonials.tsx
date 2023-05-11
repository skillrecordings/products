import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'
import type {TestimonialProps} from '@types'

const Testimonials: React.FunctionComponent<{
  testimonials: TestimonialProps[]
  title: string
  className?: string
}> = ({testimonials, title, className = ''}) => {
  return (
    <section className={cx(className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl">{title}</h2>
      <div className="grid md:grid-cols-2 md:gap-x-20 gap-y-10 md:gap-y-8 mt-4 md:mt-6 lg:mt-8">
        {testimonials.map((testimonial, i) => {
          return (
            <div key={i}>
              <p>&#34;{testimonial.text}&#34;</p>
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
                  <p className="mt-1 text-base opacity-80">
                    {testimonial.author.title}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Testimonials
