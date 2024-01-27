import * as React from 'react'
import cx from 'classnames'
import {PortableText} from '@portabletext/react'
import type {FaqProps} from '@/@types/'

const Faqs: React.FunctionComponent<{
  faqs: FaqProps[]
  className?: string
}> = ({faqs, className}) => {
  return (
    <section className={cx(className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center lg:text-start">
        FAQ
      </h2>
      <div className="grid md:grid-cols-2 md:gap-x-20 gap-y-10 md:gap-y-8 mt-4 md:mt-10 lg:mt-8">
        {faqs.map((faq, i) => {
          const {question, answer} = faq
          return (
            <div key={i}>
              <h3 className="text-2xl">{question}</h3>
              <div className="mt-2 prose md:prose-md">
                <PortableText value={answer} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Faqs
