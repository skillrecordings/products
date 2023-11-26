import * as React from 'react'
import cx from 'classnames'
import Image from 'next/image'
import {isEmpty} from 'lodash'
import ReactMarkdown from 'react-markdown'
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
    <div className="flex flex-col items-center space-y-4 lg:flex-row lg:items-start lg:space-x-6 lg:space-y-0">
      <div className="mt-1 h-32 w-32 shrink-0 overflow-hidden rounded-md">
        {proTestingPurchased ? (
          <Link href={`/interviews/${interview.slug.current}`}>
            <ImageElem />
          </Link>
        ) : (
          <ImageElem />
        )}
      </div>
      <div className="text-center lg:text-start">
        <h3 className="font-tt-demibold text-xl">
          {proTestingPurchased ? (
            <Link href={`/interviews/${interview.slug.current}`}>
              <TitleElem />
            </Link>
          ) : (
            <TitleElem />
          )}
        </h3>
        <div className="mt-1 text-lg leading-normal">
          <Balancer>
            <ReactMarkdown>{interview.description}</ReactMarkdown>
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
    <div className="flex max-w-lg overflow-hidden rounded-md lg:max-w-none">
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
    <div className="grid grid-cols-1 place-items-start gap-x-2 gap-y-4 md:gap-y-6 lg:grid-cols-2 lg:gap-y-0">
      <div className="flex w-full shrink-0 justify-center lg:mt-2">
        {proTestingPurchased ? (
          <Link href={`/interviews/${interview.slug.current}`} className="flex">
            <ImageElem />
          </Link>
        ) : (
          <ImageElem />
        )}
      </div>
      <div className="mx-auto w-full max-w-2xl text-center lg:w-auto lg:pl-6 lg:text-start">
        <h3 className="font-tt-demibold text-xl md:text-2xl lg:text-3xl">
          {proTestingPurchased ? (
            <Link
              href={`/interviews/${interview.slug.current}`}
              className="block"
            >
              <TitleElem />
            </Link>
          ) : (
            <TitleElem />
          )}
        </h3>
        <div className="mt-1 text-lg leading-normal">
          <Balancer>
            <ReactMarkdown>{interview.description}</ReactMarkdown>
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
}> = ({proTestingPurchased, interviews, className}) => {
  const plainInterviews = interviews.filter(
    (interview) => !interview.isMultiple,
  )
  const multipleInterviews = interviews.filter(
    (interview) => interview.isMultiple,
  )
  return (
    <section className={cx(className)}>
      <h2 className="text-center text-3xl md:text-4xl lg:text-start lg:text-5xl">
        Interviews
      </h2>
      {!isEmpty(multipleInterviews) && (
        <div className="mt-4 space-y-8 md:mt-10 lg:mt-8">
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
        <div className="mt-10 grid gap-y-10 md:mt-14 md:grid-cols-2 md:gap-x-8 md:gap-y-16 lg:mt-16 lg:gap-x-16">
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
            className="font-tt-medium text-2xl text-blue-600 hover:underline"
          >
            Download All Interviews
          </a>
        </div>
      )}
    </section>
  )
}

export default Interviews
