import React from 'react'
import Image from 'next/image'

const TheFutureOfRemoteWorkBackground = () => {
  return (
    <>
      <div
        className="absolute top-[5%] left-32 rotate-45 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-4.svg"
          alt=""
          width={256 / 1.2}
          height={256 / 1.2}
        />
      </div>
      <div
        className="absolute top-[10%] -right-10 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-1.svg"
          alt=""
          width={155}
          height={170}
        />
      </div>
      <div
        className="absolute top-[15%] -left-16 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-1.svg"
          alt=""
          width={155}
          height={170}
        />
      </div>
      <div
        className="absolute top-[24%] right-24 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-5.svg"
          alt=""
          width={60 / 3}
          height={260 / 3}
        />
      </div>
      <div
        className="absolute top-[26%] right-2/3 -rotate-12 opacity-5"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-apple.svg"
          alt=""
          width={203 * 1.5}
          height={252 * 1.5}
        />
      </div>
      <div
        className="absolute top-[35%] right-32 rotate-180 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-7.svg"
          alt=""
          width={52 / 2}
          height={165 / 2}
        />
      </div>
      <div
        className="absolute top-[43%] -left-8 rotate-180 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-1.svg"
          alt=""
          width={155 / 1.2}
          height={170 / 1.2}
        />
      </div>
      <div
        className="absolute top-[50%] -right-16 rotate-90 opacity-20"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-9.svg"
          alt=""
          width={257 / 1.2}
          height={167 / 1.2}
        />
      </div>
      <div className="absolute top-[55%] -left-7 opacity-10" aria-hidden="true">
        <Image
          src="/the-future-of-remote-work/ornament-6.svg"
          alt=""
          width={139 / 1.5}
          height={139 / 1.5}
        />
      </div>
      <div
        className="absolute top-[63%] rotate-45 -right-2 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-smiley.svg"
          alt=""
          width={198 / 2}
          height={198 / 2}
        />
      </div>
      <div
        className="absolute top-[68%] -left-10 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-11.svg"
          alt=""
          width={284 / 2}
          height={284 / 2}
        />
      </div>
      <div
        className="absolute top-[74%] rotate-12 right-16 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-12.svg"
          alt=""
          width={239 / 3}
          height={216 / 3}
        />
      </div>
      <div className="absolute top-[81%] left-32 opacity-10" aria-hidden="true">
        <Image
          src="/the-future-of-remote-work/ornament-5.svg"
          alt=""
          width={60 / 2.2}
          height={260 / 2.2}
        />
      </div>
      <div
        className="absolute top-[84%] -right-8 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-1.svg"
          alt=""
          width={155 / 1.2}
          height={170 / 1.2}
        />
      </div>
      <div
        className="absolute top-[88.5%] -left-2 rotate-45 opacity-10"
        aria-hidden="true"
      >
        <Image
          src="/the-future-of-remote-work/ornament-14.svg"
          alt=""
          width={166 / 1.75}
          height={198 / 1.75}
        />
      </div>
    </>
  )
}

const TheValueOfValuesExample: React.FC<
  React.PropsWithChildren<React.PropsWithChildren<{number?: Number}>>
> = ({children, number}) => {
  const childrenArr: React.ReactNode[] = React.Children.toArray(children)
  const firstElement: React.ReactNode = childrenArr[0]
  const header: React.ReactNode =
    React.isValidElement(firstElement) &&
    React.createElement(
      'div',
      {
        className: 'text-3xl font-semibold font-din uppercase relative z-10',
      },
      firstElement.props.children,
    )
  const byline: React.ReactNode = childrenArr.filter(
    (ch: React.ReactNode, i) =>
      React.isValidElement(ch) && ch.props.mdxType === 'Byline',
  )
  const body: React.ReactNode = childrenArr.filter(
    (ch: React.ReactNode) =>
      React.isValidElement(ch) && ch.props.mdxType === 'Body',
  )

  return (
    <section className="lg:-mx-10 sm:-mx-5 -mx-2 sm:px-10 px-8 bg-black pt-4 sm:pt-6 rounded-lg overflow-hidden shadow-xl bg-opacity-90 sm:my-16 my-10 relative space-y-8">
      <div className="font-din text-7xl absolute right-8 top-10 text-transparent bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700 bg-clip-text pointer-events-none">
        {number && ('0' + number).slice(-2)}
      </div>
      <div>{header}</div>
      <div className="italic">{byline}</div>
      <div className="pb-12 lg:-mx-10 sm:-mx-10 -mx-8 sm:px-10 px-8 border-l-2 border-orange-400">
        {body}
      </div>
    </section>
  )
}

export {TheFutureOfRemoteWorkBackground, TheValueOfValuesExample}
