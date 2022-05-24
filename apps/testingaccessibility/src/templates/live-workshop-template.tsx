import * as React from 'react'
import {SubscribeToConvertkitForm} from '@skillrecordings/convertkit'
import {MDXRemote} from 'next-mdx-remote'
import Layout from 'components/app/layout'
import Link from 'next/link'

const LiveWorkshopTemplate: React.FC<any> = ({workshop, source}) => {
  const {title, date, ckFormId, description, published, status, url} = workshop

  const DisplayDate = () => <time dateTime={date}>{date}</time>

  const ReservationWidget = ({
    className = 'max-w-screen-md w-full mx-auto',
  }: any) => {
    const event = url.replace('https://ti.to/', '')

    return (
      <div className={className}>
        <div className="flex flex-col items-center rounded-lg bg-white text-black relative z-20 w-full">
          <div className="flex sm:flex-row flex-col items-center w-full justify-between pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-left ">
              Sign up for this workshop
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-gray-500" />
              <DisplayDate />
            </div>
          </div>
          <a
            href={url}
            className="bg-green-600 text-white flex items-center font-dinosaur font-medium rounded-md px-5 py-3"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="pr-2">Reserve your spot</span>
            <i className="gg-arrow-right scale-75" aria-hidden />{' '}
          </a>
        </div>
      </div>
    )
  }
  const InterestForm = ({
    className = 'max-w-screen-md w-full mx-auto',
    id,
  }: any) =>
    ckFormId ? (
      <div data-workshop-interest className={className}>
        <div className="flex flex-col items-center rounded-3xl p-8 bg-white text-black border-4 border-gray-100 relative z-20 w-full">
          <div className="mb-4 flex sm:flex-row flex-col items-center w-full justify-between pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-left ">
              Interested in this workshop?
            </h2>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="text-gray-500" />
              <DisplayDate />
            </div>
          </div>
          <SubscribeToConvertkitForm
            formId={ckFormId}
            actionLabel="Join the waitlist"
            successMessage="Thanks! I'll keep you in the loop on my upcoming workshops."
            id={id}
          />
        </div>
      </div>
    ) : null

  return (
    <>
      {/* <Script src="https://js.tito.io/v2" async /> */}
      <Layout meta={{title, description}}>
        <div>
          <header className="flex flex-col items-center relative px-5 py-16 overflow-hidden text-white bg-green-700 bg-noise">
            <Link href="/workshops">
              <a className="group text-white/80 relative hover:text-white font-normal px-4 py-2 hover:bg-opacity-5 bg-opacity-0 bg-white rounded-full transition opacity-80 hover:opacity-90">
                <span className="pr-1" role="img" aria-label="left arrow">
                  ←
                </span>{' '}
                All Workshops
              </a>
            </Link>
            <h1 className="max-w-screen-md font-aglet-slab font-bold mx-auto leading-none text-center text-3xl sm:text-4xl lg:text-5xl py-4">
              {title}
            </h1>
            <div className="pt-4">
              {date && status === 'scheduled' ? (
                <div className="group px-5 py-2 rounded-full shadow-xl flex items-center space-x-2 bg-white bg-opacity-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
                  <CalendarIcon /> <DisplayDate />
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CalendarIcon />
                  <DisplayDate />
                </div>
              )}
            </div>
          </header>
          <main className="px-5">
            {published &&
              (url ? (
                <ReservationWidget className="-mb-48 mt-16 max-w-screen-md w-full" />
              ) : (
                <InterestForm
                  id="top"
                  className="-mb-48 mt-16 max-w-screen-md w-full"
                />
              ))}
            <div className="sm:py-24 py-16 mx-auto prose sm:prose-lg prose-headings:font-aglet-sans prose-p:font-aglet-slab prose-li:font-aglet-slab max-w-screen-sm">
              <MDXRemote {...source} />
            </div>
            {published &&
              (url ? <ReservationWidget /> : <InterestForm id="bottom" />)}
          </main>
        </div>
      </Layout>
    </>
  )
}

const CalendarIcon: React.FC<{className?: string}> = ({className}) => {
  const title = 'calendar'
  return (
    <svg
      className={`w-4 transition-all ease-in-out duration-150 ${className}`}
      height="20"
      width="20"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="none">
        <path
          d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1zm0 5a1 1 0 0 0 0 2h8a1 1 0 1 0 0-2H6z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </g>
    </svg>
  )
}

export default LiveWorkshopTemplate
