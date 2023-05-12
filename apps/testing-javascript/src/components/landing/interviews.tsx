import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'
import {isEmpty} from 'lodash'
import {PortableText} from '@portabletext/react'
import Balancer from 'react-wrap-balancer'
import type {InterviewProps} from '@types'
import Link from 'next/link'

const PlainInterview: React.FC<{
  interview: InterviewProps
  proTestingPurchased: boolean
}> = ({interview, proTestingPurchased}) => {
  const ImageElem = () => (
    <Image
      src={interview.portraits.image1.url}
      alt={interview.portraits.image1.alt}
      width={500}
      height={500}
    />
  )
  const TitleElem = () => <Balancer>{interview.title}</Balancer>
  return (
    <div className="flex flex-col items-center lg:items-start lg:flex-row space-y-4 lg:space-x-6 lg:space-y-0">
      <div className="w-32 h-32 overflow-hidden rounded-md shrink-0 mt-1">
        {proTestingPurchased ? (
          <Link href={`/interviews/${interview.slug}`}>
            <ImageElem />
          </Link>
        ) : (
          <ImageElem />
        )}
      </div>
      <div className="text-center lg:text-start">
        <h3 className="text-xl font-tt-demibold">
          {proTestingPurchased ? (
            <Link href={`/interviews/${interview.slug}`}>
              <TitleElem />
            </Link>
          ) : (
            <TitleElem />
          )}
        </h3>
        <div className="mt-1 text-lg leading-normal">
          <Balancer>
            <PortableText value={interview.description} />
          </Balancer>
        </div>
      </div>
    </div>
  )
}

const MultipleInterview: React.FC<{
  interview: InterviewProps
  proTestingPurchased: boolean
}> = ({interview, proTestingPurchased}) => {
  const ImageElem = () => (
    <div className="overflow-hidden rounded-md flex max-w-lg lg:max-w-none">
      <div className="aspect-square w-1/2">
        <Image
          src={interview.portraits.image1.url}
          alt={interview.portraits.image1.alt}
          width={500}
          height={500}
        />
      </div>
      {interview.portraits?.image2?.url && (
        <div className="aspect-square w-1/2">
          <Image
            src={interview.portraits.image2.url}
            alt={interview.portraits.image2.alt}
            width={500}
            height={500}
          />
        </div>
      )}
    </div>
  )
  const TitleElem = () => <Balancer>{interview.title}</Balancer>
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 md:gap-y-6 lg:gap-y-0 gap-x-2 place-items-start">
      <div className="shrink-0 lg:mt-2 flex justify-center w-full">
        {proTestingPurchased ? (
          <Link href={`/interviews/${interview.slug}`} className="flex">
            <ImageElem />
          </Link>
        ) : (
          <ImageElem />
        )}
      </div>
      <div className="lg:pl-6 text-center lg:text-start w-full max-w-2xl mx-auto lg:w-auto">
        <h3 className="text-3xl font-tt-demibold">
          {proTestingPurchased ? (
            <Link href={`/interviews/${interview.slug}`}>
              <TitleElem />
            </Link>
          ) : (
            <TitleElem />
          )}
        </h3>
        <div className="mt-1 text-lg leading-normal">
          <Balancer>
            <PortableText value={interview.description} />
          </Balancer>
        </div>
      </div>
    </div>
  )
}

const Interviews: React.FunctionComponent<{
  proTestingPurchased: boolean
  interviews: InterviewProps[]
  className?: string
}> = ({proTestingPurchased, interviews, className = ''}) => {
  const plainInterviews = interviews.filter(
    (interview) => !interview.isMultiple,
  )
  const multipleInterviews = interviews.filter(
    (interview) => interview.isMultiple,
  )
  return (
    <section className={cx(className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-center lg:text-start">
        Interviews
      </h2>
      {!isEmpty(multipleInterviews) && (
        <div className="mt-4 md:mt-10 lg:mt-8 space-y-8">
          {multipleInterviews.map((multipleInterview) => {
            return (
              <MultipleInterview
                key={multipleInterview.slug.current}
                interview={multipleInterview}
                proTestingPurchased={proTestingPurchased}
              />
            )
          })}
        </div>
      )}
      {!isEmpty(plainInterviews) && (
        <div className="grid md:grid-cols-2 md:gap-x-8 lg:gap-x-16 gap-y-10 md:gap-y-16 mt-10 md:mt-14 lg:mt-16">
          {plainInterviews.map((plainInterview) => {
            return (
              <PlainInterview
                key={plainInterview.slug.current}
                interview={plainInterview}
                proTestingPurchased={proTestingPurchased}
              />
            )
          })}
        </div>
      )}
      {proTestingPurchased && (
        <div className="mt-12 text-center">
          <a
            href={process.env.NEXT_PUBLIC_PRINTABLES_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-tt-medium hover:underline text-2xl"
          >
            Download All Interviews
          </a>
        </div>
      )}
    </section>
  )
}

export default Interviews
