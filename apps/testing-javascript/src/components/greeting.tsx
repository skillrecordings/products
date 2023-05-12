import * as React from 'react'
import Image from 'next/image'
import cx from 'classnames'
import Balancer from 'react-wrap-balancer'

const Faqs: React.FunctionComponent<{
  className?: string
}> = ({className}) => {
  return (
    <section className={cx('bg-gray-100', className)}>
      <div className="container max-w-6xl">
        <div className="flex flex-col items-center lg:flex-row lg:space-x-16 py-8 lg:py-0">
          <div className="lg:self-end w-52 lg:w-72 shrink-0">
            <Image
              src="/images/portraits/kent-c-dodds-large.png"
              width={700}
              height={619}
              alt="Kent C. Dodds"
            />
          </div>
          <div className="lg:py-12 text-center lg:text-start mt-8 lg:mt-0">
            <h3 className="text-2xl md:text-3xl lg:text-4xl">
              <Balancer>
                Hi, I'm Kent C. Dodds, the creator of this course.
              </Balancer>
            </h3>
            <div className="text-lg md:text-[1.375rem] md:leading-normal mt-3 md:mt-4 lg:mt-6">
              I'm a full-stack JavaScript engineer. At PayPal I helped build
              products shipped to millions of users all over the globe. I
              represented PayPal on the TC39. I'm a Google Developer Expert and
              I've been teaching on egghead.io and Frontend Masters for years.
              I'm happily married and the father of four kids (and one dog). I
              like my family, code, JavaScript, React, and of course, testing!
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Faqs
